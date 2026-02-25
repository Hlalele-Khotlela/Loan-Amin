// /src/app/api/admin/reset-password/route.ts
import { prisma } from "@/lib/prisma/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, id, newPassword } = await req.json();

    // Debug logs
    console.log("Received token:", token);
    console.log("Received id:", id);

    if (!token || !id || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { tokenId: id },
    });

    if (!resetRecord) {
      return NextResponse.json({ error: "Reset record not found" }, { status: 404 });
    }

    if (resetRecord.used) {
      return NextResponse.json({ error: "Reset token already used" }, { status: 400 });
    }

    if (resetRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: "Reset token expired" }, { status: 400 });
    }

    let payload: { adminId: number };
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as { adminId: number };
      console.log("Decoded payload:", payload);
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return NextResponse.json({ error: "Token expired" }, { status: 400 });
      }
      if (err.name === "JsonWebTokenError") {
        return NextResponse.json({ error: "Malformed or invalid token" }, { status: 400 });
      }
      return NextResponse.json({ error: "Token verification failed" }, { status: 400 });
    }

    if (payload.adminId !== resetRecord.adminId) {
      return NextResponse.json({ error: "Token mismatch" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { admin_Id: resetRecord.adminId },
      data: { password: hashedPassword },
    });

    await prisma.passwordReset.update({
      where: { tokenId: id },
      data: { used: true },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
