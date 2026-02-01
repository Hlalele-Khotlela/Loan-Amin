// src/app/api/LoanRequests/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const loanId = Number((await params).id);

    const loan = await prisma.loanrequest.findUnique({
      where: { request_id: loanId },
      include: {
        member: true,         // include member details
        collectrals: true,
        LoanRequestComments:{
          include:{author:true}
        }    // include collateral contacts
      },
    });

    if (!loan) {
      return NextResponse.json(
        { error: "Loan request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(loan);
  } catch (err) {
    console.error("Loan request fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch loan request" },
      { status: 500 }
    );
  }
}
