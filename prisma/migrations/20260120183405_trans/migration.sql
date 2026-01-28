/*
  Warnings:

  - You are about to drop the column `deposit` on the `EmegencyFundTransactions` table. All the data in the column will be lost.
  - You are about to drop the column `withdrawals` on the `EmegencyFundTransactions` table. All the data in the column will be lost.
  - Added the required column `type` to the `EmegencyFundTransactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmegencyFundTransactionsType" AS ENUM ('deposit', 'withdraw');

-- AlterTable
ALTER TABLE "EmegencyFundTransactions" DROP COLUMN "deposit",
DROP COLUMN "withdrawals",
ADD COLUMN     "type" "EmegencyFundTransactionsType" NOT NULL;
