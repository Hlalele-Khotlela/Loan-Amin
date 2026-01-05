import {prisma} from '../../../lib/prisma/prisma';
import { NextResponse } from 'next/server';
import {Prisma} from "@prisma/client";

export async function POST(req: Request) {
    try {
        const {savings_type, name, amount, member_Ids} = await req.json();
    console.log("Received data:", {member_Ids, amount, savings_type});

    // Validate input
    if (!member_Ids || !amount || !savings_type) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }   
    // Create new savings record
    const interest = new Prisma.Decimal(0); // Initial interest is 0
    const total = new Prisma.Decimal(amount).add(interest);

    if(!name ||typeof name !== 'string' || !name.trim()){
        return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }

    const newSavings = await prisma.groupSaving.create({
        data: {
           name,
           savings_type: savings_type,
           members:{
            connect: member_Ids.map((id: number) => ({member_Id: id })),
           },
           amount: new Prisma.Decimal(amount),   
           total_Savings: amount   
             
           
            
        },
         include: {
                members: true
              },
    });
    console.log("New savings created:", newSavings);
    console.log("NAME VALUE:", name);
console.log("NAME TYPE:", typeof name);

    return NextResponse.json(newSavings, { status: 201 });

        
    } catch (error) {
        console.error('Error handling POST request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    
}