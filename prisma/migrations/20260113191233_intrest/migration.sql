/*
  Warnings:

  - Added the required column `Description` to the `OwnerTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OwnerTransaction" ADD COLUMN     "Description" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "OwnerTransaction" ADD CONSTRAINT "OwnerTransaction_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;
