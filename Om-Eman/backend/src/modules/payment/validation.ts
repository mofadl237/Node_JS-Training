import { z } from "zod";

export const createPaymentSchema = z.object({
  orderId: z.string().trim().min(1, "must not be empty"),
  method: z.enum(["ONLINE_TRANSFER", "COD"]),
  status: z.enum(["PENDING", "PROOF_UPLOADED", "CONFIRMED", "REJECTED", "CANCELED"]).optional(),
  amount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]),
  proofImageUrl: z.string().trim().url("must be a valid URL").optional().nullable(),
  proofUploadedAt: z.coerce.date().optional().nullable(),
  confirmedAt: z.coerce.date().optional().nullable(),
  confirmedByEmployeeId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  rejectionReason: z.string().trim().min(1, "must not be empty").optional().nullable(),
  transactionReference: z.string().trim().min(1, "must not be empty").optional().nullable(),
  notes: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const updatePaymentSchema = z.object({
  orderId: z.string().trim().min(1, "must not be empty").optional(),
  method: z.enum(["ONLINE_TRANSFER", "COD"]).optional(),
  status: z.enum(["PENDING", "PROOF_UPLOADED", "CONFIRMED", "REJECTED", "CANCELED"]).optional(),
  amount: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  proofImageUrl: z.string().trim().url("must be a valid URL").optional().nullable(),
  proofUploadedAt: z.coerce.date().optional().nullable(),
  confirmedAt: z.coerce.date().optional().nullable(),
  confirmedByEmployeeId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  rejectionReason: z.string().trim().min(1, "must not be empty").optional().nullable(),
  transactionReference: z.string().trim().min(1, "must not be empty").optional().nullable(),
  notes: z.string().trim().min(1, "must not be empty").optional().nullable(),
});

export const paymentIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listPaymentQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "orderId", "method", "status", "amount", "proofImageUrl", "proofUploadedAt", "confirmedAt", "confirmedByEmployeeId", "rejectionReason", "transactionReference", "notes", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type IUpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type IPaymentIdParam = z.infer<typeof paymentIdParamSchema>;
export type IListPaymentQuery = z.infer<typeof listPaymentQuerySchema>;
