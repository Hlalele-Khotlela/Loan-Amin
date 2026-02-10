import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function PUT(
  req: Request,
  { params }: { params:Promise< { id: string }> }
) {
  try {
    const {id} = await params;
    // Convert params.id (string) to number
    const idNum = Number(id);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const { AccumulatedInterest } = await req.json();

    const updated = await prisma.memberInterest.update({
      where: { id:idNum }, // ✅ numeric id
      data: { AccumulatedInterest },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
