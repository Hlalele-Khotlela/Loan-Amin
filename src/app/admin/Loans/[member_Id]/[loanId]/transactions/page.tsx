import { prisma } from "@/lib/prisma/prisma";
import { LoanDetails } from "./LoanDetails";

export default async function LoanTransaction({
  params,
}: {
  params: Promise<{ member_Id: string; loanId: string }>; // ✅ params is a Promise
}) {
  const { member_Id, loanId } = await params; // ✅ unwrap the Promise

  const loanIdInt = parseInt(loanId, 10);

  if (isNaN(loanIdInt)) {
    return <p>Invalid loanId param</p>;
  }

  const loan = await prisma.loan.findUnique({
    where: { loan_id: loanIdInt },
    include: { transactions: true },
  });

  if (!loan) {
    return <p>Loan not found</p>;
  }

  return (
    <div className="p-6">
      <LoanDetails loan={loan} />

      <h1 className="text-xl font-bold mb-4">
        Transactions for Loan #{loan.loan_id}
      </h1>

      {loan.transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Transaction</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">New Balance</th>
            </tr>
          </thead>
          <tbody>
            {loan.transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="px-4 py-4 border">
                  {tx.applied_at.toLocaleDateString()}
                </td>
                <td className="px-4 py-4 border">{tx.type}</td>
                <td className="px-4 py-4 border">{tx.amount.toString()}</td>
                <td className="px-4 py-4 border">{tx.new_balance.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
