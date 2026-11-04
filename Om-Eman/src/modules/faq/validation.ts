import { z } from "zod";

export const createFaqSchema = z.object({
  questionAr: z.string().trim().min(1, "must not be empty"),
  questionEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  answerAr: z.string().trim().min(1, "must not be empty"),
  answerEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  category: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const updateFaqSchema = z.object({
  questionAr: z.string().trim().min(1, "must not be empty").optional(),
  questionEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  answerAr: z.string().trim().min(1, "must not be empty").optional(),
  answerEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  category: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const faqIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listFaqQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "questionAr", "questionEn", "answerAr", "answerEn", "category", "sortOrder", "isActive", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateFaqInput = z.infer<typeof createFaqSchema>;
export type IUpdateFaqInput = z.infer<typeof updateFaqSchema>;
export type IFaqIdParam = z.infer<typeof faqIdParamSchema>;
export type IListFaqQuery = z.infer<typeof listFaqQuerySchema>;
