import { prisma } from "@/lib/prisma/prisma";

export async function getMemberDashboardData(memberId: number) {
  const loanSummary = await prisma.loan.aggregate({
    where: { member_Id: memberId, status: "active" },
    _sum: {
      Principal: true,
      balance: true,
      instalments: true,
      intrests: true,
      totals_payeable: true,
    },
    _count: true,
  });

  const savingsSummary = await prisma.savings.aggregate({
    where: { member_Id: memberId, status: "active" },
    _sum: { amount: true, interest: true },
    _count: true,
  });

  const groupSummary = await prisma.groupSavingsTransaction.groupBy({
    by: ["type"],
    where: { member_Id: memberId },
    _sum: { amount: true },
  });

  // 👇 NEW: aggregate share capital
  const shareSummary = await prisma.shareOnCapital.aggregate({
    where: { member_Id: memberId },
    _sum: {
      amount: true,
      balance: true,
      Current_interest: true,
      Accumu_interest: true,
    },
    _count: true,
  });

  return {
    loans: {
      _sum: {
        Principal: Number(loanSummary._sum.Principal ?? 0),
        balance: Number(loanSummary._sum.balance ?? 0),
        instalments: Number(loanSummary._sum.instalments ?? 0),
        intrests: Number(loanSummary._sum.intrests ?? 0),
        totals_payeable: Number(loanSummary._sum.totals_payeable ?? 0),
      },
      _count: loanSummary._count ?? 0,
    },
    savings: {
      _sum: {
        amount: Number(savingsSummary._sum.amount ?? 0),
        interest: Number(savingsSummary._sum.interest ?? 0),
      },
      _count: savingsSummary._count ?? 0,
    },
    groupTransactions: groupSummary.map((g) => ({
      type: g.type,
      amount: Number(g._sum.amount ?? 0),
    })),
    shareCapital: {
      _sum: {
        amount: Number(shareSummary._sum.amount ?? 0),
        balance: Number(shareSummary._sum.balance ?? 0),
        Current_interest: Number(shareSummary._sum.Current_interest ?? 0),
        Accumu_interest: Number(shareSummary._sum.Accumu_interest ?? 0),
      },
      _count: shareSummary._count ?? 0,
    },
  };
}
