"use client";

import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { checkRevolvingEligibility } from "@/lib/revolving";

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

  
  const [loanType, setLoanType] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const [activeLoans, setActiveLoans] = useState<string[]>([]);
  const [instalments, setInstalments] = useState<number>(0);
  const [collateralType, setCollateralType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [requestType, setRequestType] = useState("");
  const [existingLoan, setExistingLoan] = useState<any | null>(null);

  // Limits state
       const [limits, setLimits] = useState<{
      shortTermLimit: number;
      longTermLimit: number;
      EmergencyLimit: number;
    } | null>(null);
  

  // Collateral contacts state (3 slots)
  const [collaterals, setCollaterals] = useState<CollateralContact[]>([
    { name: "", phoneNumber: "" },
    { name: "", phoneNumber: "" },
    { name: "", phoneNumber: "" },
  ]);

  useEffect(() => {
    async function fetchExistingLoan() {
      if (!memberId || !loanType) return;
      const res = await fetch(`/api/Member/${memberId}/active-loans`);
      if (res.ok) {
        const data = await res.json();
        const match = data.find((loan: any) => loan.loan_type === loanType);
        setExistingLoan(match || null);
      }else{
        setExistingLoan(null);
      }
    }
    fetchExistingLoan();
  }, [memberId, loanType]);
  
   // true if loan exists
  const hasExistingLoanOfType =
    existingLoan && existingLoan.loan_type === loanType;
  
  
   
 
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

    const revolvingResult =
    existingLoan && limits
      ? checkRevolvingEligibility(
          {
            loan_type: existingLoan.loan_type,
            Principal: Number(existingLoan.Principal),
            instalments: Number(existingLoan.instalments),
            balance: Number(existingLoan.balance),
            status: existingLoan.status,
          },
          {
            shortTermLimit: limits.shortTermLimit,
            EmergencyLimit: limits.EmergencyLimit,
            longTermLimit: limits.longTermLimit,
          }
        )
      : { eligible: false, reason: "no existing loan" };

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

  type CollateralContact = {
  name: string;
  phoneNumber: string;
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
            {/* Loan Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Loan Type</label>
              <select
                className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                required
              >
                <option value="">-- Choose Loan Type --</option>
                <option value="EMERGENCY">Emergency</option>
                <option value="LONG_TERM">Long Term</option>
                <option value="SHORT_TERM">Short Term</option>
              </select>
            </div>

            {/* request type */}
            <div>
              <label className="block text-sm font-medium mb-1">Request Type</label>
              <select
                className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                required
              >
                
                <option value="">-- Choose Request Type --</option>
                <option value="new">New</option>
                <option value="revolve">Revolving</option>
              </select>
            </div>

            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-medium mb-1">Loan Amount</label>
              <input
                type="number"
                className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
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
              {requestType === "revolve" && existingLoan && (
                <div className="mt-2 space-y-2 text-sm">
                  {revolvingResult.eligible ? (
                    <span className="text-green-600">{revolvingResult.reason} (Max Revolving Amount: {revolvingResult.maxRevolvingAmount})</span>
                  ) : (
                    <span className="text-red-600">{revolvingResult.reason}</span>
                  )}

                </div>

              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Duration (months)
              </label>
              <input
                type="number"
                className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                required
              />
            </div>

             <div>
              <label className="block text-sm font-medium mb-1">
                Account Number
              </label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>

            {/* Collateral Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Collateral Type
              </label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={collateralType}
                onChange={(e) => setCollateralType(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Collateral contacts */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Collateral Contacts
            </h3>
            

            
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
    ( requestType === "new" && hasExistingLoanOfType) || (requestType === "revolve" && !revolvingResult.eligible )
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



                  
