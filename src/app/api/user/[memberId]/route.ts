import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params:Promise< { memberId: string } >}
) {
  const {memberId} = await params;
  try {
    // ✅ Read cookie
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Verify secret
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    // ✅ Decode token
    const decoded: any = jwt.verify(token, secret);

    const member_Id = Number(memberId);
    if (isNaN(member_Id)) {
      return NextResponse.json({ error: "Invalid memberId" }, { status: 400 });
    }

    console.log("API received memberId:", memberId);
    console.log("API decoded token id:", decoded.id);

    // ✅ Ensure token matches route param
    if (decoded.id !== member_Id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ Query Prisma
    const member = await prisma.member.findUnique({
      where: { member_Id: member_Id },
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

    return NextResponse.json({ member });
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
