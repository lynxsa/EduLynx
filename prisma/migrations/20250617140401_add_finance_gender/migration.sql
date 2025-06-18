/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Quiz` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FinanceType" AS ENUM ('Income', 'Expense');

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "startDate" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "endDate" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "FinanceEntry" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "FinanceType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinanceEntry_pkey" PRIMARY KEY ("id")
);
