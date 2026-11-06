import { z } from "zod";
const isValidDate = (value) => !Number.isNaN(new Date(value).getTime());
const isDateOnly = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime());
const nonNegativeMinutes = (field) => z.coerce
    .number()
    .int(`${field} must be an integer`)
    .min(0, `${field} must be zero or greater`)
    .max(10080, `${field} must not exceed 10080`);
const dateRangeRefine = (data) => !data.from || !data.to || new Date(data.from) <= new Date(data.to);
export const attendanceLogIdParamSchema = z.object({
    id: z.string("id is required").trim().min(1, "id is required"),
});
export const createAttendanceLogSchema = z.object({
    employeeId: z.string("employeeId is required").trim().uuid("employeeId must be a valid uuid"),
    type: z.enum(["CHECK_IN", "CHECK_OUT"]),
    timestamp: z.coerce.date({ error: "timestamp must be a valid date" }),
    source: z.enum(["MANUAL", "CSV", "SYSTEM"]).optional(),
});
export const listAttendanceLogsQuerySchema = z
    .object({
    employeeId: z.string().trim().uuid("employeeId must be a valid uuid").optional(),
    departmentId: z.string().trim().uuid("departmentId must be a valid uuid").optional(),
    type: z.enum(["CHECK_IN", "CHECK_OUT"]).optional(),
    source: z.enum(["MANUAL", "CSV", "SYSTEM"]).optional(),
    from: z.string().trim().min(1).refine(isValidDate, "from must be a valid ISO date").optional(),
    to: z.string().trim().min(1).refine(isValidDate, "to must be a valid ISO date").optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sortBy: z.enum(["timestamp", "createdAt"]).default("timestamp"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
})
    .refine(dateRangeRefine, {
    message: "from must be before or equal to to",
    path: ["from"],
});
export const attendanceRecordIdParamSchema = z.object({
    id: z.string("id is required").trim().min(1, "id is required"),
});
export const createAttendanceRecordSchema = z
    .object({
    employeeId: z.string("employeeId is required").trim().uuid("employeeId must be a valid uuid"),
    shiftId: z.string().trim().uuid("shiftId must be a valid uuid").optional().nullable(),
    date: z.coerce.date({ error: "date must be a valid date" }),
    checkIn: z.coerce.date({ error: "checkIn must be a valid date" }).optional().nullable(),
    checkOut: z.coerce.date({ error: "checkOut must be a valid date" }).optional().nullable(),
    status: z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY", "ON_LEAVE"]).optional(),
    workingMinutes: nonNegativeMinutes("workingMinutes").optional(),
    lateMinutes: nonNegativeMinutes("lateMinutes").optional(),
    earlyLeaveMinutes: nonNegativeMinutes("earlyLeaveMinutes").optional(),
    overtimeMinutes: nonNegativeMinutes("overtimeMinutes").optional(),
    notes: z.string().trim().max(1000, "notes must not exceed 1000 characters").optional().nullable(),
    processedAt: z.coerce.date({ error: "processedAt must be a valid date" }).optional().nullable(),
})
    .refine((data) => !data.checkIn || !data.checkOut || data.checkOut >= data.checkIn, {
    message: "checkOut must be after or equal to checkIn",
    path: ["checkOut"],
});
export const updateAttendanceRecordSchema = z
    .object({
    employeeId: z.string().trim().uuid("employeeId must be a valid uuid").optional(),
    shiftId: z.string().trim().uuid("shiftId must be a valid uuid").optional().nullable(),
    date: z.coerce.date({ error: "date must be a valid date" }).optional(),
    checkIn: z.coerce.date({ error: "checkIn must be a valid date" }).optional().nullable(),
    checkOut: z.coerce.date({ error: "checkOut must be a valid date" }).optional().nullable(),
    status: z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY", "ON_LEAVE"]).optional(),
    workingMinutes: nonNegativeMinutes("workingMinutes").optional(),
    lateMinutes: nonNegativeMinutes("lateMinutes").optional(),
    earlyLeaveMinutes: nonNegativeMinutes("earlyLeaveMinutes").optional(),
    overtimeMinutes: nonNegativeMinutes("overtimeMinutes").optional(),
    notes: z.string().trim().max(1000, "notes must not exceed 1000 characters").optional().nullable(),
    processedAt: z.coerce.date({ error: "processedAt must be a valid date" }).optional().nullable(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
});
export const listAttendanceRecordsQuerySchema = z
    .object({
    employeeId: z.string().trim().uuid("employeeId must be a valid uuid").optional(),
    departmentId: z.string().trim().uuid("departmentId must be a valid uuid").optional(),
    shiftId: z.string().trim().uuid("shiftId must be a valid uuid").optional(),
    status: z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY", "ON_LEAVE"]).optional(),
    from: z.string().trim().min(1).refine(isValidDate, "from must be a valid ISO date").optional(),
    to: z.string().trim().min(1).refine(isValidDate, "to must be a valid ISO date").optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sortBy: z.enum(["date", "createdAt", "updatedAt"]).default("date"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
})
    .refine(dateRangeRefine, {
    message: "from must be before or equal to to",
    path: ["from"],
});
const MAX_PROCESS_RANGE_DAYS = 31;
const dateOnlyDiffInDays = (from, to) => Math.round((new Date(`${to}T00:00:00.000Z`).getTime() -
    new Date(`${from}T00:00:00.000Z`).getTime()) /
    86_400_000);
export const processAttendanceSchema = z
    .object({
    date: z
        .string()
        .trim()
        .refine(isDateOnly, "date must be in YYYY-MM-DD format")
        .optional(),
    from: z
        .string()
        .trim()
        .refine(isDateOnly, "from must be in YYYY-MM-DD format")
        .optional(),
    to: z
        .string()
        .trim()
        .refine(isDateOnly, "to must be in YYYY-MM-DD format")
        .optional(),
    employeeIds: z
        .array(z.string().trim().uuid("employeeIds must contain valid uuids"))
        .max(500, "employeeIds must not contain more than 500 items")
        .optional(),
})
    .refine((data) => Boolean(data.date) || (Boolean(data.from) && Boolean(data.to)), {
    message: "date or from and to are required",
    path: ["date"],
})
    .refine((data) => !data.date || (!data.from && !data.to), {
    message: "Provide either date or from/to, not both",
    path: ["date"],
})
    .refine((data) => !data.from || !data.to || data.from <= data.to, {
    message: "from must be before or equal to to",
    path: ["from"],
})
    .refine((data) => !data.from ||
    !data.to ||
    dateOnlyDiffInDays(data.from, data.to) <= MAX_PROCESS_RANGE_DAYS, {
    message: `date range must not exceed ${MAX_PROCESS_RANGE_DAYS} days`,
    path: ["to"],
});
//# sourceMappingURL=validation.js.map