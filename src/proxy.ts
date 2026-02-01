import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma/prisma";


export async function proxy(req: NextRequest) {
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  const url = req.nextUrl.clone();
  const path = req.nextUrl.pathname;

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    const role = payload.role;            // "User" | "Admin" | "CreditMember"
    const userMemberId = String(payload.memberId);

    // Helper: ownership check
    function ownsResource(path: string, prefix: string) {
      const segments = path.split("/");
      const memberId = segments[3]; // /admin/{prefix}/[memberId]/...
      return memberId === userMemberId;
    }

    // Loans
    if (path.startsWith("/admin/Loans")) {
      if (role === "Admin") return NextResponse.next();
      if ((role === "User" || role === "CreditMember") && ownsResource(path, "Loans")) {
        return NextResponse.next();
      }
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    // Savings
    if (path.startsWith("/admin/Savings")) {
      if (role === "Admin") return NextResponse.next();
      if ((role === "User" || role === "CreditMember") && ownsResource(path, "Savings")) {
        return NextResponse.next();
      }
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    // GroupSavings
    if (path.startsWith("/admin/dashboard/groups")) {
      const segments = path.split("/");
      const groupId = segments[4]; // /admin/dashboard/groups/[groupId]/...
      if (role === "Admin" || role === "CreditMember"){ 
        return NextResponse.next();
      }

      if ((role === "User" || role === "CreditMember") ) {
        const membership = await prisma.groupSaving.findFirst({
          where: {
            group_id: Number(groupId),
            members: {
              some: {
                member_Id: Number(userMemberId),
              },
            },
          },
        });
        if (membership){
          return NextResponse.next();
        }
        return NextResponse.next();

      }
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    // General admin routes (other than Loans/Savings/GroupSavings)
    if (path.startsWith("/admin") && role !== "Admin" && role !== "CreditMember") {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    // Staff routes
    if (path.startsWith("/staff") && role !== "Admin" && role !== "Staff") {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    // User routes
    if (path.startsWith("/user") && !["User", "CreditMember", "Admin"].includes(role)) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    "/admin/:path((?!login).*)",
    "/staff/:path*",
    "/user/:path*",
  ],
};
