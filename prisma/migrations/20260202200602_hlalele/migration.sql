/*
  Warnings:

  - You are about to drop the column `Accumu_interest` on the `MemberInterest` table. All the data in the column will be lost.
  - You are about to alter the column `netContribution` on the `MemberInterest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `interestShare` on the `MemberInterest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE "MemberInterest" DROP COLUMN "Accumu_interest",
ADD COLUMN     "AccumulatedInterest" DECIMAL(12,2) NOT NULL DEFAULT 0,
ALTER COLUMN "netContribution" SET DEFAULT 0,
ALTER COLUMN "netContribution" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "interestShare" SET DEFAULT 0,
ALTER COLUMN "interestShare" SET DATA TYPE DECIMAL(12,2);
