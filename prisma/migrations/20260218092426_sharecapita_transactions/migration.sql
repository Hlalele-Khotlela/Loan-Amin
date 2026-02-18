-- CreateTable
CREATE TABLE "ShareOnCapitaltTransaction" (
    "id" SERIAL NOT NULL,
    "sharesId" INTEGER NOT NULL,
    "member_Id" INTEGER,
    "amount" DECIMAL(12,2) NOT NULL,
    "type" TEXT NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareOnCapitaltTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShareOnCapitaltTransaction" ADD CONSTRAINT "ShareOnCapitaltTransaction_sharesId_fkey" FOREIGN KEY ("sharesId") REFERENCES "ShareOnCapital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareOnCapitaltTransaction" ADD CONSTRAINT "ShareOnCapitaltTransaction_member_Id_fkey" FOREIGN KEY ("member_Id") REFERENCES "Member"("member_Id") ON DELETE CASCADE ON UPDATE CASCADE;
