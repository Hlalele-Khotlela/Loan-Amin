import { prisma } from "@/lib/prisma/prisma";
import { decimalToPlain } from "../utilities/decimalToPlain";

export type LoanByTypeAndStatus = { 
  loan_type: string; 
  status: string;
  _sum: { 
    Principal: number | null; 
    balance: number | null; 
    intrests: number | null; 
    totals_payeable: number | null; 
  }; 
  _count: { loan_id: number }; 
};

export type SavingsByStatus = { 
  savings_type: string; 
  status: string;
  _sum: { 
    amount: number | null; 
    total: number | null; 
    interest: number | null; 
  }; 
  _count: { savings_id: number }; 
};

export type SafeDashboardData = {
  loans: {
    _sum: { Principal: number | null; balance: number | null; intrests: number | null; totals_payeable: number | null };
    _count: { loan_id: number };
  };
  savings: {
    _sum: { amount: number | null; total: number | null; interest: number | null };
    _count: { savings_id: number };
  };
  loansByTypeAndStatus: LoanByTypeAndStatus[];
  savingsByStatus: SavingsByStatus[];
  loanTransactions: { type: string; _sum: { amount: number | null } }[];
  groupTransactions: { type: string; _sum: { amount: number | null } }[];
  groups: { _sum: { amount: number | null }; _count: { group_id: number } };
  savingsSummary: { type: string; _sum: { amount: number | null } }[];
};

export async function getGlobalDashboardData(): Promise<SafeDashboardData> {
  const loanSummary = await prisma.loan.aggregate({
    where: { status: "active" },
    _sum: { Principal: true, balance: true, intrests: true, totals_payeable: true },
    _count: { loan_id: true },
  });

  const savingsSummary = await prisma.savings.aggregate({
    where: { status: "active" },
    _sum: { amount: true, total: true, interest: true },
    _count: { savings_id: true },
  });

  const loanTxSummary = await prisma.loanTransaction.groupBy({
    by: ["type"],
    _sum: { amount: true },
  });

  const groupSavingsSummary = await prisma.groupSaving.aggregate({
    _sum: { amount: true },
    _count: { group_id: true },
  });

  const groupSummary = await prisma.groupSavingsTransaction.groupBy({
    by: ["type"],
    _sum: { amount: true },
  });

  const savingsTransactionsSummary = await prisma.savingsTransaction.groupBy({
    by: ["type"],
    _sum: { amount: true },
  });

  const loansByTypeAndStatus = await prisma.loan.groupBy({
    by: ["loan_type", "status"],
    where: { status: "active" },
    _sum: { Principal: true, balance: true, totals_payeable: true, intrests: true },
    _count: { loan_id: true },
  });

  const savingsByStatus = await prisma.savings.groupBy({
    by: ["savings_type", "status"],
    where: { status: "active" },
    _sum: { amount: true, total: true, interest: true },
    _count: { savings_id: true },
  });

  return decimalToPlain({
    loans: loanSummary,
    savings: savingsSummary,
    loansByTypeAndStatus,
    savingsByStatus,
    loanTransactions: loanTxSummary,
    groupTransactions: groupSummary,
    groups: groupSavingsSummary,
    savingsSummary: savingsTransactionsSummary,
  });
}
