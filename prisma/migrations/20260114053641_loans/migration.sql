/*
  Warnings:

  - Added the required column `savings_type` to the `Interest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interest" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "savings_type" "SAVINGSTYPE" NOT NULL;

-- CreateTable
CREATE TABLE "LoanIntestTransaction" (
    "id" SERIAL NOT NULL,
    "loan_id" INTEGER NOT NULL,
    "member_Id" INTEGER,
    "amount" DECIMAL(12,2) NOT NULL,
    "type" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoanIntestTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanInterest" (
    "id" SERIAL NOT NULL,
    "member_Id" INTEGER NOT NULL,
    "loan_type" "LOANTYPE" NOT NULL,
    "loan_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerShare" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "LoanInterest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoanIntestTransaction" ADD CONSTRAINT "LoanIntestTransaction_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "Loan"("loan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanIntestTransaction" ADD CONSTRAINT "LoanIntestTransaction_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanInterest" ADD CONSTRAINT "LoanInterest_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "Loan"("loan_id") ON DELETE SET NULL ON UPDATE CASCADE;
