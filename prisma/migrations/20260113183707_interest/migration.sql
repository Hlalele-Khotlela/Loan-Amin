-- CreateTable
CREATE TABLE "Interest" (
    "id" SERIAL NOT NULL,
    "member_Id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "savings_id" INTEGER NOT NULL,
    "ownerShare" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shares" (
    "id" SERIAL NOT NULL,
    "member_Id" INTEGER NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "Shares_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_savings_id_fkey" FOREIGN KEY ("savings_id") REFERENCES "Savings"("savings_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shares" ADD CONSTRAINT "Shares_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;
