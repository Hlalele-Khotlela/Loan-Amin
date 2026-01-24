import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("memberId");

  try {
    const data = memberId
      ? await prisma.shareOnCapital.findMany({ where: { member_Id: Number(memberId) } })
      : await prisma.shareOnCapital.findMany();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch share capital" }, { status: 500 });
  }
}
