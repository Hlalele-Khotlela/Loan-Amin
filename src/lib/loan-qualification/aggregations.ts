import { prisma } from "@/lib/prisma/prisma";

// Calculate loan limits for a member
export async function loanAggregations(memberId: number) {
  // Aggregate compulsory + security savings
  const savings = await prisma.savings.groupBy({
    by: ["savings_type"],
    where: { member_Id: memberId },
    _sum: { amount: true },
  });

  const compulsory = savings.find(s => s.savings_type === "COMPULSARY")?._sum.amount ?? 0;
  const security   = savings.find(s => s.savings_type === "SECURITY")?._sum.amount ?? 0;

  // Aggregate share capital separately
  const shareCapitalAgg = await prisma.shareOnCapital.aggregate({
    where: { member_Id: memberId },
    _sum: { balance: true },
  });

  const shareCap = shareCapitalAgg._sum.balance ?? 0;

  // Calculate limits
  const shortTermLimit = 10000;
  const EmergencyLimit = 4000;
  const longTermLimit = (Number(compulsory) + Number(security) + Number(shareCap)) * 2;

  

  return {
    compulsory,
    EmergencyLimit,
    security,
    shareCap,
    shortTermLimit,
    longTermLimit,
  };
}
