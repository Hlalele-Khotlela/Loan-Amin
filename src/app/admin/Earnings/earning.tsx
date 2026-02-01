"use client";
import { useEffect, useState } from "react";
 import ReportPage from "@/components/report";

export default function InterestDashboard() {
  const [combined, setCombined] = useState<any[]>([]);
  const [savings, setSavings] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [totals, setTotals] = useState<{ totalOwnerEarnings: number; ownerSavingsEarnings: number; ownerLoanEarnings: number; expenses:number; profits:number; } | null>(null);
  const [activeTab, setActiveTab] = useState<"combined" | "savings" | "groups">("combined");
  const [imoveableData, setImoveableData] = useState<any[]>([]);
  const [shares, setshares] = useState<any[]>([]);
 

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/Owner/Earnings");
      const json = await res.json();
      setCombined(json.totalMemberInterest ?? []);
      // setSavings(json.nonMoveableAssetByMember ?? []);
      setGroups(json.groupIntrest ?? []);
      setTotals({
        totalOwnerEarnings: json.totalEarnings,
        ownerSavingsEarnings: json.ownerSavingsEarnings,
        ownerLoanEarnings: json.ownerLoanEarnings,
        expenses:json.expenses,
        profits:json.profits,
      });
      setImoveableData(json.memberTotalImoveable ?? []);
      setshares(json.memberShares ?? []);
    }
    fetchData();
  }, []);

  const renderTable = () => {
    if (activeTab === "combined") {
      return (
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Member ID</th>
              <th className="px-4 py-2 border">Savings Interest</th>
              <th className="px-4 py-2 border">Loan Interest</th>
              <th className="px-4 py-2 border font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {combined.map((m) => (
              <tr key={m.member_Id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{m.member_Id}</td>
                <td className="px-4 py-2 border text-right">{m.savingsOwnerShare}</td>
                <td className="px-4 py-2 border text-right">{m.loanOwnerShare}</td>
                <td className="px-4 py-2 border text-right font-semibold">{m.totalOwnerShare}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeTab === "savings") {
      return (
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Member ID</th>
              <th className="px-4 py-2 border">Savings Interest (3 Types)</th>
            </tr>
          </thead>
          <tbody>
            {imoveableData.map((s) => (
              <tr key={s.member_Id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{s.member_Id}</td>
                <td className="px-4 py-2 border text-right">{s.TotalImoveable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeTab === "groups") {
      return (
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Group ID</th>
              <th className="px-4 py-2 border">Total Interest</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.group_id ?? "null"} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{g.group_id ?? "N/A"}</td>
                <td className="px-4 py-2 border text-right">{Number(g._sum.ownerShare).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* Summary Header */}
      {totals && (
        <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2"> BreakDowns</h2>
          <div className="flex gap-8">
            <div>
              <p className="text-gray-600">Total Incomes</p>
              <p className="text-lg font-semibold">{totals.totalOwnerEarnings}</p>
            </div>
            <div>
              <p className="text-gray-600">Savings Interests</p>
              <p className="text-lg font-semibold">{totals.ownerSavingsEarnings}</p>
            </div>
            <div>
              <p className="text-gray-600">Loan Interests</p>
              <p className="text-lg font-semibold">{totals.ownerLoanEarnings}</p>
            </div>

            <div>
              <p className="text-gray-600">Total Expenses</p>
              <p className="text-lg font-semibold">{totals.expenses}</p>
            </div>

            <div>
              <p className="text-gray-600">Suplus</p>
              <p className="text-lg font-semibold">{totals.profits}</p>
            </div>
          </div>
        </div>
      )}

      {/* Report Page Component */}
      <div className="mt-6 mb-6">
        <ReportPage />
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === "combined" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("combined")}
        >
          Combined
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "savings" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("savings")}
        >
          Savings Only
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "groups" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("groups")}
        >
          Groups
        </button>
      </div>

      {renderTable()}
    </div>
  );
}
