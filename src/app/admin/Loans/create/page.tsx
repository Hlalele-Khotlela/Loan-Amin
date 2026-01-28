"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function CreateLoanPage() {
  const router = useRouter();

  const [members, setMembers] = useState<any[]>([]);
  const [memberId, setMemberId] = useState("");
  const [loanType, setLoanType] = useState("");
  const [amount, setAmount] = useState("");
  const [Duration, setDuration] = useState("");
  const [Collectral, setCollectral]= useState("");
  const [CollectralName1, setCollectralName1]= useState("");
  const [CollectralName2, setCollectralName2]= useState("");
  const [CollectralName3, setCollectralName3]= useState("");

  const [intrests, setIntrests] = useState("");

  useEffect(() => {
    async function fetchMembers() {
      const res = await fetch("/api/Member");
      const data = await res.json();
      setMembers(data);
    }
    fetchMembers();
  }, []);

  const selectedMember = members.find((m) => m.member_Id.toString() === memberId);
  const memberName = selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : "";

  const totals =
    amount && intrests
      ? Number(amount) + Number(intrests)
      : 0;

  async function handleSubmit(e: any) {
    e.preventDefault();

    await fetch("/api/loans/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        member_Id: Number(memberId),
        Collectral,
        CollectralName1,
        CollectralName2,
        CollectralName3,
        Duration,
        // name: memberName,
        loan_type: loanType,
        amount: Number(amount),
        // instalments: Number(instalments),
        // intrests: Number(intrests),
        // totals,
        // balance: totals,
      }),
    });

    toast({
      title: "Loan Created",
      description: "The loan has been successfully created.",
      duration: 5000,
    });

     router.push("/admin/Loans");
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Loan</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Member Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Member
          </label>
          <select
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            required
          >
            <option value="">-- Choose Member --</option>
            {members.map((m) => (
              <option key={m.member_Id} value={m.member_Id}>
                {m.member_Id} 
              </option>
            ))}
          </select>
        </div>

        {/* Loan Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Type
          </label>
          <select
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
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

        {/* Member Name Preview */}
        {memberName && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
            Loan will be recorded under: <strong>{memberName}</strong>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Amount
          </label>
          <input
            type="number"
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            placeholder="Enter loan amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* Loan Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration in month
          </label>
          <input
            type="number"
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            placeholder="How long are you going to pay"
            value={Duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        {/* Collectral */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Collectral
          </label>
          <input
            type="text"
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            placeholder="what is your Collectral"
            value={Collectral}
            onChange={(e) => setCollectral(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Collectral Name 1
          </label>
          <input
            type="text"
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            placeholder="your Collectral"
            value={CollectralName1}
            onChange={(e) => setCollectralName1(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Collectral Name 2
          </label>
          <input
            type="text"
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            placeholder="your Collectral"
            value={CollectralName2}
            onChange={(e) => setCollectralName2(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Collectral Name 3
          </label>
          <input
            type="text"
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            placeholder="your Collectral"
            value={CollectralName3}
            onChange={(e) => setCollectralName3(e.target.value)}
            required
          />
        </div>

        



        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition"
        >
          Create Loan
        </button>
      </form>
    </div>
  );
}
