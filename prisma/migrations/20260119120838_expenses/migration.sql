/*
  Warnings:

  - You are about to drop the `Shares` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shares" DROP CONSTRAINT "Shares_member_Id_fkey";

-- DropTable
DROP TABLE "Shares";

-- CreateTable
CREATE TABLE "ShareOnCapital" (
    "id" SERIAL NOT NULL,
    "member_Id" INTEGER NOT NULL,
    "Current_interest" DECIMAL(12,2) NOT NULL,
    "Accumu_interest" DECIMAL(12,2) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "ShareOnCapital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incomes" (
    "id" SERIAL NOT NULL,
    "Description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "Incomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expenses" (
    "id" SERIAL NOT NULL,
    "Description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShareOnCapital" ADD CONSTRAINT "ShareOnCapital_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;
