import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, memberId } = await req.json();

    const member = await prisma.member.findUnique({
      where: { member_Id: Number(memberId) },
    });

    if (!member || member.email !== email) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: member.member_Id, 
        email: member.email, 
        role: member.Role,
        memberId: member.member_Id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json({ success: true, member });
    

    // 🔥 The ONLY cookie format Firefox + Next.js 16 accepts in dev mode
    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; Max-Age=3600`
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
