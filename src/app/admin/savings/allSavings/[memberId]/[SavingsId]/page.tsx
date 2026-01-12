import { prisma } from "@/lib/prisma/prisma";
import { SavingsDetails } from "./savingDetails";

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

  return (
    <div className="p-6">
      <SavingsDetails savings={savings} />

      <h1 className="text-xl font-bold mb-4">
        Transactions for Saving #{savings.savings_id}
      </h1>

      {savings.transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Transaction</th>
              <th className="px-4 py-2 border">Amount</th>
              
            </tr>
          </thead>
          <tbody>
            {savings.transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="px-4 py-4 border">
                  {tx.created_at.toLocaleDateString()}
                </td>
                <td className="px-4 py-4 border">{tx.type}</td>
                <td className="px-4 py-4 border">{tx.amount.toString()}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
