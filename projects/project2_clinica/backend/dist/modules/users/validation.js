import { z } from "zod";
export const updateUserSchema = z
    .object({
    name: z.string().trim().min(1, "name is required").optional(),
    phone: z.string().trim().max(20, "phone must not exceed 20 characters").nullable().optional(),
    password: z.string().min(6, "password must be at least 6 characters").optional(),
    role: z.enum(["PATIENT", "DOCTOR", "ADMIN"]).optional(),
})
    .refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided" });
export const userIdParamSchema = z.object({
    id: z.string("id is required").trim().min(1, "id is required"),
});
export const listUsersQuerySchema = z.object({
    q: z.string().trim().min(1).max(100).optional(),
    role: z.enum(["PATIENT", "DOCTOR", "ADMIN"]).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sortBy: z.enum(["name", "email", "role", "createdAt", "updatedAt"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
//# sourceMappingURL=validation.js.map