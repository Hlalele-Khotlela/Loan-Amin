-- CreateTable
CREATE TABLE "loanrequest" (
    "applicant" VARCHAR(255),
    "amount" INTEGER,
    "status" VARCHAR(200),
    "balance" INTEGER,
    "request_id" SERIAL NOT NULL,

    CONSTRAINT "loanrequest_pkey" PRIMARY KEY ("request_id")
);
