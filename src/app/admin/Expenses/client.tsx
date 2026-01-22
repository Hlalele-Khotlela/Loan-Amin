"use client";
import { useEffect, useState } from "react";
import ExpensesModal from "@/components/ExpensesModal";

export default function ExpenseTable() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [month, setMonth] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function fetchData(selectedMonth?: string) {
    const url = selectedMonth ? `/api/Expenses?month=${selectedMonth}` : "/api/Expenses";
    const res = await fetch(url);
    const json = await res.json();
    setTransactions(json.transactions ?? []);
    setMonths(json.months ?? []);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleMonthChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setMonth(value);
    fetchData(value);
  }

  const totalIncome = transactions.reduce((sum, t) => sum + Number(t.amount ?? 0), 0);
  const finalBalance = transactions.length > 0 ? Number(transactions[0].balance) : 0;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Expenses History</h2>

      {/* Month Filter */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Month:</label>
        <select value={month} onChange={handleMonthChange} className="border px-3 py-2 rounded">
          <option value="">All</option>
          {months.map((m) => {
            const [year, mon] = m.split("-");
            const monthName = new Date(Number(year), Number(mon) - 1).toLocaleString("default", {
              month: "long",
            });
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
        Add Expenses
      </button>

      {/* Modal */}
      <ExpensesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchData(month)}
      />

      {/* Table */}
      <table className="min-w-full border border-gray-300 rounded-lg mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Balance</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-center">
                {new Date(t.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border">{t.Description}</td>
              <td className="px-4 py-2 border text-right">{Number(t.amount).toFixed(2)}</td>
              <td className="px-4 py-2 border text-right font-semibold">
                {Number(t.balance).toFixed(2)}
              </td>
            </tr>
          ))}

          {/* Summary Row */}
          <tr className="bg-gray-200 font-bold">
            <td className="px-4 py-2 border text-center">Summary</td>
            <td className="px-4 py-2 border">Totals</td>
            <td className="px-4 py-2 border text-right">{totalIncome.toFixed(2)}</td>
            <td className="px-4 py-2 border text-right">{finalBalance.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
