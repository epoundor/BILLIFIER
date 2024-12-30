-- CreateEnum
CREATE TYPE "TicketOrderStatus" AS ENUM ('INIT', 'ONHOLD', 'PAID', 'UNPAID', 'USED', 'REFUND');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('CASH', 'KKIAPAY', 'FEDAPAY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "TicketOrder" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT,
    "amount" INTEGER NOT NULL,
    "paymentReference" TEXT NOT NULL,
    "paymentProvider" "PaymentProvider",
    "status" "TicketOrderStatus" NOT NULL DEFAULT 'INIT',
    "ticketId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerReference" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payerId" TEXT NOT NULL,
    "eventId" TEXT,
    "ticketId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TicketOrder" ADD CONSTRAINT "TicketOrder_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketOrder" ADD CONSTRAINT "TicketOrder_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
