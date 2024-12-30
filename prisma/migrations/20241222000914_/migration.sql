/*
  Warnings:

  - The values [ONHOLD,UNPAID,USED] on the enum `TicketOrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserTicketStatus" AS ENUM ('UNVERIFIED', 'VERIFIED', 'REVOKED');

-- AlterEnum
BEGIN;
CREATE TYPE "TicketOrderStatus_new" AS ENUM ('INIT', 'REFUND', 'PAID');
ALTER TABLE "TicketOrder" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "TicketOrder" ALTER COLUMN "status" TYPE "TicketOrderStatus_new" USING ("status"::text::"TicketOrderStatus_new");
ALTER TYPE "TicketOrderStatus" RENAME TO "TicketOrderStatus_old";
ALTER TYPE "TicketOrderStatus_new" RENAME TO "TicketOrderStatus";
DROP TYPE "TicketOrderStatus_old";
ALTER TABLE "TicketOrder" ALTER COLUMN "status" SET DEFAULT 'INIT';
COMMIT;

-- CreateTable
CREATE TABLE "UserTicket" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "UserTicketStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "ticketId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "UserTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTicket_code_key" ON "UserTicket"("code");

-- AddForeignKey
ALTER TABLE "UserTicket" ADD CONSTRAINT "UserTicket_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTicket" ADD CONSTRAINT "UserTicket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
