/*
  Warnings:

  - You are about to drop the column `Description` on the `Expenses` table. All the data in the column will be lost.
  - You are about to drop the column `Description` on the `Incomes` table. All the data in the column will be lost.
  - Added the required column `type` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Incomes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IncomesType" AS ENUM ('Penalty', 'others', 'LoanInterest', 'BankChargeContribution', 'BadDebtsRecovered', 'stokvel');

-- CreateEnum
CREATE TYPE "ExpensesType" AS ENUM ('stationery', 'sittingAllowence', 'Electricity', 'Repairs', 'Wages', 'Refreshments', 'others', 'BankCharge');

-- AlterTable
ALTER TABLE "EmegencyFund" ADD COLUMN     "memberId" INTEGER;

-- AlterTable
ALTER TABLE "EmegencyFundTransactions" ADD COLUMN     "memberId" INTEGER;

-- AlterTable
ALTER TABLE "Expenses" DROP COLUMN "Description",
ADD COLUMN     "type" "ExpensesType" NOT NULL;

-- AlterTable
ALTER TABLE "Incomes" DROP COLUMN "Description",
ADD COLUMN     "type" "IncomesType" NOT NULL;

-- AlterTable
ALTER TABLE "RaffleTransactions" ADD COLUMN     "memberId" INTEGER;

-- AlterTable
ALTER TABLE "Raffles" ADD COLUMN     "memberId" INTEGER;

-- AddForeignKey
ALTER TABLE "EmegencyFund" ADD CONSTRAINT "EmegencyFund_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Raffles" ADD CONSTRAINT "Raffles_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;
