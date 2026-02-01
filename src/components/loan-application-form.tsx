"use client";

import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

interface LoanApplicationModalProps {
  memberId: number;
  isOpen?: boolean;
  onClose?: () => void;
}

type Limits = {
  shortTermLimit: number;
  longTermLimit: number;
  EmergencyLimit: number;
};

type CollateralContact = {
  name: string;
  phoneNumber: string;
};

export function LoanApplicationModal({
  memberId,
  onClose,
  isOpen,
}: LoanApplicationModalProps) {
  if (!isOpen) return null;

  const [limits, setLimits] = useState<Limits | null>(null);
  const [loanType, setLoanType] =
    useState<"SHORT_TERM" | "LONG_TERM" | "EMERGENCY" | "">("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [collateralType, setCollateralType] = useState<string>("");
  const [activeLoans, setActiveLoans] = useState<string[]>([]);
  const [instalments, setInstalments] = useState<number>(0);

  // Collateral contacts state (3 slots)
  const [collaterals, setCollaterals] = useState<CollateralContact[]>([
    { name: "", phoneNumber: "" },
    { name: "", phoneNumber: "" },
    { name: "", phoneNumber: "" },
  ]);

  /* ---------------- Fetch limits ---------------- */
  useEffect(() => {
    if (!Number.isInteger(memberId)) return;
    const fetchLimits = async () => {
      const res = await fetch(`/api/loan-limit/${memberId}`);
      const data = await res.json();
      setLimits(data);
    };
    fetchLimits();
  }, [memberId]);

  /* ---------------- Fetch active loans ---------------- */
  useEffect(() => {
    if (!memberId) return;
    const fetchActiveLoans = async () => {
      const res = await fetch(`/api/Member/${memberId}/active-loans`);
      const data = await res.json();
      setActiveLoans(data.activeTypes || []);
      setInstalments(data.instalments || 0);
    };
    fetchActiveLoans();
  }, [memberId]);

  /* ---------------- Auto-select available loan type ---------------- */
  useEffect(() => {
    const allTypes: ("SHORT_TERM" | "LONG_TERM" | "EMERGENCY")[] = [
      "SHORT_TERM",
      "LONG_TERM",
      "EMERGENCY",
    ];
    const available = allTypes.filter((t) => !activeLoans.includes(t));
    setLoanType(available.length > 0 ? available[0] : "");
  }, [activeLoans]);

  const maxLimit =
    loanType === "SHORT_TERM"
      ? limits?.shortTermLimit
      : loanType === "EMERGENCY"
      ? limits?.EmergencyLimit
      : limits?.longTermLimit;

  /* ---------------- Revolving eligibility ---------------- */
  const canRevolve = (() => {
    if (!limits) return false;
    if (loanType === "LONG_TERM") {
      return instalments >= 0.3 * amount;
    }
    return loanType === "SHORT_TERM" || loanType === "EMERGENCY"
      ? amount - instalments <
          (loanType === "SHORT_TERM"
            ? limits?.shortTermLimit ?? 0
            : limits?.EmergencyLimit ?? 0)
      : false;
  })();

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!limits) return;

    if (maxLimit && amount > maxLimit) {
      toast({
        title: "Error",
        description: `Requested amount exceeds your limit of ${maxLimit}`,
        duration: 5000,
      });
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      memberId,
      collateralType,
     
      loanType,
      amount,
      duration: Number(formData.get("duration")),

      collaterals: collaterals.filter(
        (c) => c.name.trim() !== "" && c.phoneNumber.trim() !== ""
      ),
    };

    const res = await fetch("/api/LoanRequests/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      toast({
        title: "Error",
        description: err.message || "Loan request failed",
        duration: 5000,
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Success",
      description: canRevolve
        ? "Loan revolved successfully"
        : "Loan application submitted successfully",
      duration: 5000,
    });

    setLoading(false);
    onClose?.();
  };

  /* ---------------- Collateral input handler ---------------- */
  const handleCollateralChange = (
    index: number,
    field: keyof CollateralContact,
    value: string
  ) => {
    const updated = [...collaterals];
    updated[index][field] = value;
    setCollaterals(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {canRevolve ? "Revolve Loan" : "Apply for Loan"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 overflow-y-auto flex-1"
        >
          {/* Loan details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Loan Type</label>
              <select
                name="loanType"
                value={loanType}
                onChange={(e) =>
                  setLoanType(e.target.value as typeof loanType)
                }
                className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option
                  value="SHORT_TERM"
                  disabled={activeLoans.includes("SHORT_TERM")}
                >
                  Short Term
                </option>
                <option
                  value="LONG_TERM"
                  disabled={activeLoans.includes("LONG_TERM")}
                >
                  Long Term
                </option>
                <option
                  value="EMERGENCY"
                  disabled={activeLoans.includes("EMERGENCY")}
                >
                  Emergency
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                name="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              {limits && loanType && (
                <span
                  className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                    Number(amount) <=
                    (loanType === "SHORT_TERM"
                      ? limits.shortTermLimit
                      : loanType === "LONG_TERM"
                      ? limits.longTermLimit
                      : limits.EmergencyLimit)
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                  Max allowed:{" "}
                  {loanType === "SHORT_TERM"
                    ? limits.shortTermLimit
                    : loanType === "LONG_TERM"
                    ? limits.longTermLimit
                    : limits.EmergencyLimit}
                </span>
              )}
            </div>
          </div>

          {/* Collateral contacts */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Collateral Contacts
            </h3>
            <div>
              <label className="block text-sm font-medium mb-1">Collectral Type</label>
              <input
                name="collateralType"
                type="text"
                value={collateralType}
               onChange={(e) => setCollateralType(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              </div>

              <div>
              <label className="block text-sm font-medium mb-1">Loan Duration in months</label>
              <input
                name="duration"
                type="number"
                value={duration}
               onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              </div>
            {collaterals.map((c, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={`Contact ${i + 1} Name`}
                  value={c.name}
                  onChange={(e) =>
                    handleCollateralChange(i, "name", e.target.value)
                  }
                  className="w-full rounded-md border px-3 py-2"
                  required={i === 0}
                />
                <input
                  type="tel"
                  placeholder={`Contact ${i + 1} Phone`}
                  value={c.phoneNumber}
                  onChange={(e) =>
                    handleCollateralChange(i, "phoneNumber", e.target.value)
                  }
                  className="w-full rounded-md border px-3 py-2"
                  required={i === 0}
                />
              </div>
            ))}
          </div>

          {/* Actions */}
          {/* Actions */}
<div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
  <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50"
  >
    Cancel
  </button>

  <button
    type="submit"
    disabled={
      loading ||
      loanType === "" ||
      (activeLoans.includes(loanType) && !canRevolve)
    }
    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
  >
    {loading
      ? "Submitting..."
      : activeLoans.includes(loanType)
      ? canRevolve
        ? "Revolve Loan"
        : "Cannot Revolve"
      : "Submit Application"}
  </button>
</div>
        </form>
      </div>
    </div>
  );
}



                  
