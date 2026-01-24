"use client";

import { useState, useEffect } from "react";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/loans/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId,
          amount: Number(formData.get("amount")),
          type: formData.get("type"),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message || "Something went wrong");
        return;
      }

      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl 
                      max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Apply for Loan</h2>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

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
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
