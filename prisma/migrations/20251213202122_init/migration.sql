-- CreateTable
CREATE TABLE "Members" (
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Gender" TEXT NOT NULL,
    "Phone" TEXT NOT NULL,
    "Member_Id" SERIAL NOT NULL,

    CONSTRAINT "Members_pkey" PRIMARY KEY ("Member_Id")
);
