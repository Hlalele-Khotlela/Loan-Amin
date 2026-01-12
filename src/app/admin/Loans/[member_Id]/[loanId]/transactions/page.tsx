
// src/app/admin/Loans/[member_Id]/[loanId]/transactions/page.tsx
import { prisma } from "@/lib/prisma/prisma";


import LoanClient from "./LoanClient";
export default async function LoanTransaction({
  params,
}: {
  params: Promise<{ member_Id: string; loanId: string }>;
}) {
  const {member_Id}= await params;
  const {loanId} = await params;
  const memberIdInt = parseInt(member_Id, 10);
  const loanIdInt = parseInt(loanId, 10);
  const loan= await prisma.loan.findUnique({    
    where:{
      loan_id:loanIdInt
    },
    include:{transactions: true}
  })

  if (isNaN(loanIdInt)) {
    return <p>Invalid loanId param</p>;
  }

  
  if (!loan) {
    return <p>Loan not found</p>;
  }

  // Local state for modal
// const loan = loans.find((l) => l.loan_id === loanIdInt); 
if (!loan) { return <p>Loan not found</p>; }

  function serializeLoan(loan: any) {
     return {
       ...loan, Principal: loan.Principal?.toString() ?? "0.00",
        instalments: loan.instalments?.toString() ?? "0.00",
         intrests: loan.intrests?.toString() ?? "0.00",
          totals_payeable: loan.totals_payeable?.toString() ?? "0.00",
           balance: loan.balance?.toString() ?? "0.00",
            MinInstament: loan.MinInstament?.toString() ?? "0.00",
             transactions: loan.transactions?.map((t: any) => ({
               ...t, amount: t.amount?.toString() ?? "0.00", new_balance: t.new_balance?.toString() ?? "0.00", })) ?? [], }; }


// const serializedLoans = loans.map(serializeLoan);

   return <LoanClient loans={serializeLoan((loan))} />;
    
}
