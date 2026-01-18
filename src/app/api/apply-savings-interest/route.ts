// src/app/api/apply-interest/route.ts
import { prisma } from "../../../lib/prisma/prisma";
import { Prisma } from "@prisma/client";

export async function POST() {
  // Fetch all Savings
  const savings = await prisma.savings.findMany();
  

  // Apply 0.05% interest to each loan
  for (const saving of savings) {
    const intrestInrement = saving.total.mul(new Prisma.Decimal(0.005));
    const OwnerintrestInrement = saving.total.mul(new Prisma.Decimal(0.005)); // balance × 1.02
    const newBalance= saving.total.add(intrestInrement);
    const newBalance2= saving.total.add(intrestInrement);


    await prisma.savings.update({
      where: { savings_id: saving.savings_id },
      data: {
        total: newBalance,
        interest: saving.interest.add(intrestInrement),
        // totals: newBalance, // optional: keep totals in sync
      },
    });
  

//   Record transaction

await prisma.savingsTransaction.create({
    data: {
        savings_id: saving.savings_id,
        amount:intrestInrement,
        type: "INTEREST",
    },
});

// Record owners Share

await prisma.interest.create({
  data:{
    member_Id:saving.member_Id,
    savings_id: saving.savings_id,
    ownerShare: OwnerintrestInrement,
    savings_type:saving.savings_type,
  }
});

// Log Transaction

await prisma.ownerTransaction.create({
  data: {
    savings_id: saving.savings_id,
    amount: OwnerintrestInrement,
    type: "OWNER_INTEREST",
    Description: "Owner interest credited",
  }
})
}
  return Response.json({ message: "Monthly interest applied manually" });
}
