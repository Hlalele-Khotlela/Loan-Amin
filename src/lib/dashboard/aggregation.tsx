import { prisma } from "@/lib/prisma/prisma";
import { Prisma } from "@prisma/client";

// Example aggregation function
export async  function getGlobalDashboardData() {
  const loanSummary = await prisma.loan.aggregate({
    _sum: {
      Principal: true,
      balance: true,
      intrests:true,
      totals_payeable: true,
    },
    _count: { loan_id: true },
  });

  const savingsSummary = await prisma.savings.aggregate({
    _sum: { amount: true, total: true, interest: true },
    _count: { savings_id: true },
  });

  const loanTxSummary = await prisma.loanTransaction.groupBy({
    by: ["type"],
    _sum: { amount: true },
  });

  const groupSavingsSummary = await prisma.groupSaving.aggregate({
    _sum: {amount:true},
    _count: {group_id: true}

  })

  const groupSummary = await prisma.groupSavingsTransaction.groupBy({
    by: ["type"],
    _sum: { amount: true },
  });

  const savingsTransactionsSummary = await prisma.savingsTransaction.groupBy({
    by: ["type"],
    _sum: {amount: true},
  })
// console.log({ loanSummary, savingsSummary, loanTxSummary, groupSummary });



  return {savingsSummary:savingsTransactionsSummary, loans: loanSummary, savings: savingsSummary, loanTransactions: loanTxSummary, groupTransactions: groupSummary, groups:groupSavingsSummary };
}

// ✅ Infer the return type automatically
export type DashboardData = Prisma.PromiseReturnType<typeof getGlobalDashboardData>;
