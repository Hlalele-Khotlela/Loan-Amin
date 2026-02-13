"use client";

import { useState } from "react";
import { toast } from '@/hooks/use-toast';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "deposit" | "withdrawal";
  currentBalance: number;
  onSubmit: (data: { type: string; amount: number; description: string }) => void;
}

export default function TransactionModal({
  isOpen,
  onClose,
  type,
   currentBalance,
  onSubmit,
}: TransactionModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (amount <= 0) return;
    onSubmit({ type, amount, description });
    setAmount(0);
    setDescription("");
    toast({title: "Response Submitted!",
                description: "Transaction Successful.",});
    onClose();
  };

  const isOverdraft = type === "withdrawal" && amount > currentBalance;
   const isDisabled = amount <= 0 || isOverdraft;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4 capitalize">
          {type === "deposit" ? "Make a Deposit" : "Make a Withdrawal"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Optional description"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
          
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            className={`px-4 py-2 rounded text-white disabled:opacity-30 ${
              type === "deposit" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {type === "deposit" ? "Deposit" : "Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
}
