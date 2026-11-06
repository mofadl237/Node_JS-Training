import { z } from "zod";

const leaveTypeSchema = z.enum([
  "ANNUAL",
  "SICK",
  "UNPAID",
  "ABSENCE",
  "OFFICIAL_HOLIDAY",
  "WEEKEND",
  "CUSTOM",
]);

const leaveScopeSchema = z.enum(["ALL", "DEPARTMENT", "EMPLOYEE"]);

const leaveRecurrenceSchema = z.enum(["NONE", "WEEKLY", "MONTHLY", "YEARLY"]);

const leaveNameSchema = z
  .string("name is required")
  .trim()
  .min(2, "name must be at least 2 characters")
  .max(100, "name must not exceed 100 characters");

const leaveDescriptionSchema = z
  .string()
  .trim()
  .max(500, "description must not exceed 500 characters")
  .optional()
  .nullable();

const employeeIdSchema = z
  .string()
  .trim()
  .uuid("employeeId must be a valid uuid")
  .optional()
  .nullable();

const departmentIdSchema = z
  .string()
  .trim()
  .uuid("departmentId must be a valid uuid")
  .optional()
  .nullable();

const startDateSchema = z.coerce.date({ error: "startDate must be a valid date" });

const endDateSchema = z.coerce
  .date({ error: "endDate must be a valid date" })
  .optional()
  .nullable();

const recurrenceDayOfWeekSchema = z.coerce
  .number()
  .int("recurrenceDayOfWeek must be an integer")
  .min(0, "recurrenceDayOfWeek must be between 0 and 6")
  .max(6, "recurrenceDayOfWeek must be between 0 and 6")
  .optional()
  .nullable();

const recurrenceDayOfMonthSchema = z.coerce
  .number()
  .int("recurrenceDayOfMonth must be an integer")
  .min(1, "recurrenceDayOfMonth must be between 1 and 31")
  .max(31, "recurrenceDayOfMonth must be between 1 and 31")
  .optional()
  .nullable();

const recurrenceMonthSchema = z.coerce
  .number()
  .int("recurrenceMonth must be an integer")
  .min(1, "recurrenceMonth must be between 1 and 12")
  .max(12, "recurrenceMonth must be between 1 and 12")
  .optional()
  .nullable();

const recurrenceDaySchema = z.coerce
  .number()
  .int("recurrenceDay must be an integer")
  .min(1, "recurrenceDay must be between 1 and 31")
  .max(31, "recurrenceDay must be between 1 and 31")
  .optional()
  .nullable();

const leaveFields = {
  name: leaveNameSchema,
  description: leaveDescriptionSchema,
  type: leaveTypeSchema,
  scope: leaveScopeSchema,
  employeeId: employeeIdSchema,
  departmentId: departmentIdSchema,
  startDate: startDateSchema,
  endDate: endDateSchema,
  isPaid: z.boolean().optional(),
  isDeductible: z.boolean().optional(),
  isActive: z.boolean().optional(),
  recurrence: leaveRecurrenceSchema,
  recurrenceDayOfWeek: recurrenceDayOfWeekSchema,
  recurrenceDayOfMonth: recurrenceDayOfMonthSchema,
  recurrenceMonth: recurrenceMonthSchema,
  recurrenceDay: recurrenceDaySchema,
};

export const createLeaveSchema = z
  .object({
    ...leaveFields,
    scope: leaveScopeSchema.default("ALL"),
    recurrence: leaveRecurrenceSchema.default("NONE"),
  })
  .refine((data) => data.scope !== "EMPLOYEE" || Boolean(data.employeeId), {
    message: "employeeId is required when scope is EMPLOYEE",
    path: ["employeeId"],
  })
  .refine((data) => data.scope !== "DEPARTMENT" || Boolean(data.departmentId), {
    message: "departmentId is required when scope is DEPARTMENT",
    path: ["departmentId"],
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "endDate must be after or equal to startDate",
    path: ["endDate"],
  });

export const updateLeaveSchema = z
  .object({
    name: leaveNameSchema.optional(),
    description: leaveDescriptionSchema,
    type: leaveTypeSchema.optional(),
    scope: leaveScopeSchema.optional(),
    employeeId: employeeIdSchema,
    departmentId: departmentIdSchema,
    startDate: startDateSchema.optional(),
    endDate: endDateSchema,
    isPaid: z.boolean().optional(),
    isDeductible: z.boolean().optional(),
    isActive: z.boolean().optional(),
    recurrence: leaveRecurrenceSchema.optional(),
    recurrenceDayOfWeek: recurrenceDayOfWeekSchema,
    recurrenceDayOfMonth: recurrenceDayOfMonthSchema,
    recurrenceMonth: recurrenceMonthSchema,
    recurrenceDay: recurrenceDaySchema,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const leaveIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listLeavesQuerySchema = z
  .object({
    q: z.string().trim().min(1).max(100).optional(),
    type: leaveTypeSchema.optional(),
    scope: leaveScopeSchema.optional(),
    employeeId: z.string().trim().uuid("employeeId must be a valid uuid").optional(),
    departmentId: z.string().trim().uuid("departmentId must be a valid uuid").optional(),
    recurrence: leaveRecurrenceSchema.optional(),
    isActive: z.enum(["true", "false"]).optional(),
    from: z.coerce.date({ error: "from must be a valid date" }).optional(),
    to: z.coerce.date({ error: "to must be a valid date" }).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sortBy: z
      .enum(["name", "startDate", "endDate", "createdAt", "updatedAt"])
      .default("startDate"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
  })
  .refine((data) => !data.from || !data.to || data.from <= data.to, {
    message: "from must be before or equal to to",
    path: ["from"],
  });

export const leaveCalendarQuerySchema = z
  .object({
    from: z.coerce.date({ error: "from must be a valid date" }),
    to: z.coerce.date({ error: "to must be a valid date" }),
    employeeId: z.string().trim().uuid("employeeId must be a valid uuid").optional(),
    departmentId: z.string().trim().uuid("departmentId must be a valid uuid").optional(),
  })
  .refine((data) => data.from <= data.to, {
    message: "from must be before or equal to to",
    path: ["from"],
  })
  .refine(
    (data) =>
      Math.floor((data.to.getTime() - data.from.getTime()) / 86_400_000) <= 3660,
    {
      message: "date range must not exceed 3660 days",
      path: ["to"],
    },
  );

export const leaveCheckQuerySchema = z.object({
  date: z.coerce.date({ error: "date must be a valid date" }),
  employeeId: z.string().trim().uuid("employeeId must be a valid uuid").optional(),
  departmentId: z.string().trim().uuid("departmentId must be a valid uuid").optional(),
});

export type ICreateLeaveInput = z.infer<typeof createLeaveSchema>;
export type IUpdateLeaveInput = z.infer<typeof updateLeaveSchema>;
export type ILeaveIdParam = z.infer<typeof leaveIdParamSchema>;
export type IListLeavesQuery = z.infer<typeof listLeavesQuerySchema>;
export type ILeaveCalendarQuery = z.infer<typeof leaveCalendarQuerySchema>;
export type ILeaveCheckQuery = z.infer<typeof leaveCheckQuerySchema>;
