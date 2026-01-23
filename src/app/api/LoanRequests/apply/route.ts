import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      memberId,
      loanType,
      amount,
      duration,
      collateralType,
      collateral1,
      collateral2,
      collateral3,
    } = body;
console.log("body :", body)
    // Basic validation
    if (!memberId || !loanType || !amount || !collateralType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const loan = await prisma.loanrequest.create({
      data: {
        member_Id: Number(memberId),
        applicant: "hlalele",
        amount: amount,
        loan_type: loanType,
        status: "Pending",

        // FIXED: use the correct field names
        collectral: collateralType,
        collectralName1: collateral1,
        collectralName2: collateral2,
        collectralName3: collateral3,

        Loan_Duration: Number(duration),
      },
    });

    return NextResponse.json(
      { message: "Loan application submitted successfully", loan },
      { status: 201 }
    );
  } catch (error) {
    console.error("Loan application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
