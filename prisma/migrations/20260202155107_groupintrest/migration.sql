-- CreateTable
CREATE TABLE "MemberInterest" (
    "id" SERIAL NOT NULL,
    "member_Id" INTEGER NOT NULL,
    "group_Id" INTEGER NOT NULL,
    "netContribution" DECIMAL(65,30) NOT NULL,
    "interestShare" DECIMAL(65,30) NOT NULL,
    "interestRate" DECIMAL(65,30) NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberInterest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemberInterest" ADD CONSTRAINT "MemberInterest_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberInterest" ADD CONSTRAINT "MemberInterest_group_Id_fkey" FOREIGN KEY ("group_Id") REFERENCES "GroupSaving"("group_id") ON DELETE RESTRICT ON UPDATE CASCADE;
