// src/app/api/finance/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, type } = body;

    if (!amount || !type) {
      return NextResponse.json(
        { success: false, error: "Amount and type are required" },
        { status: 400 }
      );
    }

    await prisma.expenses.create({
      data: { amount, type },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /finance error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create expense" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    let transactions;
    if (month) {
      const [year, mon] = month.split("-");
      const start = new Date(Number(year), Number(mon) - 1, 1);
      const end = new Date(Number(year), Number(mon), 1);

      transactions = await prisma.expenses.findMany({
        where: {
          created_at: {
            gte: start,
            lt: end,
          },
        },
        orderBy: { created_at: "desc" },
      });
    } else {
      transactions = await prisma.expenses.findMany({
        orderBy: { created_at: "desc" },
      });
    }

    // Collect distinct months
    const allTransactions = await prisma.expenses.findMany({
      select: { created_at: true },
    });

    const months = Array.from(
      new Set(
        allTransactions.map((t) => {
          const d = new Date(t.created_at);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        })
      )
    ).sort();

    return NextResponse.json({ transactions, months });
  } catch (err) {
    console.error("GET /finance error:", err);
    return NextResponse.json(
      { transactions: [], months: [], error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}
