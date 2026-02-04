/*
  Warnings:

  - Added the required column `Descreption` to the `Raffles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Raffles" ADD COLUMN     "Descreption" TEXT NOT NULL;
