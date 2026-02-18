import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import { G } from "@genkit-ai/googleai";
import { Decimal } from "@prisma/client/runtime/client";

export async function PUT(
  req: Request,
  { params }: { params:Promise< { interestId: string }> }
) {
  try {
    const {interestId} = await params;
    // Convert params.id (string) to number
    const idNum = Number(interestId);
      const body = await req.json();
    
    if (isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }


    const updated = await prisma.memberInterest.update({
      where: { id:idNum }, // ✅ numeric id
      data: { AccumulatedInterest:body.AccumulatedInterest },
    });

  //  update group balance
  const groupId = updated.group_Id;
   const allInterests = await prisma.memberInterest.findMany({
    where: { group_Id: groupId },
    select: { AccumulatedInterest: true },
   });

    const totalInterest = allInterests.reduce(
       (sum, mi) => sum + Number(mi.AccumulatedInterest), 
       0 
      );

      // total savings
      const totalSavings= await prisma.groupSaving.findMany({
        where:{group_id: groupId},
        select:{total_Savings:true}
      });

      const totals = totalSavings.reduce(
        (sum, mi) => sum + Number(mi.total_Savings),
        0
      );


     // Step 3: Update group record 
     const totalGroupSavings = new Decimal(totalInterest).add(new Decimal(totals));
     await prisma.groupSaving.update({
       where: { group_id: groupId }, 
       data: { interest:totalInterest,
        total_Savings:totalGroupSavings,
        current_total:totalGroupSavings
        }, 
      });  


    return NextResponse.json({
      newGroupInterestBalance: totalInterest,
      updated
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
