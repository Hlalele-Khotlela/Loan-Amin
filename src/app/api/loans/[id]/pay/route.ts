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

  const paymentDecimal= new Prisma.Decimal(paymentAmount);
  const newBalance = loan.balance.sub(paymentDecimal);
  const newInstallment= loan.instalments.add(paymentDecimal);



  const updatedLoan = await prisma.loan.update({
    where: { loan_id: loanId },
    data: { balance: loan.balance.sub(paymentDecimal),
        instalments: loan.instalments.add(paymentDecimal),
     },
  });

  return NextResponse.json(updatedLoan);
}
