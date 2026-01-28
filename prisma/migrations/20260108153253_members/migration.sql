/*
  Warnings:

  - You are about to drop the column `interest` on the `LoanTransaction` table. All the data in the column will be lost.
  - You are about to alter the column `new_balance` on the `LoanTransaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - Added the required column `type` to the `LoanTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LoanTransactionType" AS ENUM ('issued', 'repayment', 'interest', 'statusChange');

-- AlterTable
ALTER TABLE "LoanTransaction" DROP COLUMN "interest",
ADD COLUMN     "amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "member_Id" INTEGER,
ADD COLUMN     "type" "LoanTransactionType" NOT NULL,
ALTER COLUMN "new_balance" SET DEFAULT 0,
ALTER COLUMN "new_balance" SET DATA TYPE DECIMAL(12,2);

-- AddForeignKey
ALTER TABLE "LoanTransaction" ADD CONSTRAINT "LoanTransaction_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE SET NULL ON UPDATE CASCADE;
