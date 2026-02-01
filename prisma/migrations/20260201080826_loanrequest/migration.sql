-- CreateEnum
CREATE TYPE "LoanApllication" AS ENUM ('revolve', 'new');

-- AlterTable
ALTER TABLE "loanrequest" ADD COLUMN     "accountNumber" TEXT NOT NULL DEFAULT '56565656',
ADD COLUMN     "type" "LoanApllication" NOT NULL DEFAULT 'new';
