// src/app/api/memberInterest/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();

  const updated = await prisma.memberInterest.update({
    where: { id: Number(params.id) },
    data: {
      
      AccumulatedInterest: data.AccumulatedInterest,
    },
  });

  return NextResponse.json(updated);
}
