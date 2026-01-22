// src/app/api/apply-interest/route.ts
import { prisma } from "../../../lib/prisma/prisma";
import { Prisma } from "@prisma/client";

export async function POST() {
  // Fetch all loans
  const loans = await prisma.loan.findMany({
    where:{
      status: "active",
    }
  });

  // Apply 1% interest to each loan
  for (const loan of loans) {
    const intrest = loan.balance.mul(new Prisma.Decimal(0.01)); // balance × 1.02
    const newBalance= loan.balance.add(intrest);

    await prisma.loan.update({
      where: { loan_id: loan.loan_id },
      data: { 
        balance: newBalance,
        intrests: {increment: intrest},
        // totals: newBalance, // optional: keep totals in sync
      },
    });
 
//   Record transaction

await prisma.loanTransaction.create({
    data: {
        loan_id: loan.loan_id,
        amount:intrest,
        new_balance: newBalance,
        type: "interest"
        
    },
});

await prisma.loanInterest.create({
  data:{
    loan_id: loan.loan_id,
    member_Id:loan.member_Id,
    ownerShare: intrest,
    loan_type:loan.loan_type
  }
});
}
  return Response.json({ message: "Monthly interest applied manually" });
}
