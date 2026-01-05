// src/app/api/savings/route.ts
import { prisma } from "../../../../lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const savings = await prisma.savings.findMany();
    return NextResponse.json(savings, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch savings" }, { status: 500 });
  }
}
