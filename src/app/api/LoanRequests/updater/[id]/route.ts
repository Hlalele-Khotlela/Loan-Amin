// /app/api/LoanRequests/[id]/route.ts
import { NextResponse } from "next/server";
import  {prisma} from "../../../../../lib/prisma/prisma";

export async function PATCH(req: Request, context: {params: Promise<{ id: string }>}) {
  const { id } = await context.params;
  const { status } = await req.json();
  console.log("Updating request ID:", id, "to status:", status);

  const updated = await prisma.loanrequest.update({
    where: { request_id: Number(id) },
    data: { status },
  });

  return NextResponse.json(updated);
}
