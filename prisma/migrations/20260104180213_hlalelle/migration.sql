-- AlterTable
ALTER TABLE "GroupSaving" ADD COLUMN     "current_total" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "GroupWithdrawal" (
    "withdrawal_id" SERIAL NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "member_Id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupWithdrawal_pkey" PRIMARY KEY ("withdrawal_id")
);

-- AddForeignKey
ALTER TABLE "GroupWithdrawal" ADD CONSTRAINT "GroupWithdrawal_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupWithdrawal" ADD CONSTRAINT "GroupWithdrawal_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "GroupSaving"("group_id") ON DELETE RESTRICT ON UPDATE CASCADE;
