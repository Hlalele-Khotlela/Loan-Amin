import { prisma } from "../../../lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const loan_type = url.searchParams.get("selectedType");
  const search = url.searchParams.get("search");
  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = Number(url.searchParams.get("limit") ?? 10);

  try {
    const where: any = {
      
    };

    // Filter by loan type
   if (loan_type && loan_type !== "all") {
  where.loan_type = loan_type; // or { equals: loan_type }
}


    // Filter by member_Id (Int)
    if (search && !isNaN(Number(search))) {
      where.member_Id = Number(search);
    }

    // Count for pagination
    const total = await prisma.loan.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const skip = (safePage - 1) * limit;

    // Fetch results
    const result = await prisma.loan.findMany({
      where,
      skip,
      take: limit,
      orderBy: { request_id: "desc" },
      select: {
        member_Id: true,
        loan_id: true,
        totals_payeable: true,
        intrests: true,
        status: true,
        Principal: true,
        balance: true,
        loan_type: true,
      },
    });

    return NextResponse.json({
      data: result,
      pagination: {
        total,
        page: safePage,
        limit,
        totalPages,
      },
    });
  } catch (err) {
    console.error("DB error:", err);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
