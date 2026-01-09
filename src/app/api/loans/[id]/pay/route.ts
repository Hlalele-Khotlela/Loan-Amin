// src/app/api/loans/[id]/pay/route.ts
import { prisma } from "../../../../../lib/prisma/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, context: {params: Promise<{ id: string}>}) {
  const {id} = await context.params;
  const loanId = parseInt(id, 10);
  const { paymentAmount } = await req.json();

  console.log("PATCH body:", paymentAmount);


  if (paymentAmount === undefined || isNaN(paymentAmount)) {
     return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 }); }

     
  
  const loan = await prisma.loan.findUnique({ where: { loan_id: loanId } });
  if (!loan) return NextResponse.json({ error: "Loan not found" }, { status: 404 });

  if(paymentAmount<= 0 || paymentAmount > Number(loan.balance)){
    return NextResponse.json({error: "Invalid Payment Amount"}, {status: 404});
  }

  const paymentDecimal= new Prisma.Decimal(paymentAmount);
  const newBalance = loan.balance.sub(paymentDecimal);
//   const newInstallment= loan.instalments.add(paymentDecimal);



  const updatedLoan = await prisma.loan.update({
    where: { loan_id: loanId },
    data: { balance: newBalance,
        instalments: loan.instalments.add(paymentDecimal),
        status: newBalance.lessThanOrEqualTo(0)? "completed" : "active",
     },
  });

  // record transactions
  await prisma.loanTransaction.create({
    data: {
      loan_id: updatedLoan.loan_id,
      member_Id: loan.member_Id,
      type: "repayment",
      amount: paymentAmount,
      new_balance: newBalance,
    }
  })

  return NextResponse.json(updatedLoan);
}
