import {prisma} from '../../../lib/prisma/prisma';
import { NextResponse } from 'next/server';
import {Prisma, TransactionType} from "@prisma/client";

export async function POST(req: Request) {
    try {
        const {memberId, amount, type} = await req.json();
   

    // Validate input
    if (!memberId || !amount || !type) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }   
    // Create new savings record
    const interest = new Prisma.Decimal(0); // Initial interest is 0
    const total = new Prisma.Decimal(amount).add(interest);
    const minAmount = new Prisma.Decimal(0); // Default min_amount to 0
    const newSavings = await prisma.savings.create({
        data: {
            member_Id: Number(memberId),
            amount: new Prisma.Decimal(amount),
            savings_type: type,
            interest: interest,
            total: total,
            min_amount: minAmount,
            started_at: new Date(),
            // created_at: new Date(),
        },
    });
// record in trasactions
      await prisma.savingsTransaction.create({
    data: {
      savings_id: newSavings.savings_id,
      member_Id:newSavings.member_Id,
      type: "CREATED",
      amount: newSavings.amount,
    
    }
  })
   
    return NextResponse.json(newSavings, { status: 201 });

        
    } catch (error) {
        console.error('Error handling POST request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    
}