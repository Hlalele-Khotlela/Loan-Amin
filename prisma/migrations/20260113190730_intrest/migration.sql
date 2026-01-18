-- DropForeignKey
ALTER TABLE "Interest" DROP CONSTRAINT "Interest_savings_id_fkey";

-- AlterTable
ALTER TABLE "Interest" ALTER COLUMN "group_id" DROP NOT NULL,
ALTER COLUMN "savings_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_savings_id_fkey" FOREIGN KEY ("savings_id") REFERENCES "Savings"("savings_id") ON DELETE SET NULL ON UPDATE CASCADE;
