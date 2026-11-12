import { z } from "zod";
import type {
  TLeaveRecurrence,
  TLeaveScope,
  TLeaveType,
} from "@/src/lib/api/types";

export interface ILeaveValidationMessages {
  nameRequired: string;
  nameMin: string;
  nameMax: string;
  descriptionMax: string;
  employeeRequired: string;
  departmentRequired: string;
  startDateRequired: string;
  dateRangeInvalid: string;
  dayOfWeekInvalid: string;
  dayOfMonthInvalid: string;
  monthInvalid: string;
  dayInvalid: string;
}

export interface ILeaveFormValues {
  name: string;
  description: string;
  type: TLeaveType;
  scope: TLeaveScope;
  employeeId: string;
  departmentId: string;
  startDate: string;
  endDate: string;
  isPaid: boolean;
  isDeductible: boolean;
  isActive: boolean;
  recurrence: TLeaveRecurrence;
  recurrenceDayOfWeek: string;
  recurrenceDayOfMonth: string;
  recurrenceMonth: string;
  recurrenceDay: string;
}

const optionalIntegerField = (
  min: number,
  max: number,
  message: string,
) =>
  z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        (/^\d+$/.test(value) &&
          Number(value) >= min &&
          Number(value) <= max),
      { message },
    );

export const createLeaveSchema = (messages: ILeaveValidationMessages) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(1, messages.nameRequired)
        .min(2, messages.nameMin)
        .max(100, messages.nameMax),
      description: z.string().trim().max(500, messages.descriptionMax),
      type: z.enum([
        "ANNUAL",
        "SICK",
        "UNPAID",
        "ABSENCE",
        "OFFICIAL_HOLIDAY",
        "WEEKEND",
        "CUSTOM",
      ]),
      scope: z.enum(["ALL", "DEPARTMENT", "EMPLOYEE"]),
      employeeId: z.string().trim(),
      departmentId: z.string().trim(),
      startDate: z.string().trim().min(1, messages.startDateRequired),
      endDate: z.string().trim(),
      isPaid: z.boolean(),
      isDeductible: z.boolean(),
      isActive: z.boolean(),
      recurrence: z.enum(["NONE", "WEEKLY", "MONTHLY", "YEARLY"]),
      recurrenceDayOfWeek: optionalIntegerField(
        0,
        6,
        messages.dayOfWeekInvalid,
      ),
      recurrenceDayOfMonth: optionalIntegerField(
        1,
        31,
        messages.dayOfMonthInvalid,
      ),
      recurrenceMonth: optionalIntegerField(1, 12, messages.monthInvalid),
      recurrenceDay: optionalIntegerField(1, 31, messages.dayInvalid),
    })
    .refine(
      (values) =>
        values.scope !== "EMPLOYEE" || values.employeeId.length > 0,
      {
        message: messages.employeeRequired,
        path: ["employeeId"],
      },
    )
    .refine(
      (values) =>
        values.scope !== "DEPARTMENT" || values.departmentId.length > 0,
      {
        message: messages.departmentRequired,
        path: ["departmentId"],
      },
    )
    .refine(
      (values) =>
        values.endDate === "" || values.endDate >= values.startDate,
      {
        message: messages.dateRangeInvalid,
        path: ["endDate"],
      },
    );
