// src/app/admin/Loans/[member_Id]/[loanId]/transactions/LoanDetails.tsx
import type { Loan, LoanTransaction } from "@prisma/client";

interface LoanDetailsProps {
  loan: Loan & { transactions?: LoanTransaction[] };
}

export function LoanDetails({ loan }: LoanDetailsProps) {
  return (
    <div className="border rounded-lg shadow-md p-6 bg-white mb-6">
      <h2 className="text-xl font-bold mb-4">Loan Details</h2>
      <div className="space-y-2">
        <p><strong>Loan ID:</strong> {loan.loan_id}</p>
        <p><strong>Member ID:</strong> {loan.member_Id}</p>
        <p><strong>Status:</strong> {loan.status}</p>
        <p><strong>Loan Type:</strong> {loan.loan_type}</p>
        <p><strong>Principal:</strong> {loan.Principal.toString()}</p>
        
        <p><strong>Expected Duration:</strong> {loan.Loan_Duration} months</p>
        <p><strong>Total Payable:</strong> {loan.totals_payeable.toString()}</p>
        <p><strong>Amount Paid:</strong> {loan.instalments.toString()}</p>
        <p><strong>Balance:</strong> {loan.balance.toString()}</p>
        <p><strong>Created At:</strong> {new Date(loan.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
