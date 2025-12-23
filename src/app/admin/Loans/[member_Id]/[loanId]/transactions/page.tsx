import { prisma } from "../../../../../../lib/prisma/prisma";

export default async function LoanTransaction({params}: {params: Promise <{member_Id:string; loanId: string}>}) {
   const {member_Id, loanId}= await params;
   const loanIdNum= Number(loanId);

//    fetch transactions for this loan

const transactions= await prisma.loanTransaction.findMany({
    where: {loan_id: loanIdNum},
    orderBy: {applied_at: "desc"},
});
// console.log("Params:", { member_Id, loanId });



return(
    <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Interest for Loan {loanId}</h1>
        {transactions.length === 0? (
            <p>No transactions found. </p>
        ): (
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">Date</th>
                        <th className="px-4 py-2 border">Interest</th>
                        <th className="px-4 py-2 border">New Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx)=>(
                        <tr key={tx.id}>
                            <td className="px-4 py-4 border">{tx.applied_at.toLocaleDateString()}</td>
                            <td className="px-4 py-4 border">{tx.interest.toString()}</td>
                            <td className="px-4 py-4 border">{tx.new_balance.toString()}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
)

}