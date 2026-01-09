-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('active', 'completed');

-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "status" "LoanStatus" NOT NULL DEFAULT 'active';
