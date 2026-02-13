import { prisma } from "@/lib/prisma/prisma";
import SavingsClient from "./SavingClient";
type SerializedTransaction = {
   id: number; 
   amount: string; 
   type: string; 
   createdAt: Date;
   };

type SerializedSavings = {
  savings_id: number;
  member_Id: number;
  savings_type: string;
  status: string;
  started_at: Date;
  amount: string;
  interest: string;
  total: string;
  min_amount: string;
  transactions: SerializedTransaction[];
};


export default async function SavingsTransactions({
  params,
}: {
  params: Promise<{ member_Id: string; SavingsId: string }>; // ✅ params is a Promise
}) {
  const { member_Id, SavingsId } = await params; // ✅ unwrap the Promise

  const savingIdInt = parseInt(SavingsId, 10);
  const memberIdInt = parseInt(SavingsId, 10);

  if (isNaN(savingIdInt)) {
    return <p>Invalid SavingsId param</p>;
  }

  const savings = await prisma.savings.findUnique({
    where: { savings_id: savingIdInt,
        // member_Id:memberIdInt

     },
    include: { transactions: true },
  });

  if (!savings) {
    return <p>Saving not found</p>;
  }
  function SerializeSavings(savings: any): SerializedSavings{
    return{
      ...savings, 
      amount: savings.amount?.toString() ?? "0.00",
      interest: savings.interest?.toString()?? "0.00",
      total: savings.total?.toString()?? "0.00",
      min_amount: savings.min_amount?.toString()?? "0.00",
      transactions: savings.transactions?.map((st:any)=>(
       {
        ...st,
        amount: st.amount?.toString()?? "0.00",
       }
      ))

    }
    
    
  }
  return (
   <SavingsClient savings={SerializeSavings((savings))}/>
  )
}
