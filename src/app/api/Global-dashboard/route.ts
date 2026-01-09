// src/app/api/dashboard/global/route.ts
import { prisma } from "@/lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  // Loans summary across all members
  const loanSummary = await prisma.loan.aggregate({
    _sum: {
      Principal: true,
      balance: true,
      totals_payeable: true,
    },
    _count: { loan_id: true },
  });

  // Loan transactions grouped by type (repayment, interest, etc.)
  const loanTxSummary = await prisma.loanTransaction.groupBy({
    by: ["type"],
    _sum: { amount: true },
  });

  // Savings summary across all members
  const savingsSummary = await prisma.savings.aggregate({
    _sum: { amount: true },
    _count: { savings_id: true },
  });

  // Group transactions summary across all groups
  const groupSummary = await prisma.groupSavingsTransaction.groupBy({
    by: ["type"],
    _sum: { amount: true },
  });



  return NextResponse.json({
    loans: loanSummary,
    loanTransactions: loanTxSummary,
    savings: savingsSummary,
    groupTransactions: groupSummary,
  });
}
