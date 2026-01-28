import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import { Prisma } from "@/generated/prisma/browser";

export async function POST(
  req: Request,
  { params }: { params: Promise< { id: string } >}
) {
  try {
    const savingId = await params;
    const savingsId = Number((await params).id)

    

    if (isNaN(savingsId)) {
      return NextResponse.json(
        { message: "Invalid savings ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const amount = new Prisma.Decimal(body.amount);

    if (!amount || amount.toNumber() <= 0) {
      return NextResponse.json(
        { message: "Invalid withdrawal amount" },
        { status: 400 }
      );
    }

    // Fetch savings record
    const savings = await prisma.savings.findUnique({
      where: { savings_id: savingsId },
    });

    if (!savings) {
      return NextResponse.json(
        { message: "Savings record not found" },
        { status: 404 }
      );
    }

    // Prevent overdraft
    if (savings.amount < amount) {
      return NextResponse.json(
        { message: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Update balance
    const updated = await prisma.savings.update({
      where: { savings_id: savingsId },
      data: {
        amount: savings.amount.sub(amount),
      },
    });

    await prisma.savingsTransaction.create({
        data:{
            savings_id: savings.savings_id,
            amount: savings.amount,
            type: "WITHDRAWAL"
        }
    })

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Withdrawal error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
