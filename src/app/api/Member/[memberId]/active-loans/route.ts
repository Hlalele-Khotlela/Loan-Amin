import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const { memberId } = await params;
  const memberIdInt = parseInt(memberId, 10);

  const activeLoans = await prisma.loan.findMany({
    where: {
      member_Id: memberIdInt,        // ✅ pass plain number
      status: "active",              // ✅ match your enum/string exactly
    },
    select: { 
      loan_type: true,
      Principal: true,
      
      
      instalments: true,
      balance: true,
      status: true,
      loan_id: true
     },
  });
 

  if(!activeLoans || activeLoans.length === 0){
    return NextResponse.json({error:"No active loans found"}, {status:404});
  }

  return NextResponse.json(activeLoans);
}
