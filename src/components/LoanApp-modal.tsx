"use client";

import { useState } from "react";
interface LoanApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: number;
}

export function LoanApplicationModal({ isOpen, onClose, memberId }: LoanApplicationModalProps) {
  if (!isOpen) return null;

  async function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    await fetch("/api/loans/apply", {
      method: "POST",
      body: JSON.stringify({
        memberId,
        amount: formData.get("amount"),
        type: formData.get("type"),
      }),
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Apply for Loan</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="amount"
            type="number"
            placeholder="Loan Amount"
            className="border p-2 rounded w-full"
            required
          />

          <select name="type" className="border p-2 rounded w-full" required>
            <option value="SHORT_TERM">Short Term</option>
            <option value="LONG_TERM">Long Term</option>
            <option value="EMERGENCY">Emergency</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
