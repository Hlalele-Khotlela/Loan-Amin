/*
  Warnings:

  - The values [Admin] on the enum `MemberRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MemberRole_new" AS ENUM ('Audit', 'User', 'CreditMember');
ALTER TABLE "public"."Member" ALTER COLUMN "Role" DROP DEFAULT;
ALTER TABLE "Member" ALTER COLUMN "Role" TYPE "MemberRole_new" USING ("Role"::text::"MemberRole_new");
ALTER TYPE "MemberRole" RENAME TO "MemberRole_old";
ALTER TYPE "MemberRole_new" RENAME TO "MemberRole";
DROP TYPE "public"."MemberRole_old";
ALTER TABLE "Member" ALTER COLUMN "Role" SET DEFAULT 'User';
COMMIT;
