
import { prisma } from "@/lib/prisma/prisma";
import UserProfilePage from "./client";

export default async function Page({
  params}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const member= await prisma.member.findUnique({
    where: { member_Id: Number(memberId) },
  });
  return <UserProfilePage member_Id={Number(member?.member_Id)} />;
}
