// src/app/api/transactions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";



export async function POST(req: Request) {
  const { type, amount, Description, member_Id } = await req.json();

  // Validate type
  if (type !== "deposit" && type !== "withdrawal") {
    return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
  }

  // Insert a new row for each transaction
  const fund = await prisma.emegencyFund.create({
    data: {
      member_Id: member_Id ?? null, // optional
      balance: amount,              // you can compute running balance later
      deposit: type === "deposit" ? amount : 0,
      withdrawals: type === "withdrawal" ? amount : 0,
      Description,
    },
  });

  return NextResponse.json({ success: true, fund });
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");

  let transactions;

  if (month) {
    const [yearStr, monStr] = month.split("-");
    const year = Number(yearStr);
    const mon = Number(monStr);

    const start = new Date(Date.UTC(year, mon - 1, 1));
    const end = new Date(Date.UTC(year, mon, 1));

    transactions = await prisma.emegencyFund.findMany({
      where: {
        created_at: {
          gte: start,
          lt: end,
        },
      },
      orderBy: { created_at: "desc" },
    });
  } else {
    transactions = await prisma.emegencyFund.findMany({
      orderBy: { created_at: "desc" },
    });
  }

  // Compute totals
  const deposits = transactions.reduce((sum, t) => sum + Number(t.deposit ?? 0), 0);
  const withdrawals = transactions.reduce((sum, t) => sum + Number(t.withdrawals ?? 0), 0);
  const balance = deposits - withdrawals;

  return NextResponse.json({ balance, deposits, withdrawals, transactions });
}
