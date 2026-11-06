import { z } from "zod";
const MAX_REPORT_RANGE_DAYS = 366;
export const dashboardQuerySchema = z
    .object({
    from: z.coerce.date({ error: "from must be a valid date" }).optional(),
    to: z.coerce.date({ error: "to must be a valid date" }).optional(),
    departmentId: z
        .string()
        .trim()
        .uuid("departmentId must be a valid uuid")
        .optional(),
    employeeId: z
        .string()
        .trim()
        .uuid("employeeId must be a valid uuid")
        .optional(),
})
    .refine((data) => !data.from || !data.to || data.from <= data.to, {
    message: "from must be before or equal to to",
    path: ["from"],
})
    .refine((data) => !data.from ||
    !data.to ||
    Math.floor((data.to.getTime() - data.from.getTime()) / 86_400_000) <=
        MAX_REPORT_RANGE_DAYS, {
    message: `date range must not exceed ${MAX_REPORT_RANGE_DAYS} days`,
    path: ["to"],
});
//# sourceMappingURL=validation.js.map