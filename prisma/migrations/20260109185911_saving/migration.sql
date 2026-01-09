-- AlterTable
ALTER TABLE "SavingsTransaction" ADD COLUMN     "member_Id" INTEGER;

-- AddForeignKey
ALTER TABLE "SavingsTransaction" ADD CONSTRAINT "SavingsTransaction_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE SET NULL ON UPDATE CASCADE;
