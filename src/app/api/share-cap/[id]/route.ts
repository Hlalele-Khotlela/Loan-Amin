import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = await req.json();
  try {
    const {id} = await params;
    
    const record = await prisma.shareOnCapital.findUnique({
      where: { id: Number(id) },
    });
    console.log("body...", body);
    if (!record) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // Only accumulatedInterest is editable
    const newAccumulated = new Prisma.Decimal(body.accumulatedInterest);

    // Recalculate totals = amount + accumulatedInterest
    const totals = record.amount.add(newAccumulated);

    const updated = await prisma.shareOnCapital.update({
      where: { id: Number(id) },
      data: {
        Accumu_interest: newAccumulated,
        balance:totals,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params;
    // Full withdrawal: reset everything
    const updated = await prisma.shareOnCapital.update({
      where: { id: Number(id) },
      data: {
        amount: 0,
        Current_interest: 0,
        Accumu_interest: 0,
        balance: 0,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to withdraw" }, { status: 500 });
  }
}
