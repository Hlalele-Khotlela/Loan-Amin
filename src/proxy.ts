import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
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
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    const role = payload.role;

    if (path.startsWith("/admin") && role !== "Admin") {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    if (path.startsWith("/staff") && role !== "Admin" && role !== "Staff") {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    if (path.startsWith("/user") && role !== "User" && role !== "Admin") {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
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
