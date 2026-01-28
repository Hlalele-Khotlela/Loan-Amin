// src/app/api/finance/route.ts
import { NextResponse } from "next/server";
import {prisma} from "../../../lib/prisma/prisma"; // adjust import

export async function POST(req: Request) {
  const { amount, Description } = await req.json();

  
    await prisma.expenses.create({
      data: { amount, Description },
    });
  

  return NextResponse.json({ success: true });
}


export async function GET(req: Request) { 
  const { searchParams } = new URL(req.url); 
  const month = searchParams.get("month"); 
  let transactions; 
  if (month) { 
    const [year, mon] = month.split("-"); 
    const start = new Date(Number(year), Number(mon) - 1, 1); 
    const end = new Date(Number(year), Number(mon), 1); 
    // first day of next month 
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
        orderBy: { 
          created_at: "desc" }, 
        }); 
      }
       // 👉 Collect distinct months from all incomes 
       const allTransactions = await prisma.expenses.findMany({ 
        select: { created_at: true } 
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
          }