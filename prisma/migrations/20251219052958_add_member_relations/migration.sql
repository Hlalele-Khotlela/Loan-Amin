/*
  Warnings:

  - Changed the type of `loan_type` on the `loanrequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "member_Id" INTEGER;

-- AlterTable
ALTER TABLE "loanrequest" ADD COLUMN     "member_Id" INTEGER,
DROP COLUMN "loan_type",
ADD COLUMN     "loan_type" "LOANTYPE" NOT NULL;

-- AddForeignKey
ALTER TABLE "loanrequest" ADD CONSTRAINT "loanrequest_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;
