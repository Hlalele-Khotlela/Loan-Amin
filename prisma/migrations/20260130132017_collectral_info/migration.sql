/*
  Warnings:

  - You are about to drop the column `collectral` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `collectralName1` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `collectralName2` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `collectralName3` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `collectral` on the `loanrequest` table. All the data in the column will be lost.
  - You are about to drop the column `collectralName1` on the `loanrequest` table. All the data in the column will be lost.
  - You are about to drop the column `collectralName2` on the `loanrequest` table. All the data in the column will be lost.
  - You are about to drop the column `collectralName3` on the `loanrequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "collectral",
DROP COLUMN "collectralName1",
DROP COLUMN "collectralName2",
DROP COLUMN "collectralName3";

-- AlterTable
ALTER TABLE "loanrequest" DROP COLUMN "collectral",
DROP COLUMN "collectralName1",
DROP COLUMN "collectralName2",
DROP COLUMN "collectralName3";

-- CreateTable
CREATE TABLE "LoanColletralInfo" (
    "loan_id" INTEGER,
    "request_id" INTEGER,
    "Type" TEXT NOT NULL,
    "name1" TEXT NOT NULL,
    "name2" TEXT NOT NULL,
    "name3" TEXT NOT NULL,
    "phone1" TEXT NOT NULL,
    "phone2" TEXT NOT NULL,
    "phone3" TEXT NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "LoanColletralInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoanColletralInfo" ADD CONSTRAINT "LoanColletralInfo_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "Loan"("loan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanColletralInfo" ADD CONSTRAINT "LoanColletralInfo_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "loanrequest"("request_id") ON DELETE SET NULL ON UPDATE CASCADE;
