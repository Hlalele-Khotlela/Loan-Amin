/*
  Warnings:

  - You are about to drop the column `name1` on the `LoanColletralInfo` table. All the data in the column will be lost.
  - You are about to drop the column `name2` on the `LoanColletralInfo` table. All the data in the column will be lost.
  - You are about to drop the column `name3` on the `LoanColletralInfo` table. All the data in the column will be lost.
  - You are about to drop the column `phone1` on the `LoanColletralInfo` table. All the data in the column will be lost.
  - You are about to drop the column `phone2` on the `LoanColletralInfo` table. All the data in the column will be lost.
  - You are about to drop the column `phone3` on the `LoanColletralInfo` table. All the data in the column will be lost.
  - Added the required column `name` to the `LoanColletralInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `LoanColletralInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoanColletralInfo" DROP COLUMN "name1",
DROP COLUMN "name2",
DROP COLUMN "name3",
DROP COLUMN "phone1",
DROP COLUMN "phone2",
DROP COLUMN "phone3",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;
