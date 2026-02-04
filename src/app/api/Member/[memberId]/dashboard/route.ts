import { NextResponse } from "next/server";
import { getMemberDashboardData } from "@/lib/memberAgg/route";

export async function GET(req: Request, { params }: { params: { memberId: string } }) {
  const memberId = Number(params.memberId);
  if (isNaN(memberId)) {
    return NextResponse.json({ error: "Invalid memberId" }, { status: 400 });
  }

  try {
    const dashboard = await getMemberDashboardData(memberId);
    return NextResponse.json(dashboard, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
