// /app/api/LoanRequests/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma/prisma";
import { Prisma } from "@prisma/client";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action"); // "approve" or "reject"

  if (!["approve", "reject"].includes(action ?? "")) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // Require at least 3 comments
  const commentsCount = await prisma.loanRequestComments.count({
    where: { request_id: Number(id) },
  });

  if (commentsCount < 3) {
    return NextResponse.json(
      { error: "At least three comments are required before updating status" },
      { status: 400 }
    );
  }

  // Update loan request status
  const newStatus = action === "approve" ? "approved" : "rejected";
  const updated = await prisma.loanrequest.update({
    where: { request_id: Number(id) },
    data: { status: newStatus },
  });

  // If rejected, just return
  if (newStatus === "rejected") {
    return NextResponse.json({ updated });
  }

  // If approved, create loan
  const loanrequestdetails = await prisma.loanrequest.findUnique({
    where: { request_id: Number(id) },
    include: { collectrals: true },
  });

  if (!loanrequestdetails) {
    return NextResponse.json({ error: "Loan request not found" }, { status: 404 });
  }

  const amount = updated.amount;
  const rate = new Prisma.Decimal("0.01");
  const loanDuration = Number(updated.Loan_Duration ?? 0);

  if (loanDuration <= 0) {
    return NextResponse.json(
      { error: "Loan duration must be greater than zero" },
      { status: 400 }
    );
  }

  const totalInterest = amount.mul(rate).mul(loanDuration);
  const amountPayable = amount.add(totalInterest);
  const minInstallment = amountPayable.dividedBy(loanDuration);

  // check if loan type is already exists for the member
  const existingLoan = await prisma.loan.findFirst({
    where: {
      member_Id: updated.member_Id,
      loan_type: updated.loan_type,
      status: "active",
    },
  });

  let loanRecord;
  if (existingLoan) {
    loanRecord = await prisma.loan.update({
      where: { loan_id: existingLoan.loan_id },
      data: {
        
        totals_payeable: existingLoan.totals_payeable.add(amountPayable),
        balance: existingLoan.balance.add(amountPayable),
        Loan_Duration: existingLoan.Loan_Duration + loanDuration,
      },
      
    });
   
   if (loanrequestdetails.collectrals.length > 0) {
    await prisma.loanColletralInfo.createMany({
      data: loanrequestdetails.collectrals.map((c) => ({
        loan_id: existingLoan?.loan_id,
        name: c.name,
        phone: c.phone,
        Type: c.Type,
      })),
    });
  }
    return NextResponse.json({ updated, loanRecord });
  }
  else {
    // Create new loan record
  

  const newLoan = await prisma.loan.create({
    data: {
      member_Id: updated.member_Id,
      loan_type: updated.loan_type,
      Loan_Duration: updated.Loan_Duration,
      Principal: updated.amount,
      instalments: new Prisma.Decimal(0),
      intrests: totalInterest,
      totals_payeable: amountPayable,
      balance: amountPayable,
      status: "active",
      MinInstament: minInstallment,
    },
  });

  if (loanrequestdetails.collectrals.length > 0) {
    await prisma.loanColletralInfo.createMany({
      data: loanrequestdetails.collectrals.map((c) => ({
        loan_id: newLoan.loan_id,
        name: c.name,
        phone: c.phone,
        Type: c.Type,
      })),
    });
  }

  return NextResponse.json({ updated, newLoan });
}
}