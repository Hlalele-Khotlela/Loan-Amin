import { prisma } from "../../../../lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const groups = await prisma.groupSaving.findMany({  
            select: {name: true, group_id: true},
            orderBy: {
                group_id: "asc"
            }
        });
        console.log("Fetched groups:", groups);
            return NextResponse.json(groups, { status: 200 });
    }
    catch(error){
        console.error(error);
        return NextResponse.json(
            {error: "failed to fetch groups"},
            {status:500}
        );


    }
}
 