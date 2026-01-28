import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma/prisma";
import { Prisma } from "@/prisma/generated/client/edge";

export async function POST(req: Request) {
  const body = await req.json();

   const intrest = new Prisma.Decimal(body.intrests ?? 0);
   const rate =new Prisma.Decimal("0.02");
   
   const amount = new Prisma.Decimal(body.amount ?? 0);
   const loanDuration = Number(body.Duration?? 0);
   const totalInterest =amount.mul(rate).mul(loanDuration);
    // const intrest=  new Prisma.Decimal(0);
    // const amount= body.amount;
    const totalAmount= amount.add(intrest);
    const installment = new Prisma.Decimal(0);
    const balance = totalAmount.sub(installment);
    const amountPayeable = amount.add(totalInterest);
    const minInstallment= amountPayeable.dividedBy(loanDuration);

  const loan = await prisma.loan.create({
    data: {
      member_Id: body.member_Id,
      // name: body.name,
      loan_type: body.loan_type,
      Loan_Duration: loanDuration,
      Principal: amount,
      
      instalments: installment,
      intrests: intrest,
      totals_payeable: amountPayeable,
      balance: balance,
      status: "active",
      collectral: body.Collectral,
      collectralName1: body.CollectralName1,
      collectralName2: body.CollectralName2,
      collectralName3: body.CollectralName3,
      MinInstament: minInstallment,
    //   request_id: Date.now(), // unique request id
    },
  });

  // record this event to transactions of loans

  await prisma.loanTransaction.create({
    data: {
      loan_id: loan.loan_id,
      member_Id:loan.member_Id,
      type: "issued",
      amount: loan.Principal,
      new_balance:loan.balance,
    }
  })

  return NextResponse.json(loan);
}
