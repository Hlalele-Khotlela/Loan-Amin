// utils/revolving.ts
import { Prisma } from "@prisma/client";



export interface RevolvingResult { 
    eligible: boolean;
     reason?: string; 
     maxRevolvingAmount?: number;    // 👈 new field
      } 
export function checkRevolvingEligibility(
  loan: { loan_type: string; Principal: Prisma.Decimal | number; instalments: Prisma.Decimal | number; balance?: Prisma.Decimal | number; status: string },
  limits: { shortTermLimit: number; EmergencyLimit: number; longTermLimit?: number }
): RevolvingResult {
  
  if (loan.status !== "active") {
    return { eligible: false, reason: `Loan is not active (status: ${loan.status})` };
  }

  const Principal = loan.Principal instanceof Prisma.Decimal ? loan.Principal.toNumber() : loan.Principal;
  const instalments = loan.instalments instanceof Prisma.Decimal ? loan.instalments.toNumber() : loan.instalments;
  const balance = loan.balance instanceof Prisma.Decimal ? loan.balance.toNumber() : loan.balance ?? Principal - instalments;

  const loanType = loan.loan_type.toUpperCase();
  let maxRevolvingAmount = 0;

  switch (loanType) {
    case "LONG_TERM": {
      if (limits.longTermLimit == null) {
        return { eligible: false, reason: "Long-term limit not defined" };
      }
      const repaidRatio = instalments / Principal;
      if (repaidRatio >= 0.3) {
        maxRevolvingAmount = limits.longTermLimit - balance;
        return { eligible: true, reason: "Eligible for long-term loan", maxRevolvingAmount };
      }
      return { eligible: false, reason: "Less than 30% of principal repaid for long-term loan" };
    }

    case "EMERGENCY": {
      if (balance < limits.EmergencyLimit) {
        maxRevolvingAmount = limits.EmergencyLimit - balance;
        return { eligible: true, reason: "Eligible for emergency loan", maxRevolvingAmount };
      }
      return { eligible: false, reason: "Remaining balance exceeds emergency limit" };
    }

    case "SHORT_TERM": {
      if (balance < limits.shortTermLimit) {
        maxRevolvingAmount = limits.shortTermLimit - balance;
        return { eligible: true, reason: "Eligible for short-term loan", maxRevolvingAmount };
      }
      return { eligible: false, reason: "Remaining balance exceeds short-term limit" };
    }

    default:
      return { eligible: false, reason: `Unknown loan type: ${loan.loan_type}` };
  }
}
