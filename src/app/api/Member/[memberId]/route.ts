import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const { memberId } = await params;

  const member = await prisma.member.findUnique({
    where: { member_Id: Number(memberId) },
    include: {
      groupSavings: true,
      GroupDeposits: true,
      GroupWithdrawal: true,
      loan: {
        include: {
          transactions: true,
        },
        
      },
      loanrequest: true,
      savings: {
        include: {
          transactions: true,
        },
      }
    },
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json(member);
}
