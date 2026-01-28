-- DropForeignKey
ALTER TABLE "GroupSaving" DROP CONSTRAINT "GroupSaving_member_Id_fkey";

-- CreateTable
CREATE TABLE "_GroupMembership" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GroupMembership_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GroupMembership_B_index" ON "_GroupMembership"("B");

-- AddForeignKey
ALTER TABLE "_GroupMembership" ADD CONSTRAINT "_GroupMembership_A_fkey" FOREIGN KEY ("A") REFERENCES "GroupSaving"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupMembership" ADD CONSTRAINT "_GroupMembership_B_fkey" FOREIGN KEY ("B") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;
