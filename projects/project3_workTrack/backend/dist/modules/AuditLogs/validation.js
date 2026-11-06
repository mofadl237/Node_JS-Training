import { z } from "zod";
const isValidDate = (value) => !Number.isNaN(new Date(value).getTime());
export const createAuditLogSchema = z.object({
    action: z
        .string("action is required")
        .trim()
        .min(1, "action is required")
        .max(50, "action must not exceed 50 characters"),
    entity: z
        .string("entity is required")
        .trim()
        .min(1, "entity is required")
        .max(100, "entity must not exceed 100 characters"),
    entityId: z
        .string()
        .trim()
        .min(1, "entityId must not be empty")
        .max(100, "entityId must not exceed 100 characters")
        .optional()
        .nullable(),
    userId: z
        .string()
        .trim()
        .uuid("userId must be a valid uuid")
        .optional()
        .nullable(),
    details: z.record(z.string(), z.unknown()).optional().nullable(),
});
export const auditLogIdParamSchema = z.object({
    id: z.string("id is required").trim().min(1, "id is required"),
});
export const listAuditLogsQuerySchema = z
    .object({
    q: z.string().trim().min(1).max(100).optional(),
    userId: z.string().trim().uuid("userId must be a valid uuid").optional(),
    action: z.string().trim().min(1).max(50).optional(),
    entity: z.string().trim().min(1).max(100).optional(),
    entityId: z.string().trim().min(1).max(100).optional(),
    from: z
        .string()
        .trim()
        .min(1)
        .refine(isValidDate, "from must be a valid ISO date")
        .optional(),
    to: z
        .string()
        .trim()
        .min(1)
        .refine(isValidDate, "to must be a valid ISO date")
        .optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sortBy: z.enum(["createdAt", "action", "entity"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
})
    .refine((data) => !data.from || !data.to || new Date(data.from) <= new Date(data.to), {
    message: "from must be before or equal to to",
    path: ["from"],
});
//# sourceMappingURL=validation.js.map