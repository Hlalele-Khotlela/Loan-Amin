/*
  Warnings:

  - A unique constraint covering the columns `[request_id]` on the table `Loan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `request_id` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "request_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Loan_request_id_key" ON "Loan"("request_id");
