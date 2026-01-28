// /app/api/LoanRequests/[id]/route.ts
import { NextResponse } from "next/server";
import  {prisma} from "../../../../../lib/prisma/prisma";
import {Prisma} from "@prisma/client";

export async function PATCH(req: Request, context: {params: Promise<{ id: string }>}) {
  const { id } = await context.params;
  const { status } = await req.json();
  console.log("Updating request ID:", id, "to status:", status);

  const updated = await prisma.loanrequest.update({
    where: { request_id: Number(id) },
    data: { status },
  });
  
   
  // check if loan already exists
  const existingLoan = await prisma.loanrequest.findUnique({
    where: {request_id: Number(id) }
  });

  const amount = updated.amount;
  const intrest=  new Prisma.Decimal(0);
  const totalAmount= amount.add(intrest);
  const installment = new Prisma.Decimal(0);
  const balance = totalAmount.sub(installment);

 
     const rate =new Prisma.Decimal("0.01");
     
 
     const loanDuration = Number(updated.Loan_Duration?? 0);
     const totalInterest =amount.mul(rate).mul(loanDuration);
 
   
      
     
      const amountPayeable = amount.add(totalInterest);
      const minInstallment= amountPayeable.dividedBy(loanDuration);

    const newLoan = await prisma.loan.create({
      data: {
        member_Id: updated.member_Id,
      // name: body.name,
      loan_type: updated.loan_type,
      Loan_Duration: updated.Loan_Duration,
      Principal: updated.amount,
      
      instalments: installment,
      intrests: intrest,
      totals_payeable: amountPayeable,
      balance: balance,
      status: "active",
      collectral: updated.collectral,
      collectralName1: updated.collectralName1,
      collectralName2: updated.collectralName2,
      collectralName3: updated.collectralName3,
      MinInstament: minInstallment,
        
      }
    })


  return NextResponse.json({updated, newLoan});
}

 