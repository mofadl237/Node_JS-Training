import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const shiftNameSchema = z
  .string("name is required")
  .trim()
  .min(2, "name must be at least 2 characters")
  .max(100, "name must not exceed 100 characters");

const timeSchema = (field: string) =>
  z
    .string(`${field} is required`)
    .trim()
    .regex(timeRegex, `${field} must be in HH:mm format`);

const nonNegativeMinutes = (field: string) =>
  z.coerce
    .number()
    .int(`${field} must be an integer`)
    .min(0, `${field} must be zero or greater`)
    .max(1440, `${field} must not exceed 1440`);

const isValidDate = (value: string) => !Number.isNaN(new Date(value).getTime());

export const createShiftSchema = z.object({
  name: shiftNameSchema,
  startTime: timeSchema("startTime"),
  endTime: timeSchema("endTime"),
  graceMinutes: nonNegativeMinutes("graceMinutes").optional(),
  expectedHours: z.coerce
    .number()
    .positive("expectedHours must be greater than zero")
    .max(24, "expectedHours must not exceed 24")
    .optional(),
  overtimeAfterMinutes: nonNegativeMinutes("overtimeAfterMinutes").optional(),
  isNightShift: z.boolean().optional(),
});

export const updateShiftSchema = z
  .object({
    name: shiftNameSchema.optional(),
    startTime: timeSchema("startTime").optional(),
    endTime: timeSchema("endTime").optional(),
    graceMinutes: nonNegativeMinutes("graceMinutes").optional(),
    expectedHours: z.coerce
      .number()
      .positive("expectedHours must be greater than zero")
      .max(24, "expectedHours must not exceed 24")
      .optional(),
    overtimeAfterMinutes: nonNegativeMinutes("overtimeAfterMinutes").optional(),
    isNightShift: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const shiftIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listShiftsQuerySchema = z.object({
  q: z.string().trim().min(1).max(100).optional(),
  isNightShift: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["name", "startTime", "createdAt", "updatedAt"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const createEmployeeShiftSchema = z
  .object({
    employeeId: z.string("employeeId is required").trim().uuid("employeeId must be a valid uuid"),
    shiftId: z.string("shiftId is required").trim().uuid("shiftId must be a valid uuid"),
    startDate: z.coerce.date({ error: "startDate must be a valid date" }),
    endDate: z.coerce.date({ error: "endDate must be a valid date" }).optional().nullable(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "endDate must be after or equal to startDate",
    path: ["endDate"],
  });

export const updateEmployeeShiftSchema = z
  .object({
    employeeId: z.string().trim().uuid("employeeId must be a valid uuid").optional(),
    shiftId: z.string().trim().uuid("shiftId must be a valid uuid").optional(),
    startDate: z.coerce.date({ error: "startDate must be a valid date" }).optional(),
    endDate: z.coerce.date({ error: "endDate must be a valid date" }).optional().nullable(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const employeeShiftIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listEmployeeShiftsQuerySchema = z
  .object({
    employeeId: z.string().trim().uuid("employeeId must be a valid uuid").optional(),
    shiftId: z.string().trim().uuid("shiftId must be a valid uuid").optional(),
    isActive: z.enum(["true", "false"]).optional(),
    from: z.string().trim().min(1).refine(isValidDate, "from must be a valid ISO date").optional(),
    to: z.string().trim().min(1).refine(isValidDate, "to must be a valid ISO date").optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sortBy: z.enum(["startDate", "endDate", "createdAt", "updatedAt"]).default("startDate"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .refine((data) => !data.from || !data.to || new Date(data.from) <= new Date(data.to), {
    message: "from must be before or equal to to",
    path: ["from"],
  });

export type ICreateShiftInput = z.infer<typeof createShiftSchema>;
export type IUpdateShiftInput = z.infer<typeof updateShiftSchema>;
export type IShiftIdParam = z.infer<typeof shiftIdParamSchema>;
export type IListShiftsQuery = z.infer<typeof listShiftsQuerySchema>;
export type ICreateEmployeeShiftInput = z.infer<typeof createEmployeeShiftSchema>;
export type IUpdateEmployeeShiftInput = z.infer<typeof updateEmployeeShiftSchema>;
export type IEmployeeShiftIdParam = z.infer<typeof employeeShiftIdParamSchema>;
export type IListEmployeeShiftsQuery = z.infer<typeof listEmployeeShiftsQuerySchema>;
