/*
  Warnings:

  - Added the required column `ticketOrderId` to the `UserTicket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserTicket" ADD COLUMN     "ticketOrderId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserTicket" ADD CONSTRAINT "UserTicket_ticketOrderId_fkey" FOREIGN KEY ("ticketOrderId") REFERENCES "TicketOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
