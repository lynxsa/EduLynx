/*
  Warnings:

  - You are about to drop the column `idNumber` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `nationality` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `previousSchool` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "idNumber",
DROP COLUMN "nationality",
DROP COLUMN "previousSchool";
