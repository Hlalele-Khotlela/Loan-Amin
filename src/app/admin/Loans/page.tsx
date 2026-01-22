"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentModal } from "@/components/loan-modal";
import LoanActions from "@/components/Loan-acts";
import { useAuth } from "@/hooks/useAuth";
import { Decimal } from "@prisma/client/runtime/client";
import { LOANTYPE } from "@prisma/client";

export default function LoansPage() {

  interface Loan {
  loan_id: number;
  member_Id: number;
  Principal: Decimal;
  intrests: Decimal;
  loan_type: LOANTYPE;
  totals_payeable: Decimal;
  balance: Decimal;
}

  const { user, loading: authLoading } = useAuth("Admin");

  const [loans, setLoans] = useState<Loan[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);


  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch loans
  useEffect(() => {
    async function fetchLoans() {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (selectedType !== "all") params.append("selectedType", selectedType);
      if (debouncedSearch.trim() !== "") params.append("search", debouncedSearch);

      const res = await fetch(`/api/loans?${params.toString()}`);
      const data = await res.json();

      const list = data.data ?? data.loan ?? (Array.isArray(data) ? data : []);
      setLoans(list);
      setTotalPages(Math.ceil((data.totalCount ?? list.length) / limit));

      setLoading(false);
    }

    fetchLoans();
  }, [page, selectedType, debouncedSearch]);

  if (authLoading) return <p>Loading...</p>;

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Loans</CardTitle>
            <CardDescription>See all loans and their details</CardDescription>
            <LoanActions />
          </CardHeader>

          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="text"
                placeholder="Search by member ID or loan ID..."
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
                <option value="SHORT_TERM">Short Term</option>
                <option value="LONG_TERM">Long Term</option>
                <option value="EMERGENCY">Emergency</option>
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
            </div>

            {/* Table */}
            {loading ? (
              <LoanSkeleton />
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Loan ID</th>
                      <th className="border px-4 py-2">Pass#</th>
                      <th className="border px-4 py-2">Amount</th>
                      <th className="border px-4 py-2">Interests</th>
                      <th className="border px-4 py-2">Loan Type</th>
                      <th className="border px-4 py-2">Total</th>
                      <th className="border px-4 py-2">Balance</th>
                      <th className="border px-4 py-2">Payment</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loans.map((loan) => (
                      <tr key={loan.loan_id} className="border-b">
                        <td className="px-4 py-2">
                          <Link href={`/admin/Loans/${loan.member_Id}/${loan.loan_id}/transactions`}>
                            {loan.loan_id}
                          </Link>
                        </td>

                        <td className="px-4 py-2">
                          <Link href={`/admin/Loans/${loan.member_Id}`}>
                            {loan.member_Id}
                          </Link>
                        </td>

                        <td className="px-4 py-2">{loan.Principal.toString()}</td>
                        <td className="px-4 py-2">{loan.intrests.toString()}</td>
                        <td className="px-4 py-2">{loan.loan_type.toString()}</td>
                        <td className="px-4 py-2">{loan.totals_payeable.toString()}</td>
                        <td className="px-4 py-2">{loan.balance.toString()}</td>

                        <td className="px-4 py-2">
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={() => {
                              setSelectedLoan(loan);
                              setIsModalOpen(true);
                            }}
                          >
                            Pay
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

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
            {isModalOpen && selectedLoan && (
              <PaymentModal
                isOpen={isModalOpen}
                loan={selectedLoan}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoanSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-6 bg-gray-300 rounded"></div>
      ))}
    </div>
  );
}
