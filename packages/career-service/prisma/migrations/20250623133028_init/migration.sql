-- CreateTable
CREATE TABLE "CareerProfile" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "interest" TEXT NOT NULL,
    "skills" TEXT[],
    "recommended" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CareerProfile_userId_key" ON "CareerProfile"("userId");
