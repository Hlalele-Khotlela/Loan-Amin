import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import { Decimal } from '@prisma/client/runtime/client.js';

// Example usage
const amount: Decimal = new Decimal(123.45);
console.log(amount.toFixed(2)); // "123.45"



export async function POST(
  req: Request,
  { params }: { params: Promise< { id: string } >}
) {
  try {
    const {id} = await params;
    const savingsId = Number(id)

    if (isNaN(savingsId)) {
      return NextResponse.json({ message: "Invalid savings ID" }, { status: 409 });
    }

    const body = await req.json();
    const rawAmount = body.amount;
    const rawInterest = body.interest;

    // Validation: both null
    if (rawAmount == null && rawInterest == null) {
      return NextResponse.json(
        { message: "Either amount or interest must be provided" },
        { status: 400 }
      );
    }

    // Validate inputs
    if (rawAmount != null && (isNaN(rawAmount) || rawAmount < 0)) {
      return NextResponse.json({ message: "Invalid withdrawal amount" }, { status: 400 });
    }
    if (rawInterest != null && (isNaN(rawInterest) || rawInterest < 0)) {
      return NextResponse.json({ message: "Invalid interest amount" }, { status: 400 });
    }

    const amount = rawAmount != null ? new Decimal(rawAmount) : new Decimal(0);
    const interest = rawInterest != null ? new Decimal(rawInterest) : new Decimal(0);
    const totalWith = amount.add(interest);

    // Fetch savings record
    const savings = await prisma.savings.findUnique({ where: { savings_id: savingsId } });
    if (!savings) {
      return NextResponse.json({ message: "Savings record not found" }, { status: 404 });
    }

    
 // Balance checks
const availableBalance = savings.amount.add(savings.interest);

if (savings.amount.lt(amount)) {
  return NextResponse.json({ message: "Insufficient principal balance" }, { status: 400 });
}
if (savings.interest.lt(interest)) {
  return NextResponse.json({ message: "Insufficient interest balance" }, { status: 400 });
}

if (availableBalance.lt(totalWith)) {
  return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });
}


    // Update balances
    const updated = await prisma.savings.update({
      where: { savings_id: savingsId },
      data: {
        amount: savings.amount.sub(amount),
        interest: savings.interest.sub(interest),
        total: savings.total.sub(totalWith),
      },
    });

    await prisma.savingsTransaction.create({
      data: {
        savings_id: savings.savings_id,
        amount: totalWith,
        type: "WITHDRAWAL",
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Withdrawal error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
