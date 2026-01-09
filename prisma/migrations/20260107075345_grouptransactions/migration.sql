-- CreateTable
CREATE TABLE "GroupSavingsTransaction" (
    "Transaction_id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupSavingsTransaction_pkey" PRIMARY KEY ("Transaction_id")
);

-- AddForeignKey
ALTER TABLE "GroupSavingsTransaction" ADD CONSTRAINT "GroupSavingsTransaction_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "GroupSaving"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;
