/*
  Warnings:

  - Added the required column `balance` to the `SavingsTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoanTransaction" ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "amount" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SavingsTransaction" ADD COLUMN     "balance" DECIMAL(12,2) NOT NULL;
