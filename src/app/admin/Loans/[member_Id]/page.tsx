import { Card, CardContent, CardHeader } from "@/components/ui/card";
import  {prisma} from "../../../../lib/prisma/prisma";
import { AdminNav } from "@/components/admin-nav";

export default async function memberLoansPage(props: {params: Promise<{ member_Id: string}>}) {
    const {member_Id}= await props.params;
    const id= Number(member_Id);


    const loans= await prisma.loan.findMany(
        {
            where: {member_Id:id},
            orderBy: {created_at: "desc"},
        }
    );

    return(
        <div className="flex gap-2">
            <AdminNav />

            <Card className="shadow-lg flex-auto">
                <CardHeader>Loans for {id}</CardHeader>

                <CardContent>
                    {loans.length===0? (
                        <p>No Loans available</p>
                    ) : (
                        <table className="w-full border-collapse mt-4">
                            <thead>
                                <tr>
                                    <th className="border px-2 py-1">Member</th>
                                    <th className="border px-2 py-1">Type</th>
                                    <th className="border px-2 py-1">Amount</th>
                                    <th className="border px-2 py-1">Balance</th>
                                    <th className="border px-2 py-1">Created at</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loans.map((loan)=> (
                                    <tr key={loan.loan_id}>
                                        <td className="border px-2 py-1">{loan.name}</td>
                                        <td className="border px-2 py-1">{loan.loan_type}</td>
                                        <td className="border px-2 py-1">{loan.amount.toString()}</td>
                                        <td className="border px-2 py-1">{loan.balance.toString()}</td>
                                        <td className="border px-2 py-1">{loan.created_at.toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>

            </Card>
        </div>
    )
    
}