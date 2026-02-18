// src/app/api/loan-limit/[memberId]/route.ts
import { NextResponse } from "next/server";
import { loanAggregations } from "@/lib/loan-qualification/aggregations";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ memberId: string }> }   // <-- no Promise here
) {
  try {
    const { memberId } = await params;
    const limits = await loanAggregations(Number(memberId));
    

    return NextResponse.json(limits);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
