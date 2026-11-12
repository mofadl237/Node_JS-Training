import { z } from "zod";

export interface IShiftValidationMessages {
  nameRequired: string;
  nameMin: string;
  nameMax: string;
  timeInvalid: string;
  minutesInvalid: string;
  minutesMax: string;
  hoursInvalid: string;
  hoursMax: string;
}

export interface IShiftFormValues {
  name: string;
  startTime: string;
  endTime: string;
  graceMinutes: string;
  expectedHours: string;
  overtimeAfterMinutes: string;
  isNightShift: boolean;
}

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const MINUTES_PATTERN = /^\d+$/;
const HOURS_PATTERN = /^\d+(\.\d+)?$/;

const timeField = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine((value) => TIME_PATTERN.test(value), { message });

const minutesField = (invalidMessage: string, maxMessage: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || MINUTES_PATTERN.test(value), {
      message: invalidMessage,
    })
    .refine((value) => value === "" || Number(value) <= 1440, {
      message: maxMessage,
    });

const hoursField = (invalidMessage: string, maxMessage: string) =>
  z
    .string()
    .trim()
    .refine(
      (value) => value === "" || (HOURS_PATTERN.test(value) && Number(value) > 0),
      { message: invalidMessage },
    )
    .refine((value) => value === "" || Number(value) <= 24, {
      message: maxMessage,
    });

export const createShiftSchema = (messages: IShiftValidationMessages) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, messages.nameRequired)
      .min(2, messages.nameMin)
      .max(100, messages.nameMax),
    startTime: timeField(messages.timeInvalid),
    endTime: timeField(messages.timeInvalid),
    graceMinutes: minutesField(messages.minutesInvalid, messages.minutesMax),
    expectedHours: hoursField(messages.hoursInvalid, messages.hoursMax),
    overtimeAfterMinutes: minutesField(
      messages.minutesInvalid,
      messages.minutesMax,
    ),
    isNightShift: z.boolean(),
  });
