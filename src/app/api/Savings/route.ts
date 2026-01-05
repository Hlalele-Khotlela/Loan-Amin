import {prisma} from '../../../lib/prisma/prisma';
import { NextResponse } from 'next/server';
import {Prisma} from "@prisma/client";

export async function POST(req: Request) {
    try {
        const {member_Id, amount, type} = await req.json();
    console.log("Received data:", {member_Id, amount, type});

    // Validate input
    if (!member_Id || !amount || !type) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }   
    // Create new savings record
    const interest = new Prisma.Decimal(0); // Initial interest is 0
    const total = new Prisma.Decimal(amount).add(interest);
    const newSavings = await prisma.savings.create({
        data: {
            member_Id: Number(member_Id),
            amount: new Prisma.Decimal(amount),
            savings_type: type,
            interest: interest,
            total: total,
            started_at: new Date(),
            // created_at: new Date(),
        },
    });
    console.log("New savings created:", newSavings);
    return NextResponse.json(newSavings, { status: 201 });

        
    } catch (error) {
        console.error('Error handling POST request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    
}