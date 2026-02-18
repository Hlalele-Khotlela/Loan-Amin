import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma/prisma";

function redirect(url: URL, pathname: string) {
  url.pathname = pathname;
  return NextResponse.redirect(url);
}

function ownsResource(path: string, userMemberId: string, prefix: string) {
  const segments = path.split("/").filter(Boolean);


  const prefixIndex = segments.findIndex(
    seg => seg.toLowerCase() === prefix.toLowerCase()
  );
  if (prefixIndex === -1) {
   
    return false;
  }

  let memberId: string | undefined;
  if (segments[prefixIndex + 1]?.toLowerCase() === "allsavings") {
    memberId = segments[prefixIndex + 2];
  } else {
    memberId = segments[prefixIndex + 1];
  }



  return memberId === String(userMemberId);
}


export async function proxy(req: NextRequest) {
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  const url = req.nextUrl.clone();
  const path = req.nextUrl.pathname;

  if (!token) return redirect(url, "/login");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    const role = payload.role as "User" | "Admin" | "CreditMember" | "Audit" | "Staff";
    const userMemberId = String(payload.memberId);

  

    // --- Route Guards ---
    if (path.startsWith("/admin/Loans")) {
      if (["Admin", "CreditMember", "Audit"].includes(role)) return NextResponse.next();
      if (role === "User" && ownsResource(path, userMemberId, "Loans")) return NextResponse.next();
      return redirect(url, "/unauthorized");
    }

    if (path.startsWith("/admin/savings")) {
      if (role === "Admin") return NextResponse.next();
      if (["User", "CreditMember", "Audit"].includes(role) && ownsResource(path, userMemberId, "Savings")) {
        return NextResponse.next();
      }
      return redirect(url, "/unauthorized");
    }

    if (path.startsWith("/admin/dashboard/groups")) {
      const groupId = path.split("/")[4];
      if (["Admin", "CreditMember", "Audit"].includes(role)) return NextResponse.next();

      if (["User", "CreditMember", "Audit"].includes(role)) {
        const membership = await prisma.groupSaving.findFirst({
          where: {
            group_id: Number(groupId),
            members: { some: { member_Id: Number(userMemberId) } },
          },
        });
        if (membership) return NextResponse.next();
        
        return NextResponse.redirect(url);
      }
    }

    if (path.startsWith("/admin") && !["Admin", "CreditMember", "Audit"].includes(role)) {
      return redirect(url, "/unauthorized");
    }

    if (path.startsWith("/staff") && !["Admin", "Staff"].includes(role)) {
      return redirect(url, "/unauthorized");
    }

    if (path.startsWith("/user") && !["User", "CreditMember", "Audit", "Admin"].includes(role)) {
      return redirect(url, "/unauthorized");
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return redirect(url, "/login");
  }
}

export const config = {
  matcher: [
    "/admin/:path((?!login).*)",
    "/staff/:path*",
    "/user/:path*",
  ],
};
