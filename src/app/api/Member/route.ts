import { prisma } from "../../../lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    
  try {
    const members = await prisma.member.findMany({
      select: {
         member_Id: true,
          firstName: true, 
          lastName: true,
          phone: true,
          email: true,
          groupSavings: true,

        }, 
      orderBy: { firstName: "asc" },
    });

    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

// this is for displaying all members