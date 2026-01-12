import { prisma } from "../../../../../../lib/prisma/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/browser";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;
    const id = Number(groupId);

    const { amount, memberId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    if (!memberId) {
      return NextResponse.json({ message: "Member ID is required" }, { status: 400 });
    }

    // 1. Validate group exists
    const group = await prisma.groupSaving.findUnique({
      where: { group_id: id },
    });

    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    // 2. Check if group has enough balance
    if (group.total_Savings < amount) {
      return NextResponse.json(
        { message: "Insufficient group balance" },
        { status: 400 }
      );
    }

    // 3. Create withdrawal record
    const withdrawal = await prisma.groupWithdrawal.create({
      data: {
        amount,
        member_Id: memberId,
        group_id: id,
      },
    });

    // 4. Update group total savings
    
     const deposits = await prisma.groupDeposit.aggregate({
                where:{group_id:id},
                _sum:{amount:true},
            });
    
            const withdrawals = await prisma.groupWithdrawal.aggregate({
                where:{group_id:id},
                _sum:{amount:true},
    
            })

     const dep = new Prisma.Decimal(deposits._sum.amount ?? 0);
        const withdrw = new Prisma.Decimal(withdrawals._sum.amount ?? 0);


        await prisma.groupSaving.update({
      where: { group_id: id },
      data: {
        total_Savings: dep,
        current_total: dep.sub(withdrw),
      },
    });

    // transaction record
    await prisma.groupSavingsTransaction.create({
      data: {
        group_id: id,
        member_Id: memberId,
        amount: amount,
        type: "WITHDRAWAL",
        Description: `Withdrawal by member ID ${memberId}`,
      },
    });

    return NextResponse.json(withdrawal, { status: 201 });
  } catch (error) {
    console.error("Error creating group withdrawal:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
