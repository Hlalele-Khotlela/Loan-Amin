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

    const newLoan = await prisma.loan.create({
      data: {
        request_id: updated.request_id,
        amount: updated.amount,
        name: updated.applicant ?? "",                          
        intrests: intrest,
        totals : totalAmount,
        loan_type: updated.loan_type,
        balance : balance,
        instalments: installment,
        member_Id: updated.member_Id,
        
      }
    })


  return NextResponse.json({updated, newLoan});
}
