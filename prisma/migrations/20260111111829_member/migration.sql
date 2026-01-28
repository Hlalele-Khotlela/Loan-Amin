-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('Admin', 'User', 'CreditMember');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "JoinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Role" "MemberRole" NOT NULL DEFAULT 'User',
ADD COLUMN     "Status" "MemberStatus" NOT NULL DEFAULT 'active';
