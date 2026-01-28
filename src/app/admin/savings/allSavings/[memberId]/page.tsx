
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import  {prisma} from "../../../../../lib/prisma/prisma";
import Link from "next/link";
import ClientSavingsPage from "./client";

export default async function memberLoansPage(props: {params: Promise<{ memberId: string}>}) {
    const {memberId}= await props.params;
    const id= parseInt(memberId, 10);
  


    const savings= await prisma.savings.findMany(
        {
            where: {member_Id:id},
            orderBy: {started_at: "desc"},
        }
    );

    return(
       <ClientSavingsPage savings={savings} id={id}/>
    )
    
}