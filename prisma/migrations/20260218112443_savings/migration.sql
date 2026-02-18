-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'EDIT';

-- AlterTable
ALTER TABLE "SavingsTransaction" ALTER COLUMN "amount" DROP NOT NULL;
