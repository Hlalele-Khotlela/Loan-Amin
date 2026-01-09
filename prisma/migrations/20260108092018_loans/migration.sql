/*
  Warnings:

  - You are about to drop the column `amount` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `totals` on the `Loan` table. All the data in the column will be lost.
  - Added the required column `Principal` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collectral` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collectralName1` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collectralName2` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collectralName3` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totals_payeable` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "amount",
DROP COLUMN "name",
DROP COLUMN "totals",
ADD COLUMN     "Principal" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "collectral" TEXT NOT NULL,
ADD COLUMN     "collectralName1" TEXT NOT NULL,
ADD COLUMN     "collectralName2" TEXT NOT NULL,
ADD COLUMN     "collectralName3" TEXT NOT NULL,
ADD COLUMN     "totals_payeable" DECIMAL(12,2) NOT NULL;
