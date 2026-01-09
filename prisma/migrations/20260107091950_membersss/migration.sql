-- AlterTable
ALTER TABLE "GroupSavingsTransaction" ADD COLUMN     "member_Id" INTEGER;

-- AddForeignKey
ALTER TABLE "GroupSavingsTransaction" ADD CONSTRAINT "GroupSavingsTransaction_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE SET NULL ON UPDATE CASCADE;
