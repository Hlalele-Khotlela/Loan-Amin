"use client";
import { useEffect, useState } from "react";
import TransactionModal from "@/components/EmegencyFundModal";

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [month, setMonth] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [months, setMonths] = useState<string[]>([]);

  async function fetchData(selectedMonth?: string) {
    const url = selectedMonth
      ? `/api/EmegencyFund?month=${selectedMonth}`
      : "/api/EmegencyFund";
      
      


       console.log("Fetching URL:", url);
    const res = await fetch(url, {cache:"no-store"});
    const json = await res.json();





    setTransactions(json.transactions ?? []);
    
    setMonths(json.months ?? []);
    
  }

  useEffect(() => {
    fetchData();
  }, []);

  // 👉 Handle month change
  function handleMonthChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setMonth(value);
    fetchData(value);
  }

  // 👉 Compute totals
  const totalDeposits = transactions.reduce(
    (sum, t) => sum + Number(t.deposit ?? 0),
    0
  );
  const totalWithdrawals = transactions.reduce(
    (sum, t) => sum + Number(t.withdrawals ?? 0),
    0
  );
  
    const finalBalance = totalDeposits - totalWithdrawals;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Emergency Fund History</h2>

      {/* Month Filter */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Month:</label>
        <select
          value={month}
          onChange={handleMonthChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All</option>
          {months.map((m) => {
            const [year, mon] = m.split("-");
            const monthName = new Date(Number(year), Number(mon) - 1).toLocaleString(
              "default",
              { month: "long" }
            );
            return (
              <option key={m} value={m}>
                {monthName} {year}
              </option>
            );
          })}
        </select>
      </div>

      {/* Button to open modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add Deposit / Withdrawal
      </button>

      {/* Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchData(month)} // refresh after save
      />

      {/* Table */}
      {/* Debug output */}



      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Deposit</th>
            <th className="px-4 py-2 border">Withdrawals</th>
            <th className="px-4 py-2 border">Balance</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">
                  {new Date(t.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">{t.Description}</td>
                <td className="px-4 py-2 border text-right">
                  {t.deposit ? Number(t.deposit).toFixed(2) : "0.00"}
                </td>
                <td className="px-4 py-2 border text-right">
                  {t.withdrawals ? Number(t.withdrawals).toFixed(2) : "0.00"}
                </td>
                <td className="px-4 py-2 border text-right font-semibold">
                  {Number(t.balance).toFixed(2)}
                </td>
              </tr>
            ))
          )}

          {/* Summary Row */}
          {transactions.length > 0 && (
            <tr className="bg-gray-200 font-bold">
              <td className="px-4 py-2 border text-center">Summary</td>
              <td className="px-4 py-2 border">Totals</td>
              <td className="px-4 py-2 border text-right">
                {totalDeposits.toFixed(2)}
              </td>
              <td className="px-4 py-2 border text-right">
                {totalWithdrawals.toFixed(2)}
              </td>
              <td className="px-4 py-2 border text-right">
                {finalBalance.toFixed(2)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
