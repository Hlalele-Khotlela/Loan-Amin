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
    const savingId = await params;
    const savingsId = Number((await params).id)

    

    

    if (isNaN(savingsId)) {
      return NextResponse.json(
        { message: "Invalid savings ID" },
        { status: 409 }
      );
    }

    const body = await req.json();
    const amount = Decimal(body.amount);
    const interest = Decimal(body.interest);
    const totalWith = amount.add(interest);

    const rawAmount = Number(body.amount);
    const rawInterest = Number(body.amount);

    if(isNaN(rawAmount) || rawAmount<= 0){
      return NextResponse.json({message: "Invalid withdrawal amount"}, {status: 400});

    }

    if (isNaN(rawInterest) || rawInterest < 0){
      return NextResponse.json({message: "Invalid interest amount"}, {status: 400});
    }

    console.log("body", body);

    

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

    const availableBalance = savings.amount.add(savings.interest);
    if(availableBalance.lt(totalWith)){
      return NextResponse.json({message: "Insufficient balance"}, {status: 400});
    }

    if(savings.amount < amount){
      return NextResponse.json({message: "Insufficient balance"}, {status: 400});
    }

    if(savings.interest < interest){
      return NextResponse.json({message: "Insufficient balance"}, {status: 400});
    }

    // Update balance
    const updated = await prisma.savings.update({
      where: { savings_id: savingsId },
      data: {
        amount: savings.amount.sub(amount),
        interest: savings.interest.sub(interest),
        total: savings.total.sub(totalWith),
      },
    });

    await prisma.savingsTransaction.create({
        data:{
            savings_id: savings.savings_id,
            amount: totalWith,
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
