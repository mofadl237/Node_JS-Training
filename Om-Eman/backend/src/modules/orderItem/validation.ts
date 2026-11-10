import { z } from "zod";

export const createOrderItemSchema = z.object({
  orderId: z.string().trim().min(1, "must not be empty"),
  productId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  productPackageId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  productNameArSnapshot: z.string().trim().min(1, "must not be empty"),
  productNameEnSnapshot: z.string().trim().min(1, "must not be empty").optional().nullable(),
  packageNameArSnapshot: z.string().trim().min(1, "must not be empty").optional().nullable(),
  packageNameEnSnapshot: z.string().trim().min(1, "must not be empty").optional().nullable(),
  skuSnapshot: z.string().trim().min(1, "must not be empty"),
  quantity: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]),
  unitPrice: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]),
  discountAmount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  taxRateSnapshot: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  taxAmount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  lineTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]),
  bundleSnapshot: z.unknown().optional().nullable(),
});

export const updateOrderItemSchema = z.object({
  orderId: z.string().trim().min(1, "must not be empty").optional(),
  productId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  productPackageId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  productNameArSnapshot: z.string().trim().min(1, "must not be empty").optional(),
  productNameEnSnapshot: z.string().trim().min(1, "must not be empty").optional().nullable(),
  packageNameArSnapshot: z.string().trim().min(1, "must not be empty").optional().nullable(),
  packageNameEnSnapshot: z.string().trim().min(1, "must not be empty").optional().nullable(),
  skuSnapshot: z.string().trim().min(1, "must not be empty").optional(),
  quantity: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  unitPrice: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  discountAmount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  taxRateSnapshot: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  taxAmount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  lineTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  bundleSnapshot: z.unknown().optional().nullable(),
});

export const orderItemIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listOrderItemQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "orderId", "productId", "productPackageId", "productNameArSnapshot", "productNameEnSnapshot", "packageNameArSnapshot", "packageNameEnSnapshot", "skuSnapshot", "quantity", "unitPrice", "discountAmount", "taxRateSnapshot", "taxAmount", "lineTotal", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateOrderItemInput = z.infer<typeof createOrderItemSchema>;
export type IUpdateOrderItemInput = z.infer<typeof updateOrderItemSchema>;
export type IOrderItemIdParam = z.infer<typeof orderItemIdParamSchema>;
export type IListOrderItemQuery = z.infer<typeof listOrderItemQuerySchema>;
