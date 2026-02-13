import { useState, useEffect } from "react";
import type { Savings } from "@prisma/client";
import { toast } from '@/hooks/use-toast';

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
  const [interest, setInterest] = useState("");
  const [savings, setSavings] = useState<Savings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setInterest("");
      setError(null);
      fetch(`/api/Savings/${savingsId}`)
        .then((res) => res.json())
        .then((data) => setSavings(data))
        .catch(() => setError("Failed to load savings"));
    }
  }, [isOpen, savingsId]);

  if (!isOpen) return null;

  const title = mode === "DEPOSIT" ? "Make Deposit" : "Make Withdrawal";
  const buttonColor = mode === "DEPOSIT" ? "bg-blue-600" : "bg-red-600";
  const buttonHover = mode === "DEPOSIT" ? "hover:bg-blue-700" : "hover:bg-red-700";

  async function handleSubmit() {
    if(!amount && !interest){
      setError("Please provide either an amount or interest.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/Savings/${savingsId}/${mode.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount ? Number(amount) : null,   // 👈 allow null
          interest: interest ? Number(interest) : null, // 👈 allow null
          action: mode,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Transaction failed");
        
      }

      const updated: Savings = await res.json();
      setSavings(updated);
      toast({
                title: "Response Submitted!",
                description: "Transaction Successful.",
              });
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Validation only if values are provided
  const amountError =
    amount && Number(amount) < 0 ? "Amount must be ≥ 0" : null;
  const interestError =
    interest && Number(interest) < 0 ? "Interest must be ≥ 0" : null;

  const isInvalid = loading; // 👈 only disable while loading

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}

        {savings && (
          <>
            <p><strong>Savings Type:</strong> {savings.savings_type}</p>
            <p><strong>Savings Interest:</strong> {savings.interest.toString()}</p>
            <p><strong>Balance:</strong> {savings.amount.toString()}</p>
          </>
        )}

        <div className="mt-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount (optional)"
            className="border border-gray-300 rounded px-2 py-1 w-full"
          />
          {amountError && <p className="text-red-600 text-sm">{amountError}</p>}
        </div>

        {mode === "WITHDRAWAL" && (
          <div className="mt-3">
            <input
              type="number"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="Enter interest (optional)"
              className="border border-gray-300 rounded px-2 py-1 w-full"
            />
            {interestError && <p className="text-red-600 text-sm">{interestError}</p>}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isInvalid}
            className={`${buttonColor} text-white px-4 py-2 rounded ${buttonHover} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
