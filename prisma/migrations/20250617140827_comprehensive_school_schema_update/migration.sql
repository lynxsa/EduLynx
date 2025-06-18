/*
  Warnings:

  - Added the required column `gender` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "classTeacher" TEXT,
ADD COLUMN     "roomNumber" TEXT,
ADD COLUMN     "timetable" TEXT;

-- AlterTable
ALTER TABLE "FinanceEntry" ADD COLUMN     "category" TEXT,
ADD COLUMN     "linkedParentId" TEXT,
ADD COLUMN     "linkedStudentId" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "reference" TEXT;

-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "employer" TEXT,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "relationshipToStudent" TEXT;

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "logo" TEXT,
ADD COLUMN     "motto" TEXT,
ADD COLUMN     "principal" TEXT,
ADD COLUMN     "registrationNumber" TEXT,
ADD COLUMN     "schoolType" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "admissionYear" INTEGER,
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "emergencyContactName" TEXT,
ADD COLUMN     "emergencyContactPhone" TEXT,
ADD COLUMN     "extracurriculars" TEXT,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "guardianRelationship" TEXT,
ADD COLUMN     "homeLanguage" TEXT,
ADD COLUMN     "idNumber" TEXT,
ADD COLUMN     "medicalInfo" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "previousSchool" TEXT,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "specialNeeds" TEXT,
ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "employmentStatus" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "idNumber" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "nextOfKinName" TEXT,
ADD COLUMN     "nextOfKinPhone" TEXT,
ADD COLUMN     "qualifications" TEXT,
ADD COLUMN     "yearsExperience" INTEGER;
