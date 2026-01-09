import {Loan, LoanTransaction } from "@prisma/client";

export interface MemberLoan extends Loan{
    transactions?: LoanTransaction[];
}