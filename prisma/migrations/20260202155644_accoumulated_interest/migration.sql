/*
  Warnings:

  - You are about to drop the column `interestRate` on the `MemberInterest` table. All the data in the column will be lost.
  - Added the required column `Accumu_interest` to the `MemberInterest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MemberInterest" DROP COLUMN "interestRate",
ADD COLUMN     "Accumu_interest" DECIMAL(65,30) NOT NULL;
