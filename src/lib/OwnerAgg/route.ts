import { prisma } from "@/lib/prisma/prisma";
import { Prisma } from "@prisma/client";
import { decimalToPlain } from "../utilities/decimalToPlain";
import {  SAVINGSTYPE } from "@prisma/client";

export async function aggregateOwnerEarnings() {
  // Owner earnings from savings interest
  const savingsInterest = await prisma.interest.aggregate({
    _sum: { ownerShare: true },
  });
  const ownerSavingsEarnings = new Prisma.Decimal(savingsInterest._sum.ownerShare ?? 0);

  // Earnings per Member

  const InterestByMember = await prisma.interest.groupBy({
    by: ["member_Id"],
    _sum: {
      ownerShare: true,
    },
  });

  // Earning per Group

  const IntrestByGroup = await prisma.interest.groupBy({
    by: ["group_id"],
    where: {group_id:{not:null}},
    _sum: {ownerShare: true,},
  });

  // Owner earnings from loan interest
  const loanInterest = await prisma.loanInterest.aggregate({
   
    _sum: { ownerShare: true },
  });
  const ownerLoanEarnings = new Prisma.Decimal(loanInterest._sum.ownerShare ?? 0);

  // Earning per Member
  const loanInterestByMember = await prisma.loanInterest.groupBy({
    by: ["member_Id"],
    _sum: {
      ownerShare: true,
    },
    
  });
// Incomes
  const incomes = await prisma.incomes.aggregate({
    _sum:{amount: true}
  });

  const cooporateIncome= new Prisma.Decimal(incomes._sum.amount ?? 0);

  // Emergency Fund

  const emergencyDepositAndWith = await prisma.emegencyFund.aggregate({
    _sum:{deposit:true,
      withdrawals:true

    }
  });
  const emegecyDep = new Prisma.Decimal(emergencyDepositAndWith._sum.deposit?? 0);
  const emegencyWit = new Prisma.Decimal(emergencyDepositAndWith._sum.withdrawals?? 0);
  
  const emegencyBalance = emegecyDep.sub(emegencyWit);
  

  // Total owner earnings
  const totalOwnerEarnings = cooporateIncome.add(emegencyBalance);

  // Expenses

  const expenses = await prisma.expenses.aggregate({
    _sum:{amount:true}
  });

  const cooporateExp= new Prisma.Decimal(expenses._sum.amount ?? 0);

  // calculate profit

  const profit = totalOwnerEarnings.sub(cooporateExp);


  // calculate share on capital interest
  const shareOnCapitalIntrest = await prisma.shareOnCapital.aggregate({
    _sum:{
      Accumu_interest:true,
    }
  });
  const totalShareCapital = new Prisma.Decimal(shareOnCapitalIntrest._sum.Accumu_interest?? 0);

  // Share on Capital Per Members

  const MembershareOnCapitalIntrest = await prisma.shareOnCapital.groupBy({
    by:["member_Id"],
    _sum: {Accumu_interest:true},
  });

 



  // Merge savings + loan interest per member
const combinedInterestByMember: {
  member_Id: number;
  totalOwnerShare: number;
  savingsOwnerShare: number;
  loanOwnerShare: number;
}[] = [];

const memberMap = new Map<number, { savings: number; loan: number }>();

// Add savings interest
for (const s of InterestByMember) {
  memberMap.set(s.member_Id?? 0, {
    savings: Number(s._sum.ownerShare ?? 0),
    loan: 0,
  });
}

// Add loan interest
for (const l of loanInterestByMember) {
  const existing = memberMap.get(l.member_Id);
  if (existing) {
    existing.loan = Number(l._sum.ownerShare ?? 0);
    memberMap.set(l.member_Id, existing);
  } else {
    memberMap.set(l.member_Id, {
      savings: 0,
      loan: Number(l._sum.ownerShare ?? 0),
    });
  }
}

// Build final array
for (const [member_Id, values] of memberMap.entries()) {
  combinedInterestByMember.push({
    member_Id,
    savingsOwnerShare: values.savings,
    loanOwnerShare: values.loan,
    totalOwnerShare: values.savings + values.loan,
  });
}


const NonMoveablesavingsTypes = ["SECURITY", "COMPULSARY", "PENSION"] as SAVINGSTYPE[]; // 👈 the 3 types you want

// Owner earnings from savings interest (only 3 types)
const nonMoveablesavingsInterest = await prisma.interest.aggregate({
  where: {
    savings_type: { in: NonMoveablesavingsTypes },
  },
  _sum: { ownerShare: true },
});

const NonMoveableownerSavingsEarnings = new Prisma.Decimal(nonMoveablesavingsInterest._sum.ownerShare ?? 0);
const  TotalImoveable = NonMoveableownerSavingsEarnings.add(totalShareCapital);
// Earnings per Member (only 3 types)
const NonMoveableInterestByMember = await prisma.interest.groupBy({
  by: ["member_Id"],
  where: {
    savings_type: { in: NonMoveablesavingsTypes },
    
  },
  _sum: { ownerShare: true },
});

combinedInterestByMember.sort((a, b)=> b.totalOwnerShare- a.totalOwnerShare);

console.log("InterestByMember:", InterestByMember);
console.log("LoanInterestByMember:", loanInterestByMember);
console.log("Combined:", combinedInterestByMember);


const MemberTotalImoveable = NonMoveableInterestByMember.map((s)=>{
  const shares = MembershareOnCapitalIntrest.find((mc)=> s.member_Id=== mc.member_Id);
  return{
    member_Id: s.member_Id,
    memberIntrest: Number(s._sum.ownerShare ?? 0),
    membersharesInterest: Number(shares?._sum.Accumu_interest?? 0),
    TotalImoveable: Number(s._sum.ownerShare?? 0 )+ Number(shares?._sum.Accumu_interest?? 0),
  };
});

MembershareOnCapitalIntrest.forEach((m) => {
  if(!MemberTotalImoveable.find((c) => c.member_Id === m.member_Id)){
    MemberTotalImoveable.push({
      member_Id:m.member_Id,
       memberIntrest: 0,
    membersharesInterest: Number(m._sum.Accumu_interest?? 0),
    TotalImoveable: Number(m._sum.Accumu_interest?? 0 )
    })
  }
})


  return {
    profit: Number(profit),
     totalOwnerEarnings: Number(totalOwnerEarnings),
    ownerSavingsEarnings : Number(ownerSavingsEarnings),
    ownerLoanEarnings: Number(ownerLoanEarnings),
    IntrestByGroup,
    TotalImoveable,
    emegencyFundBalance: Number(emegencyBalance),
    MembershareOnCapitalIntrest,
    InterestByMember,
    loanInterestByMember,
    NonMoveableInterestByMember,
    NonMoveableownerSavingsEarnings,
    combinedInterestByMember,
    Expenses: Number(cooporateExp),
    Incomes: Number(cooporateIncome),
    memberTotalImoveable: MemberTotalImoveable,
  
  };
   
}
