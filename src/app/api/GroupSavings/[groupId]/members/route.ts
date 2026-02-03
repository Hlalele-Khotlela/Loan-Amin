import { prisma } from "@/lib/prisma/prisma";
import { promises } from "dns";
import { NextResponse } from "next/server";

export async function GET(
  req: Request, {params} : {params: Promise<{groupId: number}>}
)


{
  try {
    const groupId = await params;
    const id = Number(groupId.groupId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid group ID" },
        { status: 400 }
      );
    }

    const group = await prisma.groupSaving.findUnique({
      where: { group_id: id },
      include: {
        members: {
          select: {
            member_Id: true,
            firstName: true,
            lastName: true,
            
          },
          
        },
        MemberInterest: true,
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }
console.log("Group members:", group.members);

    return NextResponse.json(group.members);
  } catch (error) {
    console.error("Error fetching group members:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
