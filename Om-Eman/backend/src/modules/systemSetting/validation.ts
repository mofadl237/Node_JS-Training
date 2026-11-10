import { z } from "zod";

export const createSystemSettingSchema = z.object({
  key: z.string().trim().min(1, "must not be empty"),
  value: z.unknown(),
  description: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const updateSystemSettingSchema = z.object({
  key: z.string().trim().min(1, "must not be empty").optional(),
  value: z.unknown().optional(),
  description: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const systemSettingIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listSystemSettingQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "key", "description", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateSystemSettingInput = z.infer<typeof createSystemSettingSchema>;
export type IUpdateSystemSettingInput = z.infer<typeof updateSystemSettingSchema>;
export type ISystemSettingIdParam = z.infer<typeof systemSettingIdParamSchema>;
export type IListSystemSettingQuery = z.infer<typeof listSystemSettingQuerySchema>;
