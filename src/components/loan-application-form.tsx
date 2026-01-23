"use client";

import { useState } from "react";

interface LoanApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: number;
}

export function LoanApplicationModal({
  isOpen,
  onClose,
  memberId,
}: LoanApplicationModalProps) {
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload = {
      memberId,
      loanType: formData.get("loanType"),
      amount: formData.get("amount"),
      collateralType: formData.get("collateralType"),
      collateral1: formData.get("collateral1"),
      collateral2: formData.get("collateral2"),
      collateral3: formData.get("collateral3"),
      duration: formData.get("duration"),

    };

  await fetch("/api/LoanRequests/apply", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

    onClose();
  };
console.log("Modal memberId:", memberId);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Apply for Loan</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Loan Type */}
          <div>
            <label className="block mb-1 font-medium">Loan Type</label>
            <select
              name="loanType"
              className="border p-2 rounded w-full"
              required
            >
              <option value="SHORT_TERM">Short Term</option>
              <option value="LONG_TERM">Long Term</option>
              <option value="EMERGENCY">Emergency</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block mb-1 font-medium">Amount</label>
            <input
              name="amount"
              type="number"
              placeholder="Enter amount"
              className="border p-2 rounded w-full"
              required
            />
          </div>

            <div>
            <label className="block mb-1 font-medium">Duration</label>
            <input
              name="duration"
              type="number"
              placeholder="Enter amount"
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Collateral Type */}
          <div>
            <label className="block mb-1 font-medium">Collateral Type</label>
            <input
              name="collateralType"
              type="text"
              placeholder="e.g. Household Items, Electronics"
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Collateral Items */}
          <div>
            <label className="block mb-1 font-medium">Collateral Item 1</label>
            <input
              name="collateral1"
              type="text"
              placeholder="Item name"
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Collateral Item 2</label>
            <input
              name="collateral2"
              type="text"
              placeholder="Item name"
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Collateral Item 3</label>
            <input
              name="collateral3"
              type="text"
              placeholder="Item name"
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
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
