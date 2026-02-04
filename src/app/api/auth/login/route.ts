import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, memberId } = await req.json();

    // ✅ Find member by ID
    const member = await prisma.member.findUnique({
      where: { member_Id: Number(memberId) },
    });

    if (!member || member.email !== email) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Sign JWT
    const token = jwt.sign(
      {
        id: member.member_Id,
        email: member.email,
        role: member.Role,
        memberId: member.member_Id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // ✅ Create response and set cookie properly
    const response = NextResponse.json({ success: true, member });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,   // secure: not accessible via JS
      path: "/",        // available across the app
      maxAge: 3600,     // 1 hour
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
