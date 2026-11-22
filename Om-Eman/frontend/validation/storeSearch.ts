import { z } from "zod";
import { productCardSchema } from "./storeProduct";

export const SEARCH_LIMIT_DEFAULT = 20;

export const searchTextSchema = z.string().trim().min(1).max(200);
export const searchLimitSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(50)
  .default(SEARCH_LIMIT_DEFAULT);
export const searchQuerySchema = z.object({
  q: searchTextSchema,
  limit: searchLimitSchema,
});

const searchResultRowSchema = productCardSchema.extend({
  matchTier: z.number().int(),
  score: z.number(),
  matchedTerm: z.string().nullable(),
});

export const storeSearchResponseSchema = z.object({
  results: z.array(searchResultRowSchema),
  suggestions: z.array(productCardSchema),
  searchLogId: z.string().nullable(),
});
