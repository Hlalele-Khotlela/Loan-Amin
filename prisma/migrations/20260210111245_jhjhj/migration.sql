/*
  Warnings:

  - The values [withdrawal] on the enum `EmegencyFundTransactionsType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EmegencyFundTransactionsType_new" AS ENUM ('deposit', 'withdrawals');
ALTER TABLE "EmegencyFundTransactions" ALTER COLUMN "type" TYPE "EmegencyFundTransactionsType_new" USING ("type"::text::"EmegencyFundTransactionsType_new");
ALTER TYPE "EmegencyFundTransactionsType" RENAME TO "EmegencyFundTransactionsType_old";
ALTER TYPE "EmegencyFundTransactionsType_new" RENAME TO "EmegencyFundTransactionsType";
DROP TYPE "public"."EmegencyFundTransactionsType_old";
COMMIT;
