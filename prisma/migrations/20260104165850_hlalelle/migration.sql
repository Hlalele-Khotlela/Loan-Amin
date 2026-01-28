/*
  Warnings:

  - You are about to alter the column `amount` on the `GroupDeposit` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `amount` on the `SavingsTransaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE "GroupDeposit" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "SavingsTransaction" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);
