import {prisma} from '../../../lib/prisma/prisma';
import { NextResponse } from 'next/server';
import {Prisma} from "@prisma/client";

export async function POST(req: Request) {
    try {
        const {savings_type, name, Minamount, member_Ids} = await req.json();
   

    // Validate input
    if (!member_Ids || !Minamount || !savings_type) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }   
    // Create new savings record
    const interest = new Prisma.Decimal(0); // Initial interest is 0
    const total = new Prisma.Decimal(0);
    const amount = new Prisma.Decimal(0);

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
           min_amount: new Prisma.Decimal(Minamount),   
           total_Savings: total,
           current_total: total,
           amount:amount,
        //    interest: interest,   
    
        },
         include: {
                members: true
              },
    });
    
   

    return NextResponse.json(newSavings, { status: 201 });

        
    } catch (error) {
        console.error('Error handling POST request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    
}