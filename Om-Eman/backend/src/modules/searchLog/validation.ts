import { z } from "zod";

export const createSearchLogSchema = z.object({
  rawQuery: z.string().trim().min(1, "must not be empty"),
  normalizedQuery: z.string().trim().min(1, "must not be empty"),
  resultCount: z.coerce.number().int(),
  customerId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sessionId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  clickedProductId: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const updateSearchLogSchema = z.object({
  rawQuery: z.string().trim().min(1, "must not be empty").optional(),
  normalizedQuery: z.string().trim().min(1, "must not be empty").optional(),
  resultCount: z.coerce.number().int().optional(),
  customerId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sessionId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  clickedProductId: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const searchLogIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listSearchLogQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "rawQuery", "normalizedQuery", "resultCount", "customerId", "sessionId", "clickedProductId", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateSearchLogInput = z.infer<typeof createSearchLogSchema>;
export type IUpdateSearchLogInput = z.infer<typeof updateSearchLogSchema>;
export type ISearchLogIdParam = z.infer<typeof searchLogIdParamSchema>;
export type IListSearchLogQuery = z.infer<typeof listSearchLogQuerySchema>;
