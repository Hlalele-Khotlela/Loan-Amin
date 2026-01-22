"use client";
import { useState } from "react";
type TransactionModalProps = { isOpen: boolean; onClose: () => void; onSuccess: () => void;} // 👈 add this }; 

export default function TransactionModal({ isOpen, onClose, onSuccess }:  TransactionModalProps) {
  const [type, setType] = useState<"deposit" | "withdrawal">("deposit");
  const [amount, setAmount] = useState("");
  const [Description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      type,
      amount: Number(amount),
      Description,
    };

    const res = await fetch("/api/EmegencyFund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert(`${type} recorded successfully!`);
      setAmount("");
      setDescription("");
      onClose();
      onSuccess();
    } else {
      alert("Error saving transaction");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Add {type}</h2>

        <form onSubmit={handleSubmit}>
          {/* Type Selector */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Transaction Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "deposit" | "withdrawal")}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Description</label>
            <input
              type="text"
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
