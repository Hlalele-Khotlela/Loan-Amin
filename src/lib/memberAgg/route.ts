import { prisma } from "@/lib/prisma/prisma";

export async function getMemberDashboardData(memberId: number) {
  const loanSummary = await prisma.loan.aggregate({
    where: { member_Id: memberId },
    _sum: {
      Principal: true,
      balance: true,
      totals_payeable: true,
    },
  });

  const savingsSummary = await prisma.savings.aggregate({
    where: { member_Id: memberId },
    _sum: { amount: true },
  });

  const groupSummary = await prisma.groupSavingsTransaction.groupBy({
    by: ["type"],
    where: { member_Id :memberId},
    _sum: { amount: true },
  });

  return {
    loans: loanSummary,
    savings: savingsSummary,
    groupTransactions: groupSummary,
  };
}
