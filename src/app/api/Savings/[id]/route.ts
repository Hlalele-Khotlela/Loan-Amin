import { prisma } from "@/lib/prisma/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/browser";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const savingsId = Number(id);

    const savings = await prisma.savings.findUnique({
      where: { savings_id: savingsId },
    });

    if (!savings) {
      return NextResponse.json(
        { message: "Savings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(savings);
  } catch (error) {
    console.error("Error fetching savings:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete Savings
export async function DELETE(_: Request, context: {params: Promise<{id: string}>}){
  const {id}= await context.params;
  const SavingId= parseInt(id, 10);

  console.log(SavingId)

  await prisma.savings.update({
    where:{savings_id: SavingId},
    data :{status: "inactive"}
    
  });
  return NextResponse.json({success: true});

}

// PUT (edit/update)

export async function PUT(req: Request, context: {params: Promise<{id: string}>}){
  const {id} = await context.params;
  const SavingsId = parseInt(id, 10);
  const body= await req.json();
  
  const amount= new Prisma.Decimal(body.amount);
  const intresRate = 0.01;
  const minAmount = new Prisma.Decimal(body.minAmount);
  const intrest= new Prisma.Decimal(body.interest);
  const total = amount.add(intrest)
 

  const updated = await prisma.savings.update({
    where: {savings_id:SavingsId},
    data:{
     amount:amount,
     interest: intrest,
     total: total,
     
     savings_type:body.type,
     min_amount: minAmount,
    },
  });
  return NextResponse.json(updated);
}