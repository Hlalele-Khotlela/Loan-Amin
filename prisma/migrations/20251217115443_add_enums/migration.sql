-- CreateEnum
CREATE TYPE "LOANTYPE" AS ENUM ('EMERGENCY', 'SHORT_TERM', 'LONG_TERM');

-- CreateTable
CREATE TABLE "Loan" (
    "name" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "instalments" DECIMAL(12,2) NOT NULL,
    "intrests" DECIMAL(12,2) NOT NULL,
    "loan_type" "LOANTYPE" NOT NULL,
    "totals" DECIMAL(12,2) NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL,
    "loan_id" SERIAL NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("loan_id")
);
