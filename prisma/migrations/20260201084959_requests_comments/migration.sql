-- CreateTable
CREATE TABLE "LoanRequestComments" (
    "comment" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "request_id" INTEGER,

    CONSTRAINT "LoanRequestComments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoanRequestComments" ADD CONSTRAINT "LoanRequestComments_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "loanrequest"("request_id") ON DELETE SET NULL ON UPDATE CASCADE;
