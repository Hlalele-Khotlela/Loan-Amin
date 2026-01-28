
import { NextResponse } from "next/server";
import { aggregateOwnerEarnings } from "@/lib/OwnerAgg/route";
import { group } from "node:console";

export async function GET() {
  try {
    // Call your aggregation utility
    const data = await aggregateOwnerEarnings();
    const safeData = {
        totalOwnerEarnings: Number(data.totalOwnerEarnings), 
        ownerSavingsEarnings: Number(data.ownerSavingsEarnings), 
        ownerLoanEarnings: Number(data.ownerLoanEarnings),
        interestbyMember: data.InterestByMember,
        loanIntrestByMember:data.loanInterestByMember,
        groupIntrest:data.IntrestByGroup,
        totalMemberInterest: data.combinedInterestByMember,
        nonMoveableAssets: data.NonMoveableownerSavingsEarnings,
        nonMoveableAssetByMember: data.NonMoveableInterestByMember,
        memberTotalImoveable: data.memberTotalImoveable,
        Income:data.Incomes,
        expenses: data.Expenses,
        profits:data.profit,
        emegencyFundBalance: data.emegencyFundBalance,
        totalEarnings: data.totalOwnerEarnings,
    

    }

    // Return JSON response
    console.log("Returning:", safeData);

    return NextResponse.json(safeData);

  } catch (error) {
    console.error("Error fetching owner earnings:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
