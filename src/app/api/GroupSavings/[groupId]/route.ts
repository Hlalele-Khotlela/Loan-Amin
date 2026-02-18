import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import {GroupContributions} from "@/lib/memberGroupAgg/route";

// Get Goup and Totals
export async function GET(
  req: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await params;

  const group = await prisma.groupSaving.findUnique({
    where: { group_id: Number(groupId) },
    include: {
      members: {
        include: {
          MemberInterest: true,
        },
      },
      deposits: true,
      withdraw: true,
     
    },
  });
 
  


  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

//     const Ugroup = await prisma.groupSaving.findUnique({
//     where: {group_id: Number(groupId)},
//     include: {members:true},
// });

//  Get aggregated Totals
const contribution = await GroupContributions(0, Number(groupId));
const deposits = contribution.deposit;
const withdrawals = contribution.withdrawals;

const MemberWithTotals = group?.members.map((m)=> {
    const dep = deposits.find((d) => d.member_Id === m.member_Id)?._sum.amount || 0;
    const wit= withdrawals.find((w)=> w.member_Id===m.member_Id)?._sum.amount || 0;

    return {
        ...m,
        totalDeposited: Number(dep),
        totalWithdrawn: Number(wit),
        balance: Number(dep) - Number(wit),
    };
});

  return NextResponse.json({
    ...group,
    members: MemberWithTotals,
  });

 
}


// Update Group

export async function PUT(req: Request, context: { params: Promise<{ groupId: string }> }) {
  try {
    const {groupId} = await context.params;
    const groupid = Number(groupId);
    

    if (isNaN(groupid)) {
      return NextResponse.json({ error: "Invalid groupId" }, { status: 401 });
    }

    const body = await req.json();
    const { name, members } = body;

    if (!name || !Array.isArray(members)) {
      return NextResponse.json(
        { error: "Invalid payload: name and members are required" },
        { status: 400 }
      );
    }

    const uniqueMembers = [...new Set(members)];

    // Validate member IDs
    const existingMembers = await prisma.member.findMany({
      where: { member_Id: { in: uniqueMembers } },
      select: { member_Id: true },
    });

  

    if (existingMembers.length !== uniqueMembers.length) {
      return NextResponse.json(
        { error: "One or more member IDs do not exist" },
        { status: 400 }
      );
    }

     

    // Update group
    const updatedGroup = await prisma.groupSaving.update({
      where: { group_id: groupid },
      data: {
        name,
        members: {
          set:[],
          connect: uniqueMembers.map((id) => ({ member_Id: id })),
        },
      },
      include: {
        members: true,
      },
    });


    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (error) {
    console.error("Error updating group:", error);
    return NextResponse.json(
      { error: "Server error while updating group" },
      { status: 500 }
    );
  }
}

