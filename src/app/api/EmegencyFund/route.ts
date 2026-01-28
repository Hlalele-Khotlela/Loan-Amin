// src/app/api/transactions/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma/prisma";

export async function POST(req: Request) {
  const { type, amount, Description, member_Id } = await req.json();

  // fetch latest balance
  const fund = await prisma.emegencyFund.findFirst({
    orderBy:{created_at:"desc"}
  });

  const currentBalance= Number(fund?.balance ?? 0);
  let newBalance= currentBalance;

  if(type==="deposit"){
    newBalance += amount
  }else{
    newBalance -= amount;
  }

await prisma.emegencyFundTransactions.create({
  data:{
    type,
    amount,
  }
});
  
 const transaction = await prisma.emegencyFund.create({ 
  data: { 
    deposit: type === "deposit" ? amount : 0, 
    withdrawals: type === "withdrawal" ? amount : 0, 
    Description, balance: newBalance, }, }); 

    

  return NextResponse.json({ success: true , transaction});
}




function monthBounds(year: number, mon: number) {
  // Start of month (UTC)
   const start = new Date(Date.UTC(year, mon - 1, 1, 0, 0, 0, 0));
  // First day of next month (UTC)
  const end = new Date(Date.UTC(year, mon, 1, 0, 0, 0, 0));
  return { start, end };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");

  let transactions;

  if (month) {
    const [yearStr, monStr] = month.split("-");
    const year = Number(yearStr);
    const mon = Number(monStr);

    const { start, end } = monthBounds(year, mon);

    transactions = await prisma.emegencyFund.findMany({
      where: {
        created_at: {
          gte: start,
          lt: end, // exclusive upper bound
        },
      },
      orderBy: { created_at: "desc" },
    });
  } else {
    transactions = await prisma.emegencyFund.findMany({
      orderBy: { created_at: "desc" },
    });
    
  }

  // 👉 Always fetch all months from DB
  const allTransactions = await prisma.emegencyFund.findMany({
    select: { created_at: true },
  });

  const months = Array.from(
    new Set(
      allTransactions.map((t) => {
        const d = new Date(t.created_at);
        return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      })
    )
  ).sort();

 

  return NextResponse.json({ transactions, months });
}
