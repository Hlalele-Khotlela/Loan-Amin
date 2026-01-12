-- DropForeignKey
ALTER TABLE "GroupDeposit" DROP CONSTRAINT "GroupDeposit_member_Id_fkey";

-- DropForeignKey
ALTER TABLE "GroupSavingsTransaction" DROP CONSTRAINT "GroupSavingsTransaction_member_Id_fkey";

-- DropForeignKey
ALTER TABLE "GroupWithdrawal" DROP CONSTRAINT "GroupWithdrawal_member_Id_fkey";

-- DropForeignKey
ALTER TABLE "LoanTransaction" DROP CONSTRAINT "LoanTransaction_member_Id_fkey";

-- DropForeignKey
ALTER TABLE "SavingsTransaction" DROP CONSTRAINT "SavingsTransaction_member_Id_fkey";

-- AddForeignKey
ALTER TABLE "LoanTransaction" ADD CONSTRAINT "LoanTransaction_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingsTransaction" ADD CONSTRAINT "SavingsTransaction_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupDeposit" ADD CONSTRAINT "GroupDeposit_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupWithdrawal" ADD CONSTRAINT "GroupWithdrawal_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupSavingsTransaction" ADD CONSTRAINT "GroupSavingsTransaction_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;
