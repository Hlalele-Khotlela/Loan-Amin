/*
  Warnings:

  - Made the column `amount` on table `loanrequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "loanrequest" ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);
