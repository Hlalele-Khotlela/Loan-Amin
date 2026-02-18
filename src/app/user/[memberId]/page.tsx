
import { prisma } from "@/lib/prisma/prisma";
import UserProfilePage from "./client";



export default async function Page({ params }: { params:Promise< { memberId: string } >}) {
  // params.memberId is a string from the URL, convert to number
  const {memberId} = await params;
  

  const member = await prisma.member.findUnique({
    where: { member_Id: Number(memberId) },
  });

  if (!member) {
    return <div>Member not found</div>;
  }

  return <UserProfilePage member_Id={member?.member_Id} />;
}

