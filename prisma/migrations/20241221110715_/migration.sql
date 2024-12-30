/*
  Warnings:

  - Added the required column `status` to the `EventStatusHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventStatusHistory" ADD COLUMN     "status" "EventStatus" NOT NULL;
