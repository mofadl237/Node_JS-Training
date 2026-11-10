import { z } from "zod";

export const createCustomerSchema = z.object({
  phone: z.string().trim().min(1, "must not be empty"),
  email: z.string().trim().email("must be a valid email address").toLowerCase().optional().nullable(),
  password: z.string().min(8, "password must be at least 8 characters").max(128, "password must not exceed 128 characters").optional(),
  firstName: z.string().trim().min(1, "must not be empty").optional().nullable(),
  lastName: z.string().trim().min(1, "must not be empty").optional().nullable(),
  status: z.enum(["ACTIVE", "BLOCKED", "MERGED"]).optional(),
  isGuest: z.boolean().optional(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  phoneVerifiedAt: z.coerce.date().optional().nullable(),
  claimedAt: z.coerce.date().optional().nullable(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  mergedIntoCustomerId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  completedOrdersCount: z.coerce.number().int().optional(),
  totalSpent: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  firstOrderAt: z.coerce.date().optional().nullable(),
  lastOrderAt: z.coerce.date().optional().nullable(),
  marketingConsent: z.boolean().optional(),
});

export const updateCustomerSchema = z.object({
  phone: z.string().trim().min(1, "must not be empty").optional(),
  email: z.string().trim().email("must be a valid email address").toLowerCase().optional().nullable(),
  password: z.string().min(8, "password must be at least 8 characters").max(128, "password must not exceed 128 characters").optional(),
  firstName: z.string().trim().min(1, "must not be empty").optional().nullable(),
  lastName: z.string().trim().min(1, "must not be empty").optional().nullable(),
  status: z.enum(["ACTIVE", "BLOCKED", "MERGED"]).optional(),
  isGuest: z.boolean().optional(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  phoneVerifiedAt: z.coerce.date().optional().nullable(),
  claimedAt: z.coerce.date().optional().nullable(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  mergedIntoCustomerId: z.string().trim().min(1, "must not be empty").optional().nullable(),
  completedOrdersCount: z.coerce.number().int().optional(),
  totalSpent: z.union([z.string().trim().regex(/^-?\d+(?:\.\d+)?$/, "must be a decimal number"), z.number().finite()]).optional(),
  firstOrderAt: z.coerce.date().optional().nullable(),
  lastOrderAt: z.coerce.date().optional().nullable(),
  marketingConsent: z.boolean().optional(),
});

export const customerIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listCustomerQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "phone", "email", "firstName", "lastName", "status", "isGuest", "emailVerifiedAt", "phoneVerifiedAt", "claimedAt", "lastLoginAt", "mergedIntoCustomerId", "completedOrdersCount", "totalSpent", "firstOrderAt", "lastOrderAt", "marketingConsent", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type IUpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type ICustomerIdParam = z.infer<typeof customerIdParamSchema>;
export type IListCustomerQuery = z.infer<typeof listCustomerQuerySchema>;
