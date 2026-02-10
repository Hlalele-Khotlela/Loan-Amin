import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign(  
    { id: admin.admin_Id, email: admin.email, role: "Admin" },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
console.log("Returning response:", admin);




 (await cookies()).set({
  name:"token",
  value:token,
  httpOnly:true,
  path:"/",
  maxAge:3600,
 });

  return NextResponse.json({success: true, admin});
}
