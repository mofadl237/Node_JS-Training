import { Prisma } from "@prisma/client";
import type {
  EAttendanceSource,
  EAttendanceStatus,
  EAttendanceType,
  EEmployeeStatus,
} from "@prisma/client";
import { EUploadType } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { BadRequestError, NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import {
  getValue,
  normalizeRow,
  normalizeUtcDay,
  optionalBooleanValue,
  optionalDateValue,
  optionalFloatValue,
  optionalIntValue,
  optionalTimeValue,
  parseCsvFile,
  requiredDateValue,
  requiredValue,
} from "./csv.js";
import type {
  IImportResult,
  IImportRowError,
  IUploadedFileResponse,
} from "./type.js";
import type { IListUploadsQuery } from "./validation.js";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * Uploads / CSV Import Service
 * ════════════════════════════════════════════════════════════════════════════
 *
 * الفكرة باختصار:
 * - Multer بيستقبل الملف ويحفظه في `uploads/csv`.
 * - `parseCsvFile` بيقرأ الملف ويحوله لصفوف (rows).
 * - كل صف بنعالجه لوحده، ولو صف فيه مشكلة بنسجله في `errors` وباقي الصفوف
 *   بتكمل عادي. يعني ملف فيه 100 موظف وواحد غلط مش هيفشل الـ 99 الباقيين.
 * - في الآخر بنسجل عملية الرفع في جدول `uploaded_files` بالـ total/success/failed.
 *
 * ── 1) رفع الموظفين: POST /api/uploads/employees ───────────────────────────
 *
 * الأعمدة المطلوبة:
 *   employeeCode, firstName, lastName, department, hireDate
 *
 * أعمدة اختيارية للموظف:
 *   email, phone, jobTitle, status (ACTIVE | INACTIVE), departmentDescription
 *
 * أعمدة اختيارية للشيفت (لو موجودة، الموظف بيتعمل له assignment):
 *   shiftName, shiftStartTime, shiftEndTime, shiftGraceMinutes,
 *   shiftExpectedHours, shiftOvertimeAfterMinutes, shiftIsNightShift,
 *   shiftStartDate, shiftEndDate
 *
 * سلوك الـ import:
 * - لو الموظف موجود بنفس `employeeCode` بيتم تحديث بياناته (upsert).
 * - لو القسم مش موجود بيتعمل تلقائيًا.
 * - لو الشيفت مش موجود لازم `shiftStartTime` و`shiftEndTime` يكونوا موجودين
 *   عشان يتعمل شيفت جديد. لو الشيفت موجود بيتم استخدامه زي ما هو.
 * - لو الموظف عنده شيفت active مختلف، بيتعمله deactivate وبعدين يتعمل
 *   assignment للشيفت الجديد. لو عنده نفس الشيفت active، مفيش تكرار.
 * - أي صف بيفشل بيترجع في `errors` مع رقم الصف ورسالة واضحة.
 *
 * ── 2) رفع الحضور: POST /api/uploads/attendance ────────────────────────────
 *
 * الصف بيتم التعرف على نوعه من الأعمدة:
 * - لو فيه `type` و`timestamp` → Attendance Log.
 *   الأعمدة: employeeCode, type (CHECK_IN | CHECK_OUT), timestamp,
 *            source (MANUAL | CSV | SYSTEM) اختياري، الافتراضي CSV.
 * - لو فيه `date` → Attendance Record.
 *   الأعمدة: employeeCode, date, shiftName?, checkIn?, checkOut?, status?,
 *            workingMinutes?, lateMinutes?, earlyLeaveMinutes?,
 *            overtimeMinutes?, notes?, processedAt?
 *
 * سلوك الـ import:
 * - Attendance Log: لو نفس (employee + type + timestamp) موجود مسبقًا،
 *   الصف بيتحسب success بدون تكرار.
 * - Attendance Record: بيتم upsert على (employeeId + date)، يعني إعادة رفع
 *   نفس اليوم بتحديث السجل بدل عمل duplicate.
 * - `workingMinutes` بيتحسب تلقائيًا من checkIn/checkOut لو مش مبعوت.
 * - `checkOut` لازم يكون بعد أو يساوي `checkIn`.
 *
 * ── 3) سجل الملفات: GET /api/uploads و GET /api/uploads/:id ────────────────
 * - بيرجع بيانات الملف + مين رفعه + إحصائيات الصفوف.
 */
const uploadedFileSelect = {
  id: true,
  fileName: true,
  originalName: true,
  type: true,
  uploadedById: true,
  totalRows: true,
  successRows: true,
  failedRows: true,
  createdAt: true,
  uploadedBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
} as const;

const parseEmployeeStatus = (row: Record<string, string>): EEmployeeStatus => {
  const value = getValue(row, "status");

  if (!value) {
    return "ACTIVE";
  }

  const normalized = value.toUpperCase();

  if (normalized === "ACTIVE" || normalized === "INACTIVE") {
    return normalized;
  }

  throw new Error("status must be ACTIVE or INACTIVE");
};

const parseAttendanceType = (row: Record<string, string>): EAttendanceType => {
  const value = requiredValue(row, "type").toUpperCase();

  if (value === "CHECK_IN" || value === "CHECK_OUT") {
    return value;
  }

  throw new Error("type must be CHECK_IN or CHECK_OUT");
};

const parseAttendanceSource = (row: Record<string, string>): EAttendanceSource => {
  const value = getValue(row, "source");

  if (!value) {
    return "CSV";
  }

  const normalized = value.toUpperCase();

  if (normalized === "MANUAL" || normalized === "CSV" || normalized === "SYSTEM") {
    return normalized;
  }

  throw new Error("source must be MANUAL, CSV, or SYSTEM");
};

const parseAttendanceStatus = (row: Record<string, string>): EAttendanceStatus | undefined => {
  const value = getValue(row, "status");

  if (!value) {
    return undefined;
  }

  const normalized = value.toUpperCase();

  if (
    normalized === "PRESENT" ||
    normalized === "ABSENT" ||
    normalized === "LATE" ||
    normalized === "HALF_DAY" ||
    normalized === "ON_LEAVE"
  ) {
    return normalized;
  }

  throw new Error("status must be PRESENT, ABSENT, LATE, HALF_DAY, or ON_LEAVE");
};

const rowErrorMessage = (error: unknown): string => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return "Duplicate value violates a unique constraint (employeeCode or email)";
    }

    if (error.code === "P2003") {
      return "Related record does not exist";
    }

    if (error.code === "P2025") {
      return "Record not found";
    }
  }

  return error instanceof Error ? error.message : "Unknown import error";
};

const calculateWorkingMinutes = (checkIn: Date | undefined, checkOut: Date | undefined): number => {
  if (!checkIn || !checkOut) {
    return 0;
  }

  return Math.max(0, Math.round((checkOut.getTime() - checkIn.getTime()) / 60000));
};

export class UploadService {
  async list(query: IListUploadsQuery) {
    const where: Prisma.UploadedFileWhereInput = {};

    if (query.type) {
      where.type = query.type;
    }

    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    const [uploads, total] = await prisma.$transaction([
      prisma.uploadedFile.findMany({
        where,
        select: uploadedFileSelect,
        orderBy: { [sortBy]: sortOrder },
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.uploadedFile.count({ where }),
    ]);

    return toPaginatedResult(
      uploads as IUploadedFileResponse[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<IUploadedFileResponse> {
    const upload = await prisma.uploadedFile.findUnique({
      where: { id },
      select: uploadedFileSelect,
    });

    if (!upload) {
      throw new NotFoundError("Uploaded file not found", "UPLOAD_NOT_FOUND");
    }

    return upload;
  }

  async importEmployees(file: Express.Multer.File, uploadedById: string): Promise<IImportResult> {
    const rawRows = await parseCsvFile(file.path);

    if (rawRows.length === 0) {
      throw new BadRequestError("CSV file is empty", "CSV_EMPTY");
    }

    const errors: IImportRowError[] = [];
    let successRows = 0;

    for (let index = 0; index < rawRows.length; index += 1) {
      const rowNumber = index + 2;
      const row = normalizeRow(rawRows[index]);
      const employeeCode = getValue(row, "employeeCode");

      try {
        const firstName = requiredValue(row, "firstName");
        const lastName = requiredValue(row, "lastName");
        const departmentName = requiredValue(row, "department", "departmentName");
        const departmentDescription = getValue(row, "departmentDescription");
        const hireDate = requiredDateValue(row, "hireDate");
        const status = parseEmployeeStatus(row);
        const email = getValue(row, "email");
        const phone = getValue(row, "phone");
        const jobTitle = getValue(row, "jobTitle");

        if (!employeeCode) {
          throw new Error("employeeCode is required");
        }

        const shiftName = getValue(row, "shiftName");

        await prisma.$transaction(async (tx) => {
          let department = await tx.department.findFirst({
            where: { name: { equals: departmentName, mode: "insensitive" } },
            select: { id: true },
          });

          if (!department) {
            department = await tx.department.create({
              data: {
                name: departmentName,
                description: departmentDescription ?? null,
              },
              select: { id: true },
            });
          }

          const employee = await tx.employee.upsert({
            where: { employeeCode },
            update: {
              firstName,
              lastName,
              departmentId: department.id,
              status,
              hireDate,
              ...(email !== undefined ? { email } : {}),
              ...(phone !== undefined ? { phone } : {}),
              ...(jobTitle !== undefined ? { jobTitle } : {}),
            },
            create: {
              employeeCode,
              firstName,
              lastName,
              departmentId: department.id,
              status,
              hireDate,
              email: email ?? null,
              phone: phone ?? null,
              jobTitle: jobTitle ?? null,
            },
            select: { id: true },
          });

          if (!shiftName) {
            return;
          }

          let shift = await tx.shift.findFirst({
            where: { name: { equals: shiftName, mode: "insensitive" } },
            select: { id: true },
          });

          if (!shift) {
            const startTime = optionalTimeValue(row, "shiftStartTime");
            const endTime = optionalTimeValue(row, "shiftEndTime");

            if (!startTime || !endTime) {
              throw new Error(
                "shiftStartTime and shiftEndTime are required when creating a new shift",
              );
            }

            shift = await tx.shift.create({
              data: {
                name: shiftName,
                startTime,
                endTime,
                graceMinutes: optionalIntValue(row, "shiftGraceMinutes") ?? 15,
                expectedHours: optionalFloatValue(row, "shiftExpectedHours") ?? 8,
                overtimeAfterMinutes: optionalIntValue(row, "shiftOvertimeAfterMinutes") ?? 0,
                isNightShift: optionalBooleanValue(row, "shiftIsNightShift") ?? false,
              },
              select: { id: true },
            });
          }

          const shiftStartDate = optionalDateValue(row, "shiftStartDate") ?? hireDate;
          const shiftEndDate = optionalDateValue(row, "shiftEndDate");

          if (shiftEndDate && shiftEndDate.getTime() < shiftStartDate.getTime()) {
            throw new Error("shiftEndDate must be after or equal to shiftStartDate");
          }

          await tx.employeeShift.updateMany({
            where: {
              employeeId: employee.id,
              isActive: true,
              shiftId: { not: shift.id },
            },
            data: { isActive: false },
          });

          const existingAssignment = await tx.employeeShift.findFirst({
            where: {
              employeeId: employee.id,
              shiftId: shift.id,
              isActive: true,
            },
            select: { id: true },
          });

          if (!existingAssignment) {
            await tx.employeeShift.create({
              data: {
                employeeId: employee.id,
                shiftId: shift.id,
                startDate: shiftStartDate,
                endDate: shiftEndDate ?? null,
                isActive: true,
              },
            });
          }
        });

        successRows += 1;
      } catch (error: unknown) {
        errors.push({
          row: rowNumber,
          ...(employeeCode ? { employeeCode } : {}),
          message: rowErrorMessage(error),
        });
      }
    }

    const upload = await prisma.uploadedFile.create({
      data: {
        fileName: file.filename,
        originalName: file.originalname,
        type: EUploadType.EMPLOYEE_IMPORT,
        uploadedById,
        totalRows: rawRows.length,
        successRows,
        failedRows: errors.length,
      },
      select: uploadedFileSelect,
    });

    return { upload, errors };
  }

  async importAttendance(file: Express.Multer.File, uploadedById: string): Promise<IImportResult> {
    const rawRows = await parseCsvFile(file.path);

    if (rawRows.length === 0) {
      throw new BadRequestError("CSV file is empty", "CSV_EMPTY");
    }

    const errors: IImportRowError[] = [];
    let successRows = 0;

    for (let index = 0; index < rawRows.length; index += 1) {
      const rowNumber = index + 2;
      const row = normalizeRow(rawRows[index]);
      const employeeCode = getValue(row, "employeeCode");

      try {
        if (!employeeCode) {
          throw new Error("employeeCode is required");
        }

        const employee = await prisma.employee.findUnique({
          where: { employeeCode },
          select: { id: true },
        });

        if (!employee) {
          throw new Error(`Employee with code ${employeeCode} was not found`);
        }

        const hasLogData = getValue(row, "type") !== undefined || getValue(row, "timestamp") !== undefined;

        if (hasLogData) {
          const type = parseAttendanceType(row);
          const timestamp = requiredDateValue(row, "timestamp");
          const source = parseAttendanceSource(row);

          const existingLog = await prisma.attendanceLog.findFirst({
            where: {
              employeeId: employee.id,
              type,
              timestamp,
            },
            select: { id: true },
          });

          if (!existingLog) {
            await prisma.attendanceLog.create({
              data: {
                employeeId: employee.id,
                type,
                timestamp,
                source,
                createdById: uploadedById,
              },
            });
          }

          successRows += 1;
          continue;
        }

        const dateValue = getValue(row, "date");

        if (!dateValue) {
          throw new Error(
            "Row must contain either type + timestamp (attendance log) or date (attendance record)",
          );
        }

        const date = normalizeUtcDay(requiredDateValue(row, "date"));
        const shiftName = getValue(row, "shiftName");
        let shiftId: string | undefined;

        if (shiftName) {
          const shift = await prisma.shift.findFirst({
            where: { name: { equals: shiftName, mode: "insensitive" } },
            select: { id: true },
          });

          if (!shift) {
            throw new Error(`Shift with name ${shiftName} was not found`);
          }

          shiftId = shift.id;
        }

        const checkIn = optionalDateValue(row, "checkIn");
        const checkOut = optionalDateValue(row, "checkOut");

        if (checkIn && checkOut && checkOut.getTime() < checkIn.getTime()) {
          throw new Error("checkOut must be after or equal to checkIn");
        }

        const status = parseAttendanceStatus(row);
        const providedWorkingMinutes = optionalIntValue(row, "workingMinutes");
        const computedWorkingMinutes =
          checkIn && checkOut ? calculateWorkingMinutes(checkIn, checkOut) : undefined;
        const workingMinutes = providedWorkingMinutes ?? computedWorkingMinutes;
        const lateMinutes = optionalIntValue(row, "lateMinutes");
        const earlyLeaveMinutes = optionalIntValue(row, "earlyLeaveMinutes");
        const overtimeMinutes = optionalIntValue(row, "overtimeMinutes");
        const notes = getValue(row, "notes");
        const processedAt = optionalDateValue(row, "processedAt");

        await prisma.attendanceRecord.upsert({
          where: {
            employeeId_date: {
              employeeId: employee.id,
              date,
            },
          },
          update: {
            ...(shiftId !== undefined ? { shiftId } : {}),
            ...(checkIn !== undefined ? { checkIn } : {}),
            ...(checkOut !== undefined ? { checkOut } : {}),
            ...(status !== undefined ? { status } : {}),
            ...(workingMinutes !== undefined ? { workingMinutes } : {}),
            ...(lateMinutes !== undefined ? { lateMinutes } : {}),
            ...(earlyLeaveMinutes !== undefined ? { earlyLeaveMinutes } : {}),
            ...(overtimeMinutes !== undefined ? { overtimeMinutes } : {}),
            ...(notes !== undefined ? { notes } : {}),
            ...(processedAt !== undefined ? { processedAt } : {}),
          },
          create: {
            employeeId: employee.id,
            shiftId: shiftId ?? null,
            date,
            checkIn: checkIn ?? null,
            checkOut: checkOut ?? null,
            status: status ?? "PRESENT",
            workingMinutes: workingMinutes ?? 0,
            lateMinutes: lateMinutes ?? 0,
            earlyLeaveMinutes: earlyLeaveMinutes ?? 0,
            overtimeMinutes: overtimeMinutes ?? 0,
            notes: notes ?? null,
            processedAt: processedAt ?? null,
          },
        });

        successRows += 1;
      } catch (error: unknown) {
        errors.push({
          row: rowNumber,
          ...(employeeCode ? { employeeCode } : {}),
          message: rowErrorMessage(error),
        });
      }
    }

    const upload = await prisma.uploadedFile.create({
      data: {
        fileName: file.filename,
        originalName: file.originalname,
        type: EUploadType.ATTENDANCE_IMPORT,
        uploadedById,
        totalRows: rawRows.length,
        successRows,
        failedRows: errors.length,
      },
      select: uploadedFileSelect,
    });

    return { upload, errors };
  }
}
