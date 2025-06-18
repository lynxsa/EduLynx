/*
  Warnings:

  - Made the column `schoolId` on table `Class` required. This step will fail if there are existing NULL values in that column.
  - Made the column `schoolId` on table `Grade` required. This step will fail if there are existing NULL values in that column.
  - Made the column `schoolId` on table `Parent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `schoolId` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `schoolId` on table `Teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Parent" DROP CONSTRAINT "Parent_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_schoolId_fkey";

-- AlterTable
ALTER TABLE "Class" ALTER COLUMN "schoolId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Grade" ALTER COLUMN "schoolId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Parent" ALTER COLUMN "schoolId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "schoolId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "schoolId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
