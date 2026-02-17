// src/app/api/Member/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import { getMemberDashboardData } from "@/lib/memberAgg/route";

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      select: {
        member_Id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        shares: true,
        Status: true,
        
      },
      orderBy: { firstName: "asc" },
    });

    // Attach dashboard data for each member
    const enriched = await Promise.all(
      members.map(async (m) => {
        const dashboard = await getMemberDashboardData(m.member_Id);
        return { ...m, dashboard };
      })
    );

    return NextResponse.json(enriched, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
