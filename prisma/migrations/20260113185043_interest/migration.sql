-- CreateTable
CREATE TABLE "OwnerTransaction" (
    "id" SERIAL NOT NULL,
    "savings_id" INTEGER NOT NULL,
    "member_Id" INTEGER,
    "amount" DECIMAL(12,2) NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OwnerTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OwnerTransaction" ADD CONSTRAINT "OwnerTransaction_savings_id_fkey" FOREIGN KEY ("savings_id") REFERENCES "Savings"("savings_id") ON DELETE CASCADE ON UPDATE CASCADE;
