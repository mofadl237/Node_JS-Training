import { z } from "zod";

export const createDocumentSequenceSchema = z.object({
  documentType: z.string().trim().min(1, "must not be empty"),
  year: z.coerce.number().int(),
  prefix: z.string().trim().min(1, "must not be empty").optional().nullable(),
  nextNumber: z.coerce.number().int().optional(),
  padding: z.coerce.number().int().optional(),
});

export const updateDocumentSequenceSchema = z.object({
  documentType: z.string().trim().min(1, "must not be empty").optional(),
  year: z.coerce.number().int().optional(),
  prefix: z.string().trim().min(1, "must not be empty").optional().nullable(),
  nextNumber: z.coerce.number().int().optional(),
  padding: z.coerce.number().int().optional(),
});

export const documentSequenceIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listDocumentSequenceQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "documentType", "year", "prefix", "nextNumber", "padding", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateDocumentSequenceInput = z.infer<typeof createDocumentSequenceSchema>;
export type IUpdateDocumentSequenceInput = z.infer<typeof updateDocumentSequenceSchema>;
export type IDocumentSequenceIdParam = z.infer<typeof documentSequenceIdParamSchema>;
export type IListDocumentSequenceQuery = z.infer<typeof listDocumentSequenceQuerySchema>;
