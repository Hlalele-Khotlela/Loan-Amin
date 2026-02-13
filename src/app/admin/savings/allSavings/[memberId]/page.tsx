
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import  {prisma} from "../../../../../lib/prisma/prisma";
import Link from "next/link";
import ClientSavingsPage from "./client";

function serializeSavings(savings: any) {
     return { 
        ...savings, 
        amount: savings.amount?.toString() ?? "0.00", 
        interest: savings.interest?.toString() ?? "0.00", 
        total: savings.total?.toString() ?? "0.00", 
        min_amount: savings.min_amount?.toString() ?? "0.00", 
        
        transactions: savings.transactions?.map((t: any) => ({ 
            ...t, amount: t.amount?.toString() ?? "0.00", })), }; } 
export default async function memberLoansPage(props: {params: Promise<{ memberId: string}>}) {
    const {memberId}= await props.params;
    const id= parseInt(memberId, 10);
  


    const savings= await prisma.savings.findMany(
        {
            where: {member_Id:id},
            orderBy: {started_at: "desc"},
        }
    );
    const plainSavings = savings.map((s) => serializeSavings(s));

    return(
       <ClientSavingsPage savings={plainSavings} id={id}/>
    )
    
}