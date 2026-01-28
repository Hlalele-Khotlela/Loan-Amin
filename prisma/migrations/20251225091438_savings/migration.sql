-- CreateEnum
CREATE TYPE "SAVINGSTYPE" AS ENUM ('VOLUNTARY', 'COMPULSARY', 'SPEACIAL');

-- CreateTable
CREATE TABLE "Savings" (
    "amount" DECIMAL(12,2) NOT NULL,
    "interest" DECIMAL(12,2) NOT NULL,
    "savings_id" SERIAL NOT NULL,
    "savings_type" "SAVINGSTYPE" NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "member_Id" INTEGER NOT NULL,

    CONSTRAINT "Savings_pkey" PRIMARY KEY ("savings_id")
);

-- AddForeignKey
ALTER TABLE "Savings" ADD CONSTRAINT "Savings_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;
