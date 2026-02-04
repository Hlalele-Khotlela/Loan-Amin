import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

// GET: Fetch all raffle transactions
export async function GET() {
  try {
    const transactions = await prisma.raffles.findMany({
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        created_at: true,
        deposit: true,
        withdrawals: true,
        balance: true,
        Descreption: true,
      },
    });

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching raffle transactions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch raffle transactions" },
      { status: 500 }
    );
  }
}

// POST: Add a new raffle transaction
export async function POST(req: Request) {
  try {
    const { type, amount, description } = await req.json();

    // fetch latest balance
    const latestFund = await prisma.raffles.findFirst({
      orderBy: { created_at: "desc" },
    });

    let currentBalance = Number(latestFund?.balance ?? 0);

    if (type.toLowerCase() === "deposit") {
      currentBalance += amount;
    } else if (type.toLowerCase() === "withdrawal") {
      currentBalance -= amount;
    }

    if(currentBalance <= 0 && type.toLowerCase()==="withdrawal"){
      return NextResponse.json("the balance is zero");
    }

    const transaction = await prisma.raffles.create({
      data: {
        deposit: type === "deposit" ? amount : 0,
        withdrawals: type === "withdrawal" ? amount : 0,
        Descreption : description,
        balance: currentBalance,
      },
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error("Error creating raffle transaction:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create raffle transaction" },
      { status: 500 }
    );
  }
}
