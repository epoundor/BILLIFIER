/*
  Warnings:

  - Added the required column `url` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PaymentProvider" ADD VALUE 'STRIPE';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "providerReference" DROP NOT NULL;
