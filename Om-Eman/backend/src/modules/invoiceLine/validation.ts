import { z } from "zod";

export const createInvoiceLineSchema = z.object({
  invoiceId: z.string().trim().min(1, "must not be empty"),
  orderItemId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  productPackageId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  descriptionAr: z.string().trim().min(1, "must not be empty"),
  descriptionEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sku: z.string().trim().min(1, "must not be empty"),
  quantity: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]),
  unitPrice: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]),
  discountAmount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  taxRate: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  taxAmount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  lineTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]),
});

export const updateInvoiceLineSchema = z.object({
  invoiceId: z.string().trim().min(1, "must not be empty").optional(),
  orderItemId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  productPackageId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  descriptionAr: z.string().trim().min(1, "must not be empty").optional(),
  descriptionEn: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sku: z.string().trim().min(1, "must not be empty").optional(),
  quantity: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  unitPrice: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  discountAmount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  taxRate: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  taxAmount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  lineTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
});

export const invoiceLineIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listInvoiceLineQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "invoiceId", "orderItemId", "productPackageId", "descriptionAr", "descriptionEn", "sku", "quantity", "unitPrice", "discountAmount", "taxRate", "taxAmount", "lineTotal", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateInvoiceLineInput = z.infer<typeof createInvoiceLineSchema>;
export type IUpdateInvoiceLineInput = z.infer<typeof updateInvoiceLineSchema>;
export type IInvoiceLineIdParam = z.infer<typeof invoiceLineIdParamSchema>;
export type IListInvoiceLineQuery = z.infer<typeof listInvoiceLineQuerySchema>;
