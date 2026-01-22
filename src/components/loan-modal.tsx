import { Prisma } from "@prisma/client";
import { useState } from "react";
import type { Loan } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/client";

 interface LoanModalProps {
  loan: {
    loan_id: number| null;
    member_Id: number|null;
    Principal: Decimal |null;
    balance: Decimal | null;
    totals_payeable: Decimal| null;
    
    loan_type: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentModal({ isOpen, loan, onClose }: LoanModalProps) {
    const [paymentAmount, setPaymentAmount] = useState("");
    const [loans, setloans]= useState<Loan[]>([]);

  if (!isOpen || !loan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Make Payment</h2>
        <p><strong>Loan ID:</strong> {loan.loan_id}</p>
        <p><strong>Name:</strong> {loan.member_Id}</p>
        <p><strong>Loan Type:</strong> {loan.loan_type}</p>
        <p><strong>Balance:</strong> {loan.balance?.toString() ?? 0}</p>

        {/* Example payment form */}
        <input
          type="number"
          value={paymentAmount}
          onChange={(e)=> setPaymentAmount(e.target.value)}
          placeholder="Enter payment amount"
          className="border border-gray-300 rounded px-2 py-1 w-full mt-3"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              const amount= Number(paymentAmount);

              // prevent overpayment
              if(amount<= 0){
                alert("payment must be greater than 0");
                return;
              }
              if (amount > Number(loan.balance)){
                  alert("amount cannot be greater than current balance");
                  return;
              }
              // TODO: call API to process payment
              try{
                setloans((prevLoans) =>
                prevLoans.map((l)=>
                l.loan_id=== loan.loan_id?
                {
                  ...l,
                  // balance: l.balance.sub(paymentAmount),
                  instalments: l.instalments.add(paymentAmount),
                  balance: l.balance.sub(amount),
                }
                :l
                )
                );
                const res = await fetch(`/api/loans/${loan.loan_id}/pay`, {
                    method: "PATCH",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({paymentAmount: Number(paymentAmount)}),
                });
                
                if(!res.ok) throw new Error("Payment failed");
                const updatedLoan = await res.json();
                setloans((prevLoans)=>
                prevLoans.map((l)=>
                l.loan_id===updatedLoan.loan_id ? updatedLoan:l)
                );

              }catch (err){
                console.error(err);
                alert("Payment fail");

              }
              onClose();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>


    </div>
    
  );
}

