// src/app/admin/Loans/[member_Id]/[loanId]/transactions/LoanClient.tsx
"use client";

import { useState } from "react";
import { LoanModal } from "@/components/LoanEditDelModal";
import { LoanDetails } from "./LoanDetails";
import { usePermission } from "@/hooks/usePermission";

export default function LoanClient({ loans }: { loans: any }) {
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);
  const [mode, setMode] = useState<"edit" | "delete" | null>(null);
  const { canApproveLoans, canManageStaff, canViewSavings } = usePermission();

  async function handleConfirm(updatedLoan: any) {
    if (mode === "delete") {
      await fetch(`/api/loans/${updatedLoan.loan_id}/pay`, { method: "DELETE" });
    } else if (mode === "edit") {
      await fetch(`/api/loans/${updatedLoan.loan_id}/pay`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLoan),
        
      });
      
    }
    setSelectedLoan(null);
    setMode(null);
    // TODO: refresh state or re-fetch loans
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Details of Loan# {loans.loan_id}</h1>

      {loans.length === 0 ? (
        <p>No loans found.</p>
      ) : (
        
        <div className="space-y-4">
          
            <div className="space-x-2">
              {canApproveLoans && (
                <button
                  onClick={() => {
                    setSelectedLoan(loans);
                    setMode("edit");
                  }}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
              )}
              {canApproveLoans && (
                <button
                  onClick={() => {
                    setSelectedLoan(loans);
                    setMode("delete");
                  }}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              )}
              </div>
            <LoanDetails loan={loans}/>
          
            <div
              
              className="flex justify-between items-center bg-white p-4 rounded shadow"
            >
             
      
              
            </div>
          
        </div>
      )}

      {loans.transactions.length=== 0 ?(
        <p>No transactions for this Loans</p>
      ) :(
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Transaction</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Balance</th>
              
            </tr>
          </thead>
          <tbody>
            {loans.transactions.map((t:any) => (
              <tr key={t.id}>
                <td className="px-4 py-4 border">
                  {t.applied_at.toLocaleDateString()}
                </td>
                <td className="px-4 py-4 border">{t.type}</td>
                <td className="px-4 py-4 border">{t.amount.toString()}</td>
                <td className="px-4 py-4 border">{t.new_balance.toString()}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
        
            
        
      )}

      {/* Modal */}
      {selectedLoan && mode && (
        <LoanModal
          loan={selectedLoan}
          mode={mode}
          onClose={() => setSelectedLoan(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
