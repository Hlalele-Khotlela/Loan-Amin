import { useState, useEffect } from "react";
import type { Savings } from "@prisma/client";

interface SavingsTransactionModalProps {
  isOpen: boolean;
  savingsId: number;
  mode: "DEPOSIT" | "WITHDRAWAL";
  onClose: () => void;
}

export function SavingsTransactionModal({
  isOpen,
  savingsId,
  mode,
  onClose,
}: SavingsTransactionModalProps) {
  const [amount, setAmount] = useState("");
  const [savings, setSavings] = useState<Savings | null>(null);

  // Optional: Load savings info when modal opens
  useEffect(() => {
    if (isOpen) {
        setAmount("");
      fetch(`/api/Savings/${savingsId}`)
        .then((res) => res.json())
        .then((data) => setSavings(data))
        .catch(() => console.error("Failed to load savings"));
    }
  }, [isOpen, savingsId]);

  if (!isOpen) return null;

  const title = mode === "DEPOSIT" ? "Make Deposit" : "Make Withdrawal";
  const buttonColor = mode === "DEPOSIT" ? "bg-blue-600" : "bg-red-600";
  const buttonHover = mode === "DEPOSIT" ? "hover:bg-blue-700" : "hover:bg-red-700";

  async function handleSubmit() {
    try {
        console.log("MODAL ID:", savingsId);

      const res = await fetch(`/api/Savings/${savingsId}/${mode.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          action: mode,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({})); 
        console.error("WITHDRAWAL ERROR:", error); 
        throw new Error(error.message || "Transaction failed");
      }

      const updated = await res.json();
      setSavings(updated);
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <p><strong>Savings ID:</strong> {savingsId}</p>

        {savings && (
          <>
            <p><strong>Savings Type:</strong> {savings.savings_type}</p>
            
            <p><strong>Balance:</strong> {savings.amount.toString()}</p>

          </>
        )}

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="border border-gray-300 rounded px-2 py-1 w-full mt-3"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className={`${buttonColor} text-white px-4 py-2 rounded ${buttonHover}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
