-- CreateTable
CREATE TABLE "GroupSaving" (
    "group_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "savings_type" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "member_Id" INTEGER NOT NULL,

    CONSTRAINT "GroupSaving_pkey" PRIMARY KEY ("group_id")
);

-- AddForeignKey
ALTER TABLE "GroupSaving" ADD CONSTRAINT "GroupSaving_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;
