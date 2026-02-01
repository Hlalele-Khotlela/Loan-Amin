import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { authorId, content } = await req.json();
    const comment = await prisma.loanRequestComments.create({
      data: {
        request_id: Number((await params).id),
        memberId: authorId,
        comment: content,
        role: "Credit",
      },
    });
    return NextResponse.json(comment);
  } catch (err) {
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const comments = await prisma.loanRequestComments.findMany({
      where: { request_id: Number((await params).id) },
      include: { author: true },
      
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}
