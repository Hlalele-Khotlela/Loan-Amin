import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import jwt from "jsonwebtoken";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ memberId: string }> }
) {
  try {
    // ⭐ FIX: unwrap the promise
    const { memberId } = await context.params;
    const member_Id = Number(memberId);

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const decoded: any = jwt.verify(token, secret);

    console.log("API received memberId:", member_Id);
    console.log("API decoded token id:", decoded.id);

    if (decoded.id.toString() !== memberId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const member = await prisma.member.findUnique({
      where: { member_Id },
      include: {
        groupSavings: true,
        GroupDeposits: true,
        GroupWithdrawal: true,
        loan: { include: { transactions: true } },
        loanrequest: true,
        savings: { include: { transactions: true } },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
