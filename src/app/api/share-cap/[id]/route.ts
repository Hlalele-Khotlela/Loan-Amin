import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import { Decimal } from '@prisma/client/runtime/client.js';



export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = await req.json();
  try {
    const {id} = await params;
    
    const record = await prisma.shareOnCapital.findUnique({
      where: { id: Number(id) },
    });
   
    if (!record) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // Only accumulatedInterest is editable
    const newAccumulated = Decimal(body.accumulatedInterest);

    // Recalculate totals = amount + accumulatedInterest
    const totals = record.amount.add(newAccumulated);

    const updated = await prisma.shareOnCapital.update({
      where: { id: Number(id) },
      data: {
        Accumu_interest: newAccumulated,
        balance:totals,
      },
    });

      await prisma.shareOnCapitaltTransaction.create({
      data:{
        amount:newAccumulated,
        type:"interest Edit",
        balance: totals,
        member_Id:updated.member_Id,
        sharesId:updated.id
      }
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
    const existing = await prisma.shareOnCapital.findUnique({ 
      where: { id: Number(id) }, 
    }); 
    if (!existing) { 
      return NextResponse.json(
        { message: "Not found" }, { status: 404 }); } 
        
        const previousBalance = existing.balance;
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
    
    await prisma.shareOnCapitaltTransaction.create({
      data:{
        amount:previousBalance,
        type:"withdrawal",
        balance: 0,
        member_Id:updated.member_Id,
        sharesId:updated.id
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to withdraw" }, { status: 500 });
  }
}
