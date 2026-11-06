-- CreateEnum
CREATE TYPE "ELeaveType" AS ENUM ('ANNUAL', 'SICK', 'UNPAID', 'OFFICIAL_HOLIDAY', 'WEEKEND', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ELeaveScope" AS ENUM ('ALL', 'DEPARTMENT', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "ELeaveRecurrence" AS ENUM ('NONE', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateTable
CREATE TABLE "leaves" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ELeaveType" NOT NULL,
    "scope" "ELeaveScope" NOT NULL DEFAULT 'ALL',
    "employeeId" TEXT,
    "departmentId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isPaid" BOOLEAN NOT NULL DEFAULT true,
    "isDeductible" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "recurrence" "ELeaveRecurrence" NOT NULL DEFAULT 'NONE',
    "recurrenceDayOfWeek" INTEGER,
    "recurrenceDayOfMonth" INTEGER,
    "recurrenceMonth" INTEGER,
    "recurrenceDay" INTEGER,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leaves_startDate_endDate_idx" ON "leaves"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "leaves_employeeId_idx" ON "leaves"("employeeId");

-- CreateIndex
CREATE INDEX "leaves_departmentId_idx" ON "leaves"("departmentId");

-- AddForeignKey
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
