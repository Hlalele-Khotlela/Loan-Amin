// src/app/api/apply-interest/route.ts
import { prisma } from "../../../lib/prisma/prisma";
import { Prisma } from "@prisma/client";

export async function POST() {
  // Fetch all loans
  const groupsavings = await prisma.groupSaving.findMany();

  // Apply 1% interest to each Savings
  for (const saving of groupsavings) {
    const intrest = saving.total_Savings.mul(new Prisma.Decimal(0.005)); // balance × 0.01
    const newBalance= saving.total_Savings.add(intrest);

    await prisma.groupSaving.update({
      where: { group_id: saving.group_id },
      data: {
        current_total: newBalance,
        interest: saving.interest.add(intrest),
        // totals: newBalance, // optional: keep totals in sync
      },
    });

    await prisma.interest.create({
  data:{
    
    group_id: saving.group_id,
    ownerShare: intrest,
    savings_type: "GROUP",
  }
});
  

//   Record transaction

await prisma.groupSavingsTransaction.create({
    data: {
        group_id: saving.group_id,
        amount:intrest,
        type: "INTEREST",
        Description: `Monthly interest applied to group savings`,
    },
});
}
  return Response.json({ message: "Monthly interest applied manually" });
}
