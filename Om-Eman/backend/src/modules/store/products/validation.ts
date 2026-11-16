import { z } from "zod";

export const slugParamSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "slug is invalid"),
});

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Query booleans arrive as strings; z.coerce.boolean() would turn "false"
// into true, so parse the literal strings instead.
const booleanQuery = z
  .enum(["true", "false"])
  .transform((value) => value === "true")
  .optional();

export const listStoreProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  // Cards are image-heavy; keep pages small for LCP.
  limit: z.coerce.number().int().positive().max(48).default(12),
  category: z
    .string()
    .trim()
    .max(200)
    .regex(SLUG_PATTERN, "category slug is invalid")
    .optional(),
  subcategory: z
    .string()
    .trim()
    .max(200)
    .regex(SLUG_PATTERN, "subcategory slug is invalid")
    .optional(),
  featured: booleanQuery,
  inStock: booleanQuery,
  minPrice: z.coerce.number().nonnegative().max(1_000_000).optional(),
  maxPrice: z.coerce.number().nonnegative().max(1_000_000).optional(),
  sort: z
    .enum(["newest", "price_asc", "price_desc", "name"])
    .default("newest"),
});

export type IListStoreProductsQuery = z.infer<typeof listStoreProductsQuerySchema>;
export type TProductListSort = IListStoreProductsQuery["sort"];
