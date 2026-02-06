"use client";

import { useEffect, useState } from "react";
import TransactionModal from "@/components/raffleModal";
import { usePermission } from "@/hooks/usePermission";
type RaffleTransaction = {
  id: string;
  created_at: string;
  deposit: number;
  withdrawals: number;
  balance: number;
  Descreption: string;
};

export default function Raffle() {
  const [transactions, setTransactions] = useState<RaffleTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDepositOpen, setDepositOpen] = useState(false);
  const [isWithdrawalOpen, setWithdrawalOpen] = useState(false);
  const { canApproveLoans, canManageStaff, canViewSavings } = usePermission();
  


const handleTransaction = async (data: { type: string; amount: number; description: string }) => { 
  try{
    const res = await fetch("/api/raffles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    console.log("Transaction result:", result);
    //  Refresh table data here (re-fetch transactions)
  }catch (err){
    console.error("Error submitting transaction:", err);

  }
}


  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/raffles"); // adjust route if needed
        const data = await res.json();
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error("Error fetching raffle data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading raffle data...</div>;
  }


  return (
    <div className="p-6">
      <div className="overflow-x-auto my-4">
        {canApproveLoans &&(
        <button onClick={() => setDepositOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          New Deposit
        </button>
        )}
        {canApproveLoans && (
        <button onClick={() => setWithdrawalOpen(true)}
          className="px-4 py-2 mx-4 bg-red-600 text-white rounded"
        >
          New Withdrawal
        </button>
        )}
      </div>
       {/* Deposit Modal */}
      <TransactionModal isOpen={isDepositOpen} onClose={() => setDepositOpen(false)}
      currentBalance={transactions[0]?.balance ?? 0}
        type="deposit"
        onSubmit={handleTransaction}
      />
        {/* Withdrawal Modal */}
      <TransactionModal isOpen={isWithdrawalOpen} onClose={() => setWithdrawalOpen(false)}
        type="withdrawal"
        currentBalance={transactions[0]?.balance ?? 0}
        onSubmit={handleTransaction}
      />
      <h1 className="text-xl font-bold mb-4">🎟️ Raffle Fund Transactions</h1>
      
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Deposit</th>
              <th className="px-4 py-2 border">Withdrawal</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Balance</th>
              
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">
                  {new Date(t.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">{t.Descreption}</td>
                <td className="px-4 py-2 border text-green-600">
                  {Number(t.deposit > 0) ? Number(t.deposit).toFixed(2) : "-"}
                </td>
                <td className="px-4 py-2 border text-red-600">
                  {Number(t.withdrawals > 0) ? Number(t.withdrawals).toFixed(2) : "-"}
                </td>
                
                <td className="px-4 py-2 border font-semibold">
                  {Number(t.balance).toFixed(2)}
                </td>
                
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No raffle transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    
  );
}
