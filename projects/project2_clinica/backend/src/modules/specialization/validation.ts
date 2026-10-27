import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createSpecializationSchema = z.object({
  name: z.string("name is required").trim().min(2, "name must be at least 2 characters").max(100, "name must not exceed 100 characters"),
  slug: z.string("slug is required").trim().toLowerCase().regex(slugRegex, "slug must be lowercase letters, numbers and hyphens only"),
  description: z.string().trim().max(500, "description must not exceed 500 characters").optional(),
  isActive: z.boolean().optional(),
});

export const updateSpecializationSchema = z.object({
  name: z.string().trim().min(2, "name must be at least 2 characters").max(100, "name must not exceed 100 characters").optional(),
  slug: z.string().trim().toLowerCase().regex(slugRegex, "slug must be lowercase letters, numbers and hyphens only").optional(),
  description: z.string().trim().max(500, "description must not exceed 500 characters").optional().nullable(),
  isActive: z.boolean().optional(),
});

export const specializationIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listSpecializationsQuerySchema = z.object({
  q: z.string().trim().min(1).max(100).optional(),
  isActive: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["name", "createdAt", "updatedAt"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type ICreateSpecializationInput = z.infer<typeof createSpecializationSchema>;
export type IUpdateSpecializationInput = z.infer<typeof updateSpecializationSchema>;
export type ISpecializationIdParam = z.infer<typeof specializationIdParamSchema>;
export type IListSpecializationsQuery = z.infer<typeof listSpecializationsQuerySchema>;
