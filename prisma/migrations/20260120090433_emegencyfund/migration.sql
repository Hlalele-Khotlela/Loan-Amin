-- CreateTable
CREATE TABLE "EmegencyFund" (
    "id" SERIAL NOT NULL,
    "member_Id" INTEGER,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "Description" TEXT NOT NULL,
    "deposit" DECIMAL(12,2) DEFAULT 0,
    "withdrawals" DECIMAL(12,2) DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmegencyFund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmegencyFundTransactions" (
    "id" SERIAL NOT NULL,
    "deposit" DECIMAL(12,2) DEFAULT 0,
    "withdrawals" DECIMAL(12,2) DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmegencyFundTransactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Raffles" (
    "id" SERIAL NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "deposit" DECIMAL(12,2) DEFAULT 0,
    "withdrawals" DECIMAL(12,2) DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Raffles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaffleTransactions" (
    "id" SERIAL NOT NULL,
    "deposit" DECIMAL(12,2) DEFAULT 0,
    "withdrawals" DECIMAL(12,2) DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RaffleTransactions_pkey" PRIMARY KEY ("id")
);
