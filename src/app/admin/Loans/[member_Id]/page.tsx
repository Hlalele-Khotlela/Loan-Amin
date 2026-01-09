import { Card, CardContent, CardHeader } from "@/components/ui/card";
import  {prisma} from "../../../../lib/prisma/prisma";
import Link from "next/link";

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
            

            <Card className="shadow-lg flex-auto">
                <CardHeader>Loans for {id}</CardHeader>

                <CardContent>
                    {loans.length===0? (
                        <p>No Loans available</p>
                    ) : (
                        <table className="w-full border-collapse mt-4">
                            <thead>
                                <tr>
                                    
                                    <th className="border px-2 py-1">Type</th>
                                    <th className="border px-2 py-1">Amount</th>
                                    <th className="border px-2 py-1">Balance</th>
                                    <th className="border px-2 py-1">Created at</th>
                                    <th className="border px-2 py-1">More</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loans.map((loan)=> (
                                    <tr key={loan.loan_id}>
                                        
                                        <td className="border px-2 py-1">{loan.loan_type}</td>
                                        <td className="border px-2 py-1">{loan.Principal.toString()}</td>
                                        <td className="border px-2 py-1">{loan.balance.toString()}</td>
                                        <td className="border px-2 py-1">{loan.created_at.toLocaleDateString()}</td>
                                        <td className="border px-2 py-1">
                                            <Link
                    href={`/admin/Loans/${loan.member_Id}/${loan.loan_id}/transactions`}
                    className="text-green-600"
                  >
                    View
                  </Link>
                                        </td>
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