// src/app/api/apply-group-intrest/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {


  // 1. Fetch all groups
  const groups = await prisma.groupSaving.findMany({ include: { members: true } });

  if (!groups || groups.length === 0) {
    return NextResponse.json({ message: "No groups found" }, { status: 404 });
  }

  const results: any[] = [];

  // 2. Loop through each group
  for (const group of groups) {
    // Aggregate deposits & withdrawals for this group
    const deposits = await prisma.groupDeposit.groupBy({
      by: ["member_Id"],
      where: { group_id: group.group_id },
      _sum: { amount: true },
    });

    const withdrawals = await prisma.groupWithdrawal.groupBy({
      by: ["member_Id"],
      where: { group_id: group.group_id },
      _sum: { amount: true },
      
    });

   
    

    // Build member totals
    const memberWithTotals = await Promise.all(

     group.members.map(async (m) => {

      const dep = deposits.find((d) => d.member_Id === m.member_Id)?._sum.amount || 0;
      const wit = withdrawals.find((w) => w.member_Id === m.member_Id)?._sum.amount || 0;

      const prevAccoumulatedInterest= await prisma.memberInterest.findFirst({
        where:{member_Id: m.member_Id, group_Id: group.group_id},
        orderBy:{calculatedAt: "desc"}
      });
      const memberInterest= new Prisma.Decimal(prevAccoumulatedInterest?.AccumulatedInterest?? 0);
      const InterestDep = memberInterest.add(dep);

      const netContribution =InterestDep.sub(new Prisma.Decimal(wit));

      return {
        member_Id: m.member_Id,
        totalDeposits: Number(dep),
        totalWithdrawals: Number(wit),
        netContribution,
      };
    })
    );

    // Calculate group net + interest
    const totalGroupNet = memberWithTotals.reduce(
      (sum, m) => sum + Number(m.netContribution),
      0
    );
    const groupInterest = totalGroupNet * 0.005; // 0.05% interest

    // Allocate member interest
    const memberWithInterest = await Promise.all(
      memberWithTotals.map(async (m) => {
        const currentInterest =
          totalGroupNet > 0
            ? (Number(m.netContribution) / totalGroupNet) * groupInterest
            : 0;

        // Fetch last accumulated interest
        const prevRecord = await prisma.memberInterest.findFirst({
          where: { member_Id: m.member_Id, group_Id: group.group_id },
          orderBy: { calculatedAt: "desc" },
        });

        const accumulatedInterest =
          (prevRecord?.AccumulatedInterest?.toNumber() ?? 0) + currentInterest;

        // Insert new record
        await prisma.memberInterest.create({
          data: {
            member_Id: m.member_Id,
            group_Id: group.group_id,
            netContribution: m.netContribution,
            interestShare: new Prisma.Decimal(currentInterest),
            AccumulatedInterest: new Prisma.Decimal(accumulatedInterest),
            calculatedAt: new Date(),
           
          },
        });

        return {
          ...m,
          currentInterest,
          accumulatedInterest,
        };
      })
    );

    // Update group totals
    const intrest = new Prisma.Decimal(groupInterest);
    const newBalance = group.total_Savings.add(intrest);

    await prisma.groupSaving.update({
      where: { group_id: group.group_id },
      data: {
        current_total: newBalance,
        interest: group.interest.add(intrest),
      },
    });

    await prisma.expenses.create({
      data:{
        type: "GroupsavingInterest",
        amount: intrest
      }
    })

    // Record transaction
    await prisma.groupSavingsTransaction.create({
      data: {
        group_id: group.group_id,
        amount: intrest,
        type: "INTEREST",
        Description: `Monthly interest applied to group savings`,
      },
    });

    results.push({
      groupId: group.group_id,
      groupInterest,
      members: memberWithInterest,
    });
  }

  // Return summary for all groups
  return NextResponse.json({
    message: "Monthly interest applied to all groups",
    
    groups: results,
  });
}
