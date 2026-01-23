// src/app/api/savings/route.ts
import { prisma } from "../../../../lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const type = url.searchParams.get("selectedType");
    const search = url.searchParams.get("search");
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 10);

    const where: any = {
      status: "active",
    };

    // Filter by savings type (ENUM)
    if (type && type !== "all") {
      where.savings_type = type;
    }

    // Search by member_Id or savings_id (both Int)
    if (search && !isNaN(Number(search))) {
      where.OR = [
        { member_Id: Number(search) },
        { savings_id: Number(search) },
      ];
    }

    // Count for pagination
    const total = await prisma.savings.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const skip = (safePage - 1) * limit;

    // Fetch filtered + paginated results
    const savings = await prisma.savings.findMany({
      where,
      skip,
      take: limit,
      orderBy: { savings_id: "desc" },
    });

    return NextResponse.json(
      {
        data: savings,
        totalCount: total,
        totalPages,
        page: safePage,
        limit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch savings" },
      { status: 500 }
    );
  }
}
