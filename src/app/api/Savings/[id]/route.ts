import { prisma } from "@/lib/prisma/prisma";
import { NextResponse } from "next/server";

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
