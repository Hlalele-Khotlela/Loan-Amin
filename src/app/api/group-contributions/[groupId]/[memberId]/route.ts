import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import { GroupContributions } from "@/lib/memberGroupAgg/route"; // adjust path

export async function GET(
  req: Request,
  { params }: { params: Promise<{ groupid: string }> }
) {
    const {groupid} = await params;
  const groupId = Number(groupid);
//   const memberId = Number(memberid);

const group = await prisma.groupSaving.findUnique({
    where: {group_id: groupId},
    include: {members:true},
});
 
const contribution = await GroupContributions(0, groupId);

const deposits = contribution.deposit;
const withdrawals = contribution.withdrawals;

const MemberWithTotals = group?.members.map((m)=> {
    const dep = deposits.find((d) => d.member_Id === m.member_Id)?._sum.amount || 0;
    const wit= withdrawals.find((w)=> w.member_Id===m.member_Id)?._sum.amount || 0;

    return {
        ...m,
        totatDeposited: Number(dep),
        totalWithdrawn: Number(wit),
        balance: Number(dep) - Number(wit),
    };
});

  return NextResponse.json({
    ...group,
    members: MemberWithTotals,
  });
}
