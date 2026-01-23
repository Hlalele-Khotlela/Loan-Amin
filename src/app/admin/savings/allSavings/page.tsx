"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import SavingsActions from "@/components/savins-acts";
import { SavingsTransactionModal } from "@/components/SavingTransactionModal";
import { usePermission } from "@/hooks/usePermission";

type Savings = {
  savings_id: number;
  member_Id: number;
  savings_type: string;
  amount: number;
  interest: number;
  started_at: string;
  total: number;
};

export default function SavingsTable() {
  const { canManageStaff, canApproveLoans, canViewReports } = usePermission();
  const [savings, setSavings] = useState<Savings[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedType, setSelectedType] = useState("all");

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [selectedSavingsId, setSelectedSavingsId] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<"DEPOSIT" | "WITHDRAWAL" | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch savings
  useEffect(() => {
    async function fetchSavings() {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (selectedType !== "all") params.append("selectedType", selectedType);
      if (debouncedSearch.trim() !== "") params.append("search", debouncedSearch);

      const res = await fetch(`/api/Savings/allSavings?${params.toString()}`);
      const data = await res.json();

      const list = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

      setSavings(list);
      setTotalPages(Math.ceil((data.totalCount ?? list.length) / limit));
      setLoading(false);
    }

    fetchSavings();
  }, [page, selectedType, debouncedSearch]);

  // CSV Export
  const exportCSV = () => {
    const headers = ["Savings ID,Member ID,Type,Amount,Interest,Total,Started At"];
    const rows = savings.map((s) =>
      [
        s.savings_id,
        s.member_Id,
        s.savings_type,
        s.amount,
        s.interest,
        s.total,
        new Date(s.started_at).toLocaleDateString(),
      ].join(",")
    );

    const csvContent = [...headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "savings.csv";
    link.click();
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedSavingsId(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Savings Accounts</h2>

      {canApproveLoans &&<SavingsActions />}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-4">
        <input
          type="text"
          placeholder="Search by member or savings ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/4"
        >
          <option value="all">All Types</option>
          <option value="SPECIAL">Special</option>
          <option value="SECURITY">Security</option>
          <option value="COMPULSARY">Compulsory</option>
          <option value="Emergency">Voluntary</option>
          <option value="PENSION">Pension</option>
        </select>

        <button
          onClick={() => {
            setSelectedType("all");
            setSearchTerm("");
          }}
          className="border px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Reset
        </button>

        <button
          onClick={exportCSV}
          className="border px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Savings ID</th>
              <th className="px-4 py-2 border">Member</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Interest</th>
              <th className="px-4 py-2 border">Total</th>
              <th className="px-4 py-2 border">Started At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-6">
                  <SavingsSkeleton />
                </td>
              </tr>
            ) : savings.length > 0 ? (
              savings.map((s) => (
                <tr key={s.savings_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    <Link href={`/admin/savings/allSavings/${s.member_Id}/${s.savings_id}`}>
                      {s.savings_id}
                    </Link>
                  </td>

                  <td className="px-4 py-2 border">
                    <Link href={`/admin/savings/allSavings/${s.member_Id}`}>
                      {s.member_Id}
                    </Link>
                  </td>

                  <td className="px-4 py-2 border">{s.savings_type}</td>
                  <td className="px-4 py-2 border">{s.amount}</td>
                  <td className="px-4 py-2 border">{s.interest}</td>
                  <td className="px-4 py-2 border">{s.total}</td>

                  <td className="px-4 py-2 border">
                    {new Date(s.started_at).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-2 border">
                    {canApproveLoans && (
                    <button
                      onClick={() => {
                        setSelectedSavingsId(s.savings_id);
                        setModalMode("DEPOSIT");
                      }}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Deposit
                    </button>
                    )}

                    {canApproveLoans && (
                    <button
                      onClick={() => {
                        setSelectedSavingsId(s.savings_id);
                        setModalMode("WITHDRAWAL");
                      }}
                      className="text-green-600 hover:underline"
                    >
                      Withdraw
                    </button>
                    )}
                    
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center px-4 py-6 text-gray-500 italic">
                  No savings accounts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {modalMode && selectedSavingsId !== null && (
        <SavingsTransactionModal
          isOpen={true}
          savingsId={selectedSavingsId}
          mode={modalMode}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

/* Skeleton Loader */
function SavingsSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-6 bg-gray-300 rounded"></div>
      ))}
    </div>
  );
}
