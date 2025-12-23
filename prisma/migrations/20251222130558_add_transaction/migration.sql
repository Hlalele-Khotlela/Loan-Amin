-- CreateTable
CREATE TABLE "LoanTransaction" (
    "id" SERIAL NOT NULL,
    "loan_id" INTEGER NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "new_balance" DECIMAL(65,30) NOT NULL,
    "interest" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "LoanTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoanTransaction" ADD CONSTRAINT "LoanTransaction_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "Loan"("loan_id") ON DELETE RESTRICT ON UPDATE CASCADE;
