import type { EAttendanceStatus, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import { env } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";
import { LeaveService } from "../../modules/Leaves/services.js";
import type { ILeaveOccurrenceLeave } from "../../modules/Leaves/type.js";
import { logger } from "../../utils/logger/index.js";
import { buildShiftWindow, calculateAttendance } from "./calculations.js";
import type {
  IAttendanceProcessError,
  IAttendanceProcessResult,
} from "./types.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const HOUR_MS = 60 * 60 * 1000;
const EARLY_CHECK_IN_BUFFER_HOURS = 6;
const LATE_CHECK_OUT_BUFFER_HOURS = 12;

const assignmentSelect = {
  employeeId: true,
  shiftId: true,
  startDate: true,
  endDate: true,
  employee: {
    select: {
      id: true,
      departmentId: true,
    },
  },
  shift: {
    select: {
      id: true,
      name: true,
      startTime: true,
      endTime: true,
      graceMinutes: true,
      expectedHours: true,
      overtimeAfterMinutes: true,
      isNightShift: true,
    },
  },
} as const;

type Assignment = Prisma.EmployeeShiftGetPayload<{
  select: typeof assignmentSelect;
}>;

const leaveService = new LeaveService();

const chunkArray = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  const safeSize = Math.max(1, Math.trunc(size));

  for (let index = 0; index < items.length; index += safeSize) {
    chunks.push(items.slice(index, index + safeSize));
  }

  return chunks;
};

const normalizeRecordDate = (date: string): Date =>
  dayjs.utc(date).startOf("day").toDate();

const validateDate = (date: string): void => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !dayjs.utc(date).isValid()) {
    throw new Error(`Invalid attendance processing date: ${date}`);
  }
};

const getDayBounds = (date: string): { start: Date; end: Date } => {
  const start = dayjs
    .tz(`${date} 00:00`, "YYYY-MM-DD HH:mm", env.ATTENDANCE_TIMEZONE)
    .startOf("day");

  return {
    start: start.toDate(),
    end: start.endOf("day").toDate(),
  };
};

const getLeaveNote = (leaves: ILeaveOccurrenceLeave[]): string | null => {
  if (leaves.length === 0) {
    return null;
  }

  return `Leave day: ${leaves.map((leave) => leave.name).join(", ")}`;
};

export const processAttendanceDate = async (
  date: string,
  employeeIds?: string[],
): Promise<IAttendanceProcessResult> => {
  validateDate(date);

  const recordDate = normalizeRecordDate(date);
  const dayBounds = getDayBounds(date);
  const result: IAttendanceProcessResult = {
    date,
    employeesProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    absentRecords: 0,
    leaveRecords: 0,
    errors: [],
  };

  const where: Prisma.EmployeeShiftWhereInput = {
    isActive: true,
    startDate: { lte: dayBounds.end },
    OR: [{ endDate: null }, { endDate: { gte: dayBounds.start } }],
    ...(employeeIds && employeeIds.length > 0
      ? { employeeId: { in: employeeIds } }
      : {}),
  };

  const assignments = await prisma.employeeShift.findMany({
    where,
    select: assignmentSelect,
    orderBy: [{ employeeId: "asc" }, { startDate: "desc" }],
  });

  const latestAssignmentByEmployee = new Map<string, Assignment>();

  for (const assignment of assignments) {
    if (!latestAssignmentByEmployee.has(assignment.employeeId)) {
      latestAssignmentByEmployee.set(assignment.employeeId, assignment);
    }
  }

  const employeeIdsToProcess = Array.from(latestAssignmentByEmployee.keys());
  const batches = chunkArray(employeeIdsToProcess, env.ATTENDANCE_BATCH_SIZE);

  for (const batch of batches) {
    const batchAssignments = batch
      .map((employeeId) => latestAssignmentByEmployee.get(employeeId))
      .filter((assignment): assignment is Assignment => Boolean(assignment));

    if (batchAssignments.length === 0) {
      continue;
    }

    const batchEmployeeIds = batchAssignments.map((assignment) => assignment.employeeId);
    const employees = batchAssignments.map((assignment) => ({
      id: assignment.employeeId,
      departmentId: assignment.employee.departmentId,
    }));

    const leaveMap = await leaveService.getLeaveMapForDate(recordDate, employees);
    const shiftWindows = new Map(
      batchAssignments.map((assignment) => [
        assignment.employeeId,
        buildShiftWindow(
          date,
          assignment.shift.startTime,
          assignment.shift.endTime,
          env.ATTENDANCE_TIMEZONE,
        ),
      ]),
    );

    const windowStarts = Array.from(shiftWindows.values()).map(
      (window) => window.start.getTime(),
    );
    const windowEnds = Array.from(shiftWindows.values()).map(
      (window) => window.end.getTime(),
    );
    const logsFrom = new Date(
      Math.min(...windowStarts) - EARLY_CHECK_IN_BUFFER_HOURS * HOUR_MS,
    );
    const logsTo = new Date(
      Math.max(...windowEnds) + LATE_CHECK_OUT_BUFFER_HOURS * HOUR_MS,
    );

    const [logs, existingRecords] = await Promise.all([
      prisma.attendanceLog.findMany({
        where: {
          employeeId: { in: batchEmployeeIds },
          timestamp: { gte: logsFrom, lte: logsTo },
        },
        select: {
          employeeId: true,
          type: true,
          timestamp: true,
        },
        orderBy: [{ employeeId: "asc" }, { timestamp: "asc" }],
      }),
      prisma.attendanceRecord.findMany({
        where: {
          employeeId: { in: batchEmployeeIds },
          date: recordDate,
        },
        select: { employeeId: true },
      }),
    ]);

    const logsByEmployee = new Map<string, typeof logs>();

    for (const log of logs) {
      const employeeLogs = logsByEmployee.get(log.employeeId) ?? [];
      employeeLogs.push(log);
      logsByEmployee.set(log.employeeId, employeeLogs);
    }

    const existingEmployeeIds = new Set(
      existingRecords.map((record) => record.employeeId),
    );

    for (const assignment of batchAssignments) {
      try {
        const shiftWindow = shiftWindows.get(assignment.employeeId);

        if (!shiftWindow) {
          continue;
        }

        const searchFrom = new Date(
          shiftWindow.start.getTime() - EARLY_CHECK_IN_BUFFER_HOURS * HOUR_MS,
        );
        const searchTo = new Date(
          shiftWindow.end.getTime() + LATE_CHECK_OUT_BUFFER_HOURS * HOUR_MS,
        );

        const employeeLogs = (logsByEmployee.get(assignment.employeeId) ?? []).filter(
          (log) =>
            log.timestamp.getTime() >= searchFrom.getTime() &&
            log.timestamp.getTime() <= searchTo.getTime(),
        );

        const checkInLog = employeeLogs.find((log) => log.type === "CHECK_IN");
        const checkOutLog = checkInLog
          ? employeeLogs.find(
              (log) =>
                log.type === "CHECK_OUT" &&
                log.timestamp.getTime() >= checkInLog.timestamp.getTime(),
            )
          : employeeLogs.find((log) => log.type === "CHECK_OUT");

        const checkIn = checkInLog?.timestamp ?? null;
        const checkOut = checkOutLog?.timestamp ?? null;
        const leaves = leaveMap.get(assignment.employeeId) ?? [];
        const leaveNote = getLeaveNote(leaves);

        let status: EAttendanceStatus;
        let workingMinutes = 0;
        let lateMinutes = 0;
        let earlyLeaveMinutes = 0;
        let overtimeMinutes = 0;
        let notes: string | null = null;

        if (!checkIn && !checkOut) {
          if (leaves.length > 0) {
            status = "ON_LEAVE";
            notes = leaveNote;
            result.leaveRecords += 1;
          } else {
            status = "ABSENT";
            notes = "No attendance logs";
            result.absentRecords += 1;
          }
        } else {
          const calculation = calculateAttendance({
            checkIn,
            checkOut,
            shiftStart: shiftWindow.start,
            shiftEnd: shiftWindow.end,
            graceMinutes: assignment.shift.graceMinutes,
            expectedHours: assignment.shift.expectedHours,
            overtimeAfterMinutes: assignment.shift.overtimeAfterMinutes,
          });

          status = calculation.status;
          workingMinutes = calculation.workingMinutes;
          lateMinutes = calculation.lateMinutes;
          earlyLeaveMinutes = calculation.earlyLeaveMinutes;
          overtimeMinutes = calculation.overtimeMinutes;

          if (!checkIn) {
            notes = "Missing check-in";
          } else if (!checkOut) {
            notes = "Missing check-out";
          }

          if (leaveNote) {
            notes = notes ? `${notes}; ${leaveNote}` : leaveNote;
          }
        }

        await prisma.attendanceRecord.upsert({
          where: {
            employeeId_date: {
              employeeId: assignment.employeeId,
              date: recordDate,
            },
          },
          create: {
            employeeId: assignment.employeeId,
            shiftId: assignment.shiftId,
            date: recordDate,
            checkIn,
            checkOut,
            status,
            workingMinutes,
            lateMinutes,
            earlyLeaveMinutes,
            overtimeMinutes,
            notes,
            processedAt: new Date(),
          },
          update: {
            shiftId: assignment.shiftId,
            checkIn,
            checkOut,
            status,
            workingMinutes,
            lateMinutes,
            earlyLeaveMinutes,
            overtimeMinutes,
            notes,
            processedAt: new Date(),
          },
        });

        result.employeesProcessed += 1;

        if (existingEmployeeIds.has(assignment.employeeId)) {
          result.recordsUpdated += 1;
        } else {
          result.recordsCreated += 1;
        }
      } catch (error: unknown) {
        const processError: IAttendanceProcessError = {
          employeeId: assignment.employeeId,
          message: error instanceof Error ? error.message : String(error),
        };
        result.errors.push(processError);
        logger.error("Attendance processing failed for employee", processError);
      }
    }
  }

  return result;
};
