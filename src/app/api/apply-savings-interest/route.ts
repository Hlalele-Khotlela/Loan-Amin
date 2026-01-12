// src/app/api/apply-interest/route.ts
import { prisma } from "../../../lib/prisma/prisma";
import { Prisma } from "@prisma/client";

export async function POST() {
  // Fetch all loans
  const savings = await prisma.savings.findMany();

  // Apply 1% interest to each loan
  for (const saving of savings) {
    const intrestInrement = saving.total.mul(new Prisma.Decimal(0.01)); // balance × 1.02
    const newBalance= saving.total.add(intrestInrement);

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
}
  return Response.json({ message: "Monthly interest applied manually" });
}
