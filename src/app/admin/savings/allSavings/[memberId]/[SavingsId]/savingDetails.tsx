// For All Details of Savings
import type { Savings, SavingsTransaction } from "@prisma/client";

interface SavingsDetailsProps {
  savings: Savings & { transactions?: SavingsTransaction[] };
}

export function SavingsDetails({ savings }: SavingsDetailsProps) {
  return (
    <div className="border rounded-lg shadow-md p-6 bg-white mb-6">
      <h2 className="text-xl font-bold mb-4">Savings Details</h2>
      <div className="space-y-2">
        <p><strong>Savings ID:</strong> {savings.savings_id}</p>
        <p><strong>Member ID:</strong> {savings.member_Id}</p>
        <p><strong>Savings Type:</strong> {savings.savings_type}</p>
        <p><strong>Total Amount:</strong> {savings.amount.toString()}</p>
        <p><strong>Total Interest:</strong> {savings.interest.toString()}</p>
        <p><strong>Accoumulated Amount:</strong> {savings.total.toString()}</p>
        
        <p><strong>Created At:</strong> {new Date(savings.started_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
