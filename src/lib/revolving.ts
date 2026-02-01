// utils/revolving.ts
import { Prisma } from "@prisma/client";
import { max } from "date-fns";


export interface RevolvingResult { 
    eligible: boolean;
     reason?: string; 
     maxRevolvingAmount?: number;    // 👈 new field
      } 
export function checkRevolvingEligibility(
  loan: { loan_type: string; Principal: Prisma.Decimal | number; instalments: Prisma.Decimal | number; balance?: Prisma.Decimal | number; status: string },
  limits: { shortTermLimit: number; emergencyLimit: number }
) : RevolvingResult {
  if (loan.status !== "active") {
    return { eligible: false, reason: `Loan is not active ( status: ${loan.status})` };
  }
  

  const Principal = loan.Principal instanceof Prisma.Decimal ? loan.Principal.toNumber() : loan.Principal;
  const instalments = loan.instalments instanceof Prisma.Decimal ? loan.instalments.toNumber() : loan.instalments;
  const balance = loan.balance instanceof Prisma.Decimal ? loan.balance.toNumber() : loan.balance ?? Principal - instalments;
  
let maxRevolvingAmount = 0;
  if (loan.loan_type === "LONG_TERM") {
    const repaidRatio = instalments / Principal;
    if (repaidRatio >= 0.3) {
       maxRevolvingAmount = Principal - instalments;
      return { eligible: true, maxRevolvingAmount };
    }
  return { eligible: false, reason: "Less than 30% of principal repaid for long-term loan" };
  }

  if (loan.loan_type === "SHORT_TERM") {
    if (balance < limits.shortTermLimit) {
        maxRevolvingAmount = limits.shortTermLimit - balance;
      return { eligible: true, maxRevolvingAmount };
    }
    return { eligible: false, reason: "Remaining balance exceeds short-term limit" };
  }

  if (loan.loan_type === "EMERGENCY") {
    if (balance < limits.emergencyLimit) {
        const maxRevolvingAmount = limits.emergencyLimit - balance;
      return { eligible: true, maxRevolvingAmount };
    }
    return { eligible: false, reason: "Remaining balance exceeds emergency limit" };
  }

  return { eligible: false, reason: "Unknown loan type" };
}
