import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma/prisma";
import { Decimal } from '@prisma/client/runtime/client.js';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const { memberId } = await params;

  const member = await prisma.member.findUnique({
    where: { member_Id: Number(memberId) },
    include: {
      groupSavings: true,
      GroupDeposits: true,
      GroupWithdrawal: true,
      loan: {
        include: {
          transactions: true,
        },
        
      },
      loanrequest: true,
      savings: {
        include: {
          transactions: true,
        },
      }
    },
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json(member);
}


// Delete Member

export async function DELETE(_: Request, context: {params: Promise<{memberId: string}>}){
  const {memberId}= await context.params;
  const memberIdInt= parseInt(memberId, 10);


   await prisma.loanTransaction.deleteMany({
    where:{loan: {member_Id:memberIdInt}}
  });

  await prisma.loan.deleteMany({
    where:{member_Id: memberIdInt}
  });

   await prisma.savings.deleteMany({
    where:{member_Id: memberIdInt}
  });

   await prisma.savingsTransaction.deleteMany({
    where:{saving: {member_Id:memberIdInt}}
  });

   await prisma.groupDeposit.deleteMany({
    where:{member_Id: memberIdInt}
  });

   await prisma.groupWithdrawal.deleteMany({
    where:{member_Id: memberIdInt}
  });

   await prisma.loanrequest.deleteMany({
    where:{member_Id: memberIdInt}
  });

   await prisma.groupSavingsTransaction.deleteMany({
    where:{member_Id: memberIdInt}
  });

  const groups = await prisma.groupSaving.findMany({
    where: {
      members:{
        some: {member_Id: memberIdInt},
      },
    },
    select: {group_id: true}
  });
  for (const g of groups) {
    const deposit = await prisma.groupDeposit.aggregate({
      where: {group_id: g.group_id},
      _sum: {amount:true},
    });

    const withdrawals = await prisma.groupWithdrawal.aggregate({
      where:{group_id: g.group_id},
      _sum: {amount: true},
    });

    const Totaldepost= Decimal(deposit._sum.amount ?? 0);
    const Totalwithdrawal =Decimal(withdrawals._sum.amount ?? 0);

    await prisma.groupSaving.update({
      where: {
        group_id: g.group_id
      },
      data: {
        total_Savings: Totaldepost,
        current_total: Totaldepost.sub(Totalwithdrawal),
      },
    })
  }

  await prisma.member.delete({
    where:{member_Id:memberIdInt}
    
  });
  return NextResponse.json({success: true});

}

// PUT (edit/update)

export async function PUT(req: Request, context: {params: Promise<{memberId: string}>}){
  const {memberId} = await context.params;
  const memberIdInt = parseInt(memberId, 10);
  const body= await req.json();
  const{
    firstName, lastName, email, gender, phone, Role, Status, JoinedAt,
  } = body;

  const updated = await prisma.member.update({
    where: {member_Id:memberIdInt},
    data:{
      firstName, lastName, email, gender, phone, Role, Status, JoinedAt, 
    },
  });
  return NextResponse.json(updated);
}