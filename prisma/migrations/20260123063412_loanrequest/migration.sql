/*
  Warnings:

  - Added the required column `Loan_Duration` to the `loanrequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `MinInstament` to the `loanrequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collectral` to the `loanrequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collectralName1` to the `loanrequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collectralName2` to the `loanrequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collectralName3` to the `loanrequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "loanrequest" ADD COLUMN     "Loan_Duration" INTEGER NOT NULL,
ADD COLUMN     "MinInstament" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "collectral" TEXT NOT NULL,
ADD COLUMN     "collectralName1" TEXT NOT NULL,
ADD COLUMN     "collectralName2" TEXT NOT NULL,
ADD COLUMN     "collectralName3" TEXT NOT NULL;
