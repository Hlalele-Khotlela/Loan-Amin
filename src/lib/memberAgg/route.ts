import { prisma } from "@/lib/prisma/prisma";
import { Decimal } from "@prisma/client/runtime/client";
type MemberDashboardData = {
  loans: { 
    _sum: { 
      Principal: number| Decimal; 
      balance: number| Decimal; 
      instalments: number| Decimal; 
      intrests: number | Decimal; 
      totals_payeable: number | Decimal; 
    };
     _count: number 
    };
  savings: { _sum: { amount: number | Decimal; interest: number| Decimal ;}; _count: number; };
  groupTransactions: { type: string; amount: number| Decimal }[];
};
export async function getMemberDashboardData(memberId: number): Promise<MemberDashboardData>  {
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

  return {
    loans: {
      _sum: {
        Principal: loanSummary._sum.Principal ?? 0,
        balance: loanSummary._sum.balance ?? 0,
        instalments: loanSummary._sum.instalments ?? 0,
        intrests: loanSummary._sum.intrests ?? 0,
        totals_payeable: loanSummary._sum.totals_payeable ?? 0,
      },
      _count: loanSummary._count ?? 0,
    },
    savings: {
      _sum: {
        amount: savingsSummary._sum.amount ?? 0,
        interest: savingsSummary._sum.interest ?? 0,
      },
      _count: savingsSummary._count ?? 0,
    },
    groupTransactions: groupSummary.map((g) => ({
      type: g.type,
      amount: g._sum.amount ?? 0,
    })),
  };
}
