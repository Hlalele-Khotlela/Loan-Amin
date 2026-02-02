import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import { loanAggregations } from "@/lib/loan-qualification/aggregations";
import { checkRevolvingEligibility } from "@/lib/revolving";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { memberId, loanType, amount, duration, collateralType, collaterals, accountNumber, requestType } = body;

    const memberIDNum = Number(memberId);
    const limits = await loanAggregations(memberIDNum);

    const maxLimit =
      loanType === "SHORT_TERM"
        ? limits.shortTermLimit
        : loanType === "EMERGENCY"
        ? limits.EmergencyLimit
        : limits.longTermLimit;

    if (Number(amount) > maxLimit) {
      return NextResponse.json(
        { error: `Requested amount exceeds your limit of ${maxLimit}` },
        { status: 400 }
      );
    }

    if (!memberId || !loanType || !amount || !collateralType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 410 });
    }

    const existingLoan = await prisma.loan.findFirst({
      where: { member_Id: memberIDNum, loan_type: loanType, status: "active" },
      select: { Principal: true, instalments: true, balance: true, loan_type: true, status: true },
    });

    if (existingLoan) {
      const result = checkRevolvingEligibility(existingLoan, {
        shortTermLimit: limits.shortTermLimit,
        EmergencyLimit: limits.EmergencyLimit,
      });

      if (!result.eligible) {
        return NextResponse.json({ error: result.reason }, { status: 400 });
      }
    }

    const loan = await prisma.loanrequest.create({
      data: {
        member_Id: memberIDNum,
        applicant: memberId.toString(),
        amount,
        loan_type: loanType,
        status: "Pending",
        accountNumber,
        type: requestType,
        collectrals: body.collectrals,
        Loan_Duration: Number(duration),
      },
    });

    if (Array.isArray(collaterals) && collaterals.length > 0) {
      await prisma.loanColletralInfo.createMany({
        data: collaterals.map((c: { name: string; phoneNumber: string }) => ({
          request_id: loan.request_id,
          name: c.name,
          phone: c.phoneNumber,
          Type: collateralType,
        })),
      });
    }

    return NextResponse.json({ message: "Loan application submitted successfully", loan }, { status: 201 });
  } catch (error) {
    console.error("Loan application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
