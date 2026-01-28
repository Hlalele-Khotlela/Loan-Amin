import { Prisma } from "@prisma/client";
import { useState } from "react";
import type { Savings } from "@prisma/client";
import { toast } from "@/hooks/use-toast";

interface DepositModalProps { 
  isOpen: boolean;
  savingsId: number; 
  onClose: () => void;
}

export function DepositModal({ isOpen, savingsId, onClose }: DepositModalProps) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [savings, setSavings] = useState<Savings | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Make Payment</h2>
        <p><strong>Savings ID:</strong> {savingsId}</p>
        
        {savings && (
          <>
            <p><strong>Savings Type:</strong> {savings.savings_type}</p>
            <p><strong>Balance:</strong> {savings.amount.toString()}</p>
          </>
        )}

        <input
          type="number"
          value={paymentAmount}
          onChange={(e)=> setPaymentAmount(e.target.value)}
          placeholder="Enter payment amount"
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
            onClick={async () => {
              try {
                const res = await fetch(`/api/Savings/${savingsId}/deposit`, {
                  method: "POST",
                  headers: {"Content-Type": "application/json"},
                  body: JSON.stringify({ amount: Number(paymentAmount), action: "DEPOSIT" }),
                  
                
                });
                
                if (!res.ok) throw new Error("Payment failed");
                const updatedSavings = await res.json();
                setSavings(updatedSavings);

              } catch (err) {
                console.error(err);
                alert("Payment failed");
              }
              onClose();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
