"use client";
import { useState } from "react";
import { toast } from '@/hooks/use-toast';

export default function IncomeModal({ isOpen, onClose, onSuccess }: any) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState(""); // 👈 enum type instead of Description

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { amount: Number(amount), type }; // 👈 send enum type

    const res = await fetch("/api/incomeExp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setAmount("");
      setType("");
      onSuccess();
      toast({title: ` Response Submitted!`,
                      description: "Transaction Successful.",}); // refresh table
      onClose();   // close modal
    } else {
      toast({title: `Response Submitted!`,
                      description: "Transaction Failed.",});
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Add Income</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Income Type</option>
            <option value="Penalty">Penalty</option>
            <option value="others">Others</option>
            <option value="LoanInterest">Loan Interest</option>
            <option value="BankChargeContribution">Bank Charge Contribution</option>
            <option value="BadDebtsRecovered">Bad Debts Recovered</option>
            <option value="stokvel">Stokvel</option>
            <option value="Raffle">Raffle</option>
         
          </select>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Save Income
          </button>
        </form>
      </div>
    </div>
  );
}
