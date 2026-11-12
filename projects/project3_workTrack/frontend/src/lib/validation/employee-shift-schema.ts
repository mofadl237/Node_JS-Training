import { z } from "zod";

export interface IEmployeeShiftValidationMessages {
  employeeRequired: string;
  shiftRequired: string;
  startDateRequired: string;
  dateRangeInvalid: string;
}

export interface IEmployeeShiftFormValues {
  employeeId: string;
  shiftId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export const createEmployeeShiftSchema = (
  messages: IEmployeeShiftValidationMessages,
) =>
  z
    .object({
      employeeId: z.string().trim().min(1, messages.employeeRequired),
      shiftId: z.string().trim().min(1, messages.shiftRequired),
      startDate: z.string().trim().min(1, messages.startDateRequired),
      endDate: z.string().trim(),
      isActive: z.boolean(),
    })
    .refine(
      (values) =>
        values.endDate === "" || values.endDate >= values.startDate,
      {
        message: messages.dateRangeInvalid,
        path: ["endDate"],
      },
    );
