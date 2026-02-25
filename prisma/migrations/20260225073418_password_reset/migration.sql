-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "tokenId" TEXT NOT NULL,
    "jwtHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_tokenId_key" ON "PasswordReset"("tokenId");

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("admin_Id") ON DELETE CASCADE ON UPDATE CASCADE;
