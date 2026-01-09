/*
  Warnings:

  - The values [SPEACIAL] on the enum `SAVINGSTYPE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SAVINGSTYPE_new" AS ENUM ('VOLUNTARY', 'COMPULSARY', 'SPECIAL', 'PENSION', 'SECURITY');
ALTER TABLE "Savings" ALTER COLUMN "savings_type" TYPE "SAVINGSTYPE_new" USING ("savings_type"::text::"SAVINGSTYPE_new");
ALTER TYPE "SAVINGSTYPE" RENAME TO "SAVINGSTYPE_old";
ALTER TYPE "SAVINGSTYPE_new" RENAME TO "SAVINGSTYPE";
DROP TYPE "public"."SAVINGSTYPE_old";
COMMIT;
