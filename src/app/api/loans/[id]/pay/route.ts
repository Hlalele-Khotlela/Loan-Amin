// src/app/api/loans/[id]/pay/route.ts
import { prisma } from "../../../../../lib/prisma/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, context: {params: Promise<{ id: string}>}) {
  const {id} = await context.params;
  const loanId = parseInt(id, 10);
  const { paymentAmount } = await req.json();
  

  if (paymentAmount === undefined || isNaN(paymentAmount)) {
     return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 }); }

     
  
  const loan = await prisma.loan.findUnique({ where: { loan_id: loanId } });
  if (!loan) return NextResponse.json({ error: "Loan not found" }, { status: 404 });

  if(paymentAmount<= 0 || paymentAmount > Number(loan.balance)){
    return NextResponse.json({error: "Invalid Payment Amount"}, {status: 404});
  }

  const paymentDecimal= new Prisma.Decimal(paymentAmount);
  const loanInterestPayment= paymentDecimal.mul(0.01); // 1% interest on payment
  const principalPayment= paymentDecimal.sub(loanInterestPayment);
  const updatedInterest= loan.intrests.sub(loanInterestPayment);
  const updatedPrincipal= loan.Principal.sub(principalPayment);
  const newBalance = loan.balance.sub(paymentDecimal);
//   const newInstallment= loan.instalments.add(paymentDecimal);



  const updatedLoan = await prisma.loan.update({
    where: { loan_id: loanId },
    data: { balance: newBalance,
        instalments: loan.instalments.add(paymentDecimal),
        intrests: updatedInterest,
        
        status: newBalance.lessThanOrEqualTo(0)? "completed" : "active",
     },
  });
   await prisma.incomes.create({
    data:{
      type: "LoanInterest",
      amount: loanInterestPayment,
      
    }
  })

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

// Delete Loan

export async function DELETE(_: Request, context: {params: Promise<{id: string}>}){
  const {id}= await context.params;
  const LoanId= parseInt(id, 10);

  await prisma.loan.update({
    where:{loan_id:LoanId},
    data :{status: "inactive"}
    
  });

  

  return NextResponse.json({success: true});

}

// PUT (edit/update)

export async function PUT(req: Request, context: {params: Promise<{id: string}>}){
  const {id} = await context.params;
  const LoanId = parseInt(id, 10);
  const body= await req.json();
  
  const installments= new Prisma.Decimal(body.instalment)
  const intresRate = 0.01; 
  const principal =new Prisma.Decimal(body.Principal?? 0)
  const intrest= principal.mul(intresRate);
  const totalInt= new Prisma.Decimal(body.interest)
  const totalpayeable= principal.add(totalInt)
  const totalAmount=principal.add(totalInt)
  const balance= totalAmount.sub(installments)

  const updated = await prisma.loan.update({
    where: {loan_id:LoanId},
    data:{
      Principal: principal,
      balance: balance,
      instalments:installments,
      intrests:totalInt,
      Loan_Duration: body.duration,
      totals_payeable: totalpayeable,
    },
    
  });
   await prisma.loanTransaction.create({
    data: {
      loan_id: LoanId,
      member_Id: updated.member_Id,
      type: "Edit",
      
      new_balance: totalpayeable,
    }
  })
  
  await prisma.loanInterest.updateMany({
    where:{loan_id:updated.loan_id},
    data:{
      ownerShare:totalInt,

    }
  })
  return NextResponse.json(updated);
}