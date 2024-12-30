-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFTED', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'DRAFTED';
