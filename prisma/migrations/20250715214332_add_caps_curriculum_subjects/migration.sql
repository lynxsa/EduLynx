/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubjectType" AS ENUM ('COMPULSORY', 'ELECTIVE', 'HOME_LANGUAGE', 'ADDITIONAL_LANG', 'MATHEMATICS', 'SPECIALIZED');

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "gradeLevel" TEXT,
ADD COLUMN     "isCompulsory" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subjectType" "SubjectType" NOT NULL DEFAULT 'ELECTIVE';

-- CreateTable
CREATE TABLE "StudentSubject" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "StudentSubject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentSubject_studentId_subjectId_key" ON "StudentSubject"("studentId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");

-- AddForeignKey
ALTER TABLE "StudentSubject" ADD CONSTRAINT "StudentSubject_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSubject" ADD CONSTRAINT "StudentSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
