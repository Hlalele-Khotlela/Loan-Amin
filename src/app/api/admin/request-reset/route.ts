// /src/app/api/admin/request-reset/route.ts
import { prisma } from "@/lib/prisma/prisma";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
     const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const uuid = randomUUID();
    const jwtToken = jwt.sign(
      { adminId: admin.admin_Id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    await prisma.passwordReset.create({
      data: {
        adminId: admin.admin_Id,
        tokenId: uuid,
        jwtHash: await bcrypt.hash(jwtToken, 10),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    // Build reset link for localhost (dev)
   
   const link = `http://localhost:9002/admin/reset-password?token=${encodeURIComponent(jwtToken)}&id=${uuid}`;

   const transporter = nodemailer.createTransport({ 
    service: 'gmail', 
    // from Mailtrap dashboard
     port: 587, 
     auth: { 
      user: process.env.GMAIL_USER,
       // set in .env
        pass: process.env.GMAIL_PASS!,
         // set in .env 
         },
         }); 
         // Send email 
         await transporter.sendMail({
           from: 'treasurehunters034@gmail.com', 
           to: email, 
           subject: "Password Reset Request", 
           text: `Click here to reset your password: ${link}`, 
           html: `
           <p>Click here to reset your password:</p><a href="${link}">${link}</a>`, });


console.log("Password reset link:", link);

    // TODO: send email with link (e.g. Nodemailer, Resend)
   

    return NextResponse.json({
      message: "Password reset link generated",
      link, // helpful for dev testing
    });
  } catch (err) {
    console.error("Request reset error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
