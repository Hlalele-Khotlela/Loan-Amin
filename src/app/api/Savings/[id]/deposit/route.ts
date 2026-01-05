import { prisma } from "../../../../../lib/prisma/prisma";
import { NextResponse } from "next/server";

// Handle POST requests for deposits/withdrawals
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { amount, action } = body; // action = "DEPOSIT" or "WITHDRAW"
    const savingsId = Number((await context.params).id);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    if (!["DEPOSIT", "WITHDRAW"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use DEPOSIT or WITHDRAW." },
        { status: 400 }
      );
    }

    // Fetch savings account
    const savings = await prisma.savings.findUnique({
      where: { savings_id: savingsId },
    });

    if (!savings) {
      return NextResponse.json(
        { error: "Savings account not found" },
        { status: 404 }
      );
    }

    let newBalance = savings.amount;

    if (action === "DEPOSIT") {
      newBalance = savings.amount.add(amount);
    } else if (action === "WITHDRAW") {
      if (amount > savings.amount) {
        return NextResponse.json(
          { error: "Insufficient balance" },
          { status: 400 }
        );
      }
      newBalance = savings.amount.sub(amount);
    }

    // Update savings balance
    const updatedSavings = await prisma.savings.update({
      where: { savings_id: savingsId },
      data: { amount: newBalance },
    });

    // Record transaction (optional table)
    await prisma.savingsTransaction.create({
      data: {
        savings_id: savingsId,
        amount,
        type: action, // "DEPOSIT" or "WITHDRAW"
      },
    });

    return NextResponse.json(updatedSavings, { status: 200 });
  } catch (error) {
    console.error("Error processing transaction:", error);
    return NextResponse.json(
      { error: "Failed to process transaction" },
      { status: 500 }
    );
  }
}
