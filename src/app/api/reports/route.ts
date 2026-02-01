// src/app/api/report/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // e.g. "2026-01"

    if (!month) {
      return NextResponse.json(
        { error: "Month is required" },
        { status: 400 }
      );
    }

    const [year, mon] = month.split("-");
    const start = new Date(Number(year), Number(mon) - 1, 1);
    const end = new Date(Number(year), Number(mon), 1);

    // Incomes
    const incomes = await prisma.incomes.findMany({
      where: {
        created_at: { gte: start, lt: end },
      },
    });

    // Expenses
    const expenses = await prisma.expenses.findMany({
      where: {
        created_at: { gte: start, lt: end },
      },
    });

    // Totals
    const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const netBalance = totalIncome - totalExpenses;

    // Breakdown by type
    const incomeByType: Record<string, number> = {};
    incomes.forEach((i) => {
      incomeByType[i.type] = (incomeByType[i.type] || 0) + Number(i.amount);
    });

    const expenseByType: Record<string, number> = {};
    expenses.forEach((e) => {
      expenseByType[e.type] = (expenseByType[e.type] || 0) + Number(e.amount);
    });

    return NextResponse.json({
      month,
      totalIncome,
      totalExpenses,
      netBalance,
      incomeByType,
      expenseByType,
      transactions: { incomes, expenses },
    });
  } catch (err) {
    console.error("Monthly report error:", err);
    return NextResponse.json(
      { error: "Failed to generate monthly report" },
      { status: 500 }
    );
  }
}
