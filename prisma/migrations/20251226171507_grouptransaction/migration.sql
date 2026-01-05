-- CreateTable
CREATE TABLE "GroupDeposit" (
    "deposit_id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "deposited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "member_Id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "GroupDeposit_pkey" PRIMARY KEY ("deposit_id")
);

-- AddForeignKey
ALTER TABLE "GroupDeposit" ADD CONSTRAINT "GroupDeposit_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupDeposit" ADD CONSTRAINT "GroupDeposit_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "GroupSaving"("group_id") ON DELETE RESTRICT ON UPDATE CASCADE;
