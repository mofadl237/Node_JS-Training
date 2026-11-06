import { z } from "zod";
const departmentNameSchema = z
    .string("name is required")
    .trim()
    .min(2, "name must be at least 2 characters")
    .max(100, "name must not exceed 100 characters");
const departmentDescriptionSchema = z
    .string()
    .trim()
    .max(500, "description must not exceed 500 characters");
export const createDepartmentSchema = z.object({
    name: departmentNameSchema,
    description: departmentDescriptionSchema.optional(),
});
export const updateDepartmentSchema = z
    .object({
    name: departmentNameSchema.optional(),
    description: departmentDescriptionSchema.optional().nullable(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
});
export const departmentIdParamSchema = z.object({
    id: z.string("id is required").trim().min(1, "id is required"),
});
export const listDepartmentsQuerySchema = z.object({
    q: z.string().trim().min(1).max(100).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sortBy: z.enum(["name", "createdAt", "updatedAt"]).default("name"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
});
//# sourceMappingURL=validation.js.map