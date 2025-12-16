/*
  Warnings:

  - You are about to drop the `Members` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Members";

-- CreateTable
CREATE TABLE "Member" (
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "member_Id" SERIAL NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("member_Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");
