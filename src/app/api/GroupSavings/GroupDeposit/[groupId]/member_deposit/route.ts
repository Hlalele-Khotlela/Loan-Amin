import { group } from "node:console";
import { prisma } from "../../../../../../lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, 
    context: { params: Promise<{ groupId: string }> }

) {
    try {
        const { groupId } = await context.params;
        const group_id = Number(groupId);
        const { amount, memberId } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
        }
        if (!memberId) {
            return NextResponse.json({ message: "Member ID is required" }, { status: 400 });
        }

        //create a new deposit record
        const deposit = await prisma.groupDeposit.create({
            data: {
                amount,
                member_Id: memberId,
                group_id: group_id,

             
                
            },
        });

         await prisma.groupSavingsTransaction.create({
      data: {
        group_id: group_id,
        member_Id: memberId,
        amount: amount,
        type: "DEPOSIT",
        Description: `Deposit by member ID ${memberId}`,
      },
    });

        //update the group's total savings
       await prisma.groupSaving.update({
        
            where: { group_id: group_id },
            data: {
                total_Savings: { increment: amount },
            },
        }); 
        return NextResponse.json(deposit, { status: 201 });
    } catch (error) {
        console.error("Error creating group deposit:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500
       })
    }
}
// 