import { z } from "zod";
import type { TAttendanceStatus } from "@/src/lib/api/types";

export interface IAttendanceRecordValidationMessages {
  employeeRequired: string;
  dateRequired: string;
  timeInvalid: string;
  checkOutBeforeCheckIn: string;
  minutesInvalid: string;
  minutesMax: string;
  notesMax: string;
}

export interface IAttendanceRecordFormValues {
  employeeId: string;
  shiftId: string;
  date: string;
  status: TAttendanceStatus;
  checkIn: string;
  checkOut: string;
  workingMinutes: string;
  lateMinutes: string;
  earlyLeaveMinutes: string;
  overtimeMinutes: string;
  notes: string;
}

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const MINUTES_PATTERN = /^\d+$/;
const MAX_MINUTES = 10080;

const timeField = (message: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || TIME_PATTERN.test(value), {
      message,
    });

const minutesField = (invalidMessage: string, maxMessage: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || MINUTES_PATTERN.test(value), {
      message: invalidMessage,
    })
    .refine((value) => value === "" || Number(value) <= MAX_MINUTES, {
      message: maxMessage,
    });

export const createAttendanceRecordSchema = (
  messages: IAttendanceRecordValidationMessages,
) =>
  z
    .object({
      employeeId: z.string().trim().min(1, messages.employeeRequired),
      shiftId: z.string().trim(),
      date: z.string().trim().min(1, messages.dateRequired),
      status: z.enum([
        "PRESENT",
        "ABSENT",
        "LATE",
        "HALF_DAY",
        "ON_LEAVE",
      ]),
      checkIn: timeField(messages.timeInvalid),
      checkOut: timeField(messages.timeInvalid),
      workingMinutes: minutesField(
        messages.minutesInvalid,
        messages.minutesMax,
      ),
      lateMinutes: minutesField(messages.minutesInvalid, messages.minutesMax),
      earlyLeaveMinutes: minutesField(
        messages.minutesInvalid,
        messages.minutesMax,
      ),
      overtimeMinutes: minutesField(
        messages.minutesInvalid,
        messages.minutesMax,
      ),
      notes: z.string().trim().max(1000, messages.notesMax),
    })
    .refine(
      (values) =>
        values.checkIn === "" ||
        values.checkOut === "" ||
        values.checkOut >= values.checkIn,
      {
        message: messages.checkOutBeforeCheckIn,
        path: ["checkOut"],
      },
    );
