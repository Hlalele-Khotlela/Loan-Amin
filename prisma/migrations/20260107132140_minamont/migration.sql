-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SAVINGSTYPE" ADD VALUE 'PENSION';
ALTER TYPE "SAVINGSTYPE" ADD VALUE 'SECURITY';

-- AlterTable
ALTER TABLE "GroupSaving" ADD COLUMN     "min_amount" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Savings" ADD COLUMN     "min_amount" DECIMAL(12,2) NOT NULL DEFAULT 0;
