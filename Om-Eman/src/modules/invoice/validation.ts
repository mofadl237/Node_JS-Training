import { z } from "zod";

export const createInvoiceSchema = z.object({
  invoiceNumber: z.string().trim().min(1, "must not be empty"),
  orderId: z.string().trim().min(1, "must not be empty"),
  status: z.enum(["ISSUED", "VOID"]).optional(),
  issuedAt: z.coerce.date().optional(),
  issuedByEmployeeId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sellerName: z.string().trim().min(1, "must not be empty"),
  sellerTaxNumber: z.string().trim().min(1, "must not be empty").optional().nullable(),
  customerName: z.string().trim().min(1, "must not be empty"),
  customerPhone: z.string().trim().min(1, "must not be empty"),
  customerEmail: z.string().trim().email("must be a valid email address").toLowerCase().optional().nullable(),
  addressSnapshot: z.unknown().optional().nullable(),
  subtotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]),
  discountTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  shippingTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  taxTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  grandTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]),
  taxRateSnapshot: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  taxAmount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  notes: z.string().trim().min(1, "must not be empty").optional().nullable(),
  voidedAt: z.coerce.date().optional().nullable(),
  voidReason: z.string().trim().min(1, "must not be empty").optional().nullable(),
  pdfUrl: z.string().trim().url("must be a valid URL").optional().nullable(),
  pdfGeneratedAt: z.coerce.date().optional().nullable(),
});

export const updateInvoiceSchema = z.object({
  invoiceNumber: z.string().trim().min(1, "must not be empty").optional(),
  orderId: z.string().trim().min(1, "must not be empty").optional(),
  status: z.enum(["ISSUED", "VOID"]).optional(),
  issuedAt: z.coerce.date().optional(),
  issuedByEmployeeId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  sellerName: z.string().trim().min(1, "must not be empty").optional(),
  sellerTaxNumber: z.string().trim().min(1, "must not be empty").optional().nullable(),
  customerName: z.string().trim().min(1, "must not be empty").optional(),
  customerPhone: z.string().trim().min(1, "must not be empty").optional(),
  customerEmail: z.string().trim().email("must be a valid email address").toLowerCase().optional().nullable(),
  addressSnapshot: z.unknown().optional().nullable(),
  subtotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  discountTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  shippingTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  taxTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  grandTotal: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  taxRateSnapshot: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional().nullable(),
  taxAmount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  notes: z.string().trim().min(1, "must not be empty").optional().nullable(),
  voidedAt: z.coerce.date().optional().nullable(),
  voidReason: z.string().trim().min(1, "must not be empty").optional().nullable(),
  pdfUrl: z.string().trim().url("must be a valid URL").optional().nullable(),
  pdfGeneratedAt: z.coerce.date().optional().nullable(),
});

export const invoiceIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listInvoiceQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "invoiceNumber", "orderId", "status", "issuedAt", "issuedByEmployeeId", "sellerName", "sellerTaxNumber", "customerName", "customerPhone", "customerEmail", "subtotal", "discountTotal", "shippingTotal", "taxTotal", "grandTotal", "taxRateSnapshot", "taxAmount", "notes", "voidedAt", "voidReason", "pdfUrl", "pdfGeneratedAt", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type IUpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type IInvoiceIdParam = z.infer<typeof invoiceIdParamSchema>;
export type IListInvoiceQuery = z.infer<typeof listInvoiceQuerySchema>;
