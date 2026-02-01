/*
  Warnings:

  - The `status` column on the `loanrequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "loanrequestStatus" AS ENUM ('approved', 'rejected', 'Pending');

-- AlterTable
ALTER TABLE "loanrequest" DROP COLUMN "status",
ADD COLUMN     "status" "loanrequestStatus" NOT NULL DEFAULT 'Pending';
