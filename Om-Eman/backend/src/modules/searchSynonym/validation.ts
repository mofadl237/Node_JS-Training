import { z } from "zod";

export const createSearchSynonymSchema = z.object({
  groupKey: z.string().trim().min(1, "must not be empty"),
  term: z.string().trim().min(1, "must not be empty"),
  normalizedTerm: z.string().trim().min(1, "must not be empty"),
  language: z.enum(["AR", "EN"]),
  isActive: z.boolean().optional(),
});

export const updateSearchSynonymSchema = z.object({
  groupKey: z.string().trim().min(1, "must not be empty").optional(),
  term: z.string().trim().min(1, "must not be empty").optional(),
  normalizedTerm: z.string().trim().min(1, "must not be empty").optional(),
  language: z.enum(["AR", "EN"]).optional(),
  isActive: z.boolean().optional(),
});

export const searchSynonymIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listSearchSynonymQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "groupKey", "term", "normalizedTerm", "language", "isActive", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateSearchSynonymInput = z.infer<typeof createSearchSynonymSchema>;
export type IUpdateSearchSynonymInput = z.infer<typeof updateSearchSynonymSchema>;
export type ISearchSynonymIdParam = z.infer<typeof searchSynonymIdParamSchema>;
export type IListSearchSynonymQuery = z.infer<typeof listSearchSynonymQuerySchema>;
