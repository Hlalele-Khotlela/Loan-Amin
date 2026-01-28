"use client";
import { useState } from "react";
import {toast} from "@/hooks/use-toast";


export default function ExpensesModal({ isOpen, onClose, onSuccess }: any) {
  const [amount, setAmount] = useState("");
  const [Description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { amount: Number(amount), Description };

    const res = await fetch("/api/Expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setAmount("");
      setDescription("");
      onSuccess(); // refresh table
      onClose();   // close modal
       toast({ title: "Transaction Successfull!",
                description: "Expense has been updated.",
              });
    } else {
      toast(
        {title: "Transaction Failed",
            description: "Failed to create Expense"
        }
      );
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
        <h2 className="text-xl font-bold mb-4">Add Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
            required
          />
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
