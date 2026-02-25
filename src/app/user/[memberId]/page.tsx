
import { prisma } from "@/lib/prisma/prisma";
import UserProfilePage from "./client";



export default async function Page({ params }: { params:Promise< { memberId: string } >}) {
  // params.memberId is a string from the URL, convert to number
  const {memberId} = await params;
  

  const member = await prisma.member.findUnique({
    where: { member_Id: Number(memberId) },
    include: {shares:true, loan:true, savings:true, groupSavings:true},
  });
  const shares = await prisma.shareOnCapital.findMany({
  where: { member_Id: Number(memberId) },
});


const safeShares = shares.map(s => ({ ...s, balance: Number(s.balance), amount: Number(s.amount), Current_interest: Number(s.Current_interest), Accumu_interest: Number(s.Accumu_interest), }));


  if (!member) {
    return <div>Member not found</div>;
  }

  return <UserProfilePage member_Id={member?.member_Id} shares={safeShares}/>;
}

