
import {prisma} from "@/lib/prisma/prisma";
import MemberClient from "./MemberClient";
import { getMemberDashboardData } from "@/lib/memberAgg/route";
export default async function MemberProfile({ 
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const mymemberId = parseInt(memberId, 10);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9002";

  const member = await prisma.member.findUnique({
    where: {
      member_Id: mymemberId,
    },

    include: {
      loan:true,
      savings: true,
      groupSavings: true,
      GroupDeposits: true,
      GroupWithdrawal: true,
      loanrequest: true,

    },
      
  });
  const  dashboardData =await getMemberDashboardData(mymemberId)



  ;

  if(!member){
    return(
      <p>Member not available</p>
    );
  }

// seialize member
function serializeMember(member: any) {
   return { 
    ...member, loan: member.loan?.map((l: any) => ({
       ...l, 
       Principal: l.Principal?.toString() ?? "0",
      instalments: l.instalments?.toString() ?? "0", 
      intrests: l.intrests?.toString() ?? "0",
      // intrests: l.intrests?.toString() ?? "0",
      totals_payeable: l.totals_payeable?.toString() ?? "0",
      balance: l.balance?.toString() ?? "0",
      MinInstament: l.MinInstament?.toString() ?? "0",
           })) ?? [],
      savings: member.savings?.map((s: any) => ({
               ...s, 

      amount: s.amount?.toString() ?? "0",
      min_amount: s.min_amount?.toString() ?? "0",
      interest: s.interest?.toString() ?? "0",
      total: s.total?.toString() ?? "0", })) ?? [],


      groupSavings: member.groupSavings?.map((g: any) => ({
             ...g, 
      amount: g.amount?.toString() ?? "0",
      interest: g.interest?.toString() ?? "0",
      min_amount: g.min_amount?.toString() ?? "0",
      current_total: g.current_total?.toString() ?? "0",
      total_Savings: g.total_Savings?.toString() ?? "0",
      total: g.total?.toString() ?? "0", })) ?? [],


      GroupDeposits: member.GroupDeposits?.map((d: any) => ({
        ...d, 
      amount: d.amount?.toString() ?? "0", })) ?? [],

      GroupWithdrawal: member.GroupWithdrawal?.map((w: any) => ({
                             ...w, 
      amount: w.amount?.toString() ?? "0", })) ?? [],

      loanrequest: member.loanrequest?.map((lr: any) => ({
                                 ...lr, 
      amount: lr.amount?.toString() ?? "0", })) ?? [], }; }

// Serialize Decimals to  Strings

function serializeDashboard(data: any){
  return{
    loans:{
      _sum:{
        Principal: data.loans._sum.Principal?.toString() ?? "0",
        totals_payeable: data.loans._sum.totals_payeable?.toString() ?? "0",
        balance: data.loans._sum.balance?.toString() ?? "0",
      },
    },
    savings: {
      _sum: {
        amount: data.savings._sum.amount?.toString() ?? "0",
        interest: data.savings._sum.intrest?.toString() ?? "0",
        total: data.savings._sum.total?.toString() ?? "0",
      },
    },

    groupTransactions: data.groupTransactions.map((tx: any)=>({
      type: tx.type,
      amount: tx._sum.amount?.toString()?? "0",
    })),

  };
}

  const serializedMember = serializeMember(member);

    

  return (
   <MemberClient
    member={serializedMember} 
    dashboardData={serializeDashboard(dashboardData)}/>
  );
}
