import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function GET() {
//   const { groupId } = await params;
try{

     const groups = await prisma.groupSaving.findMany({
    include: {
        members: true,
        deposits: true,
        withdraw: true,
    },
  });
  return NextResponse.json(groups);
}
 catch (error){
    console.error("API Error", error);
    return NextResponse.json(
        {error: "Failed to fetch groups"},
        {status: 500}
    );
 }

}
