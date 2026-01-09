import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await params;
  try {
    const transactions = await prisma.groupSavingsTransaction.findMany({
      where: { group_id: Number(groupId) },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching group transactions:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}