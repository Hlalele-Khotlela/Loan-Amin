"use client";

import { useEffect, useState } from "react";

export default function GroupTransactions({ groupId }: { groupId: number }) {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      const res = await fetch(`/api/GroupSavings/${groupId}/transactions`);
      const data = await res.json();
      setTransactions(data);
    }
    fetchTransactions();
  }, [groupId]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Group Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-600">No transactions yet.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Type</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Date</th>
             
              <th className="p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{t.type}</td>
                <td className="p-2">R {Number(t.amount).toFixed(2)}</td>
                <td className="p-2">
                  {new Date(t.created_at).toLocaleDateString()}
                </td>
                
                <td className="p-2">{t.Description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
