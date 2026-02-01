/*
  Warnings:

  - Changed the type of `memberId` on the `LoanRequestComments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LoanRequestComments" DROP COLUMN "memberId",
ADD COLUMN     "memberId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "LoanRequestComments" ADD CONSTRAINT "LoanRequestComments_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("member_Id") ON DELETE RESTRICT ON UPDATE CASCADE;
