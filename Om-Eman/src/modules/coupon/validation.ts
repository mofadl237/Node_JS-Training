import { z } from "zod";

export const createCouponSchema = z.object({
  promotionId: z.string().trim().min(1, "must not be empty"),
  code: z.string().trim().min(1, "must not be empty"),
  customerId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  usageLimit: z.coerce.number().int().optional().nullable(),
  perCustomerLimit: z.coerce.number().int().optional().nullable(),
  startsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const updateCouponSchema = z.object({
  promotionId: z.string().trim().min(1, "must not be empty").optional(),
  code: z.string().trim().min(1, "must not be empty").optional(),
  customerId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  usageLimit: z.coerce.number().int().optional().nullable(),
  perCustomerLimit: z.coerce.number().int().optional().nullable(),
  startsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const couponIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listCouponQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "promotionId", "code", "customerId", "usageLimit", "perCustomerLimit", "startsAt", "endsAt", "isActive", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateCouponInput = z.infer<typeof createCouponSchema>;
export type IUpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type ICouponIdParam = z.infer<typeof couponIdParamSchema>;
export type IListCouponQuery = z.infer<typeof listCouponQuerySchema>;
