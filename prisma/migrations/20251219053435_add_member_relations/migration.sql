/*
  Warnings:

  - Made the column `member_Id` on table `Loan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `member_Id` on table `loanrequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Loan" ALTER COLUMN "member_Id" SET NOT NULL;

-- AlterTable
ALTER TABLE "loanrequest" ALTER COLUMN "member_Id" SET NOT NULL;
