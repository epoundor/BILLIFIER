/*
  Warnings:

  - Made the column `paymentProvider` on table `TicketOrder` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TicketOrder" ALTER COLUMN "paymentProvider" SET NOT NULL;
