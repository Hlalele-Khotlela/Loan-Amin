-- CreateEnum
CREATE TYPE "SavingStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "Savings" ADD COLUMN     "status" "SavingStatus" NOT NULL DEFAULT 'active';
