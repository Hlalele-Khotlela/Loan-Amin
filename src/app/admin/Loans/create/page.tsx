"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { checkRevolvingEligibility } from "@/lib/revolving";


type CollateralContact = {
  name: string;
  phoneNumber: string;
};

export default function CreateLoanPage() {
  const router = useRouter();

  const [members, setMembers] = useState<any[]>([]);
  const [member_Id, setMemberId] = useState("");

  const [loanType, setLoanType] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [collateralType, setCollateralType] = useState("");
   const [accountNumber, setAccountNumber] = useState("");
    const [requestType, setRequestType] = useState("");
    const [existingLoan, setExistingLoan] = useState<any | null>(null);


   
useEffect(() => {
  async function fetchExistingLoan() {
    if (!member_Id || !loanType) return;
    const res = await fetch(`/api/Member/${member_Id}/active-loans/?type=${loanType}`);
    if (res.ok) {
      const data = await res.json();
      setExistingLoan(data[0] || null);
    }else{
      setExistingLoan(null);
    }
  }
  fetchExistingLoan();
}, [member_Id, loanType]);

 // true if loan exists
const hasExistingLoanOfType =
  existingLoan && existingLoan.loan_type === loanType;


  const [limits, setLimits] = useState<{
    shortTermLimit: number;
    longTermLimit: number;
    EmergencyLimit: number;
  } | null>(null);

  const [collaterals, setCollaterals] = useState<CollateralContact[]>([
    { name: "", phoneNumber: "" },
    { name: "", phoneNumber: "" },
    { name: "", phoneNumber: "" },
  ]);

  useEffect(() => {
    const fetchMembers = async () => {
      const res = await fetch("/api/Member");
      const data = await res.json();
      setMembers(data);
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    async function fetchLimits() {
      if (!member_Id) return;
      const res = await fetch(`/api/loan-limit/${member_Id}`);
      const data = await res.json();
      setLimits(data);
    }
    fetchLimits();
  }, [member_Id]);

  const selectedMember = members.find(
    (m) => m.member_Id.toString() === member_Id
  );

  const memberName = selectedMember
    ? `${selectedMember.firstName} ${selectedMember.lastName}`
    : "";

  function handleCollateralChange(
    index: number,
    field: keyof CollateralContact,
    value: string
  ) {
    setCollaterals((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  }
  console.log("existingLoan Principal:", existingLoan?.Principal);
  console.log("existingLoan:", existingLoan);
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
          emergencyLimit: limits.EmergencyLimit,
        }
      )
    : { eligible: false, reason: "no existing loan" };


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();


    try {
      if (limits) {
        let maxLimit =
          loanType === "SHORT_TERM"
            ? limits.shortTermLimit
            : loanType === "LONG_TERM"
            ? limits.longTermLimit
            : limits.EmergencyLimit;

        if (Number(amount) > maxLimit) {
          toast({
            title: "Failed",
            description: `Requested amount exceeds your limit of ${maxLimit}`,
            duration: 5000,
          });
          return;
        }
      }

      const payload = {
        memberId: Number(member_Id),
        loanType,
        accountNumber,
        requestType,
        amount: Number(amount),
        duration: Number(duration),
        collateralType,
        collaterals: collaterals.filter(
          (c) => c.name.trim() !== "" && c.phoneNumber.trim() !== ""
        ),
      };

      const res = await fetch("/api/LoanRequests/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        toast({ title: "Error", description: err.error, duration: 5000 });
        return;
      }

      toast({
        title: "Loan Created",
        description: "Successfully submitted.",
        duration: 5000,
      });
      router.push("/admin/Loans");
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Could not submit loan.",
        duration: 5000,
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl bg-white rounded-xl shadow-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h1 className="text-xl font-semibold text-gray-800">Apply for Loan</h1>
          <p className="text-sm text-gray-500">
            Fill in the details below to create a loan
          </p>
        </div>

        {/* Scrollable form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Member selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Select Member</label>
            <select
              className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={member_Id}
              onChange={(e) => setMemberId(e.target.value)}
              required
            >
              <option value="">-- Choose Member --</option>
              {members.map((m) => (
                <option key={m.member_Id} value={m.member_Id}>
                  {m.member_Id} — {m.firstName} {m.lastName}
                </option>
              ))}
            </select>
          </div>

          {memberName && (
            <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700">
              Loan will be recorded under <strong>{memberName}</strong>
            </div>
          )}

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
                onChange={(e) => setAmount(e.target.value)}
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
                    <span className="text-green-600">Eligible for revolving loan up to {revolvingResult.maxRevolvingAmount}</span>
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
                onChange={(e) => setDuration(e.target.value)}
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



{/* Submit */}
<div className="pt-4">
  <button
    type="submit"
    disabled={( requestType === "new" && hasExistingLoanOfType) || (requestType === "revolve" && !revolvingResult.eligible )}
    className="w-full rounded-md bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
  >

    Apply for Loan
  </button>
  {requestType === "new" && hasExistingLoanOfType && (
  <p className="mt-2 text-sm text-red-600">
    You already have an active {loanType} loan. Please use the revolve option instead of submitting a new loan.
  </p>
)}

</div>
        </form>
      </div>
    </div>
  );
}

