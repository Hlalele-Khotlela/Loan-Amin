/*
  Warnings:

  - Added the required column `Loan_Duration` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "Loan_Duration" INTEGER NOT NULL;
