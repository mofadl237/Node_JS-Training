import { z } from "zod";

export const createEmployeeSchema = z.object({
  fullName: z.string().trim().min(1, "must not be empty"),
  email: z.string().trim().email("must be a valid email address").toLowerCase(),
  phone: z.string().trim().min(1, "must not be empty").optional().nullable(),
  password: z.string("password is required").min(8, "password must be at least 8 characters").max(128, "password must not exceed 128 characters"),
  role: z.enum(["OWNER", "ADMIN", "STAFF"]).optional(),
  status: z.enum(["ACTIVE", "DISABLED", "REMOVED"]).optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  disabledAt: z.coerce.date().optional().nullable(),
});

export const updateEmployeeSchema = z.object({
  fullName: z.string().trim().min(1, "must not be empty").optional(),
  email: z.string().trim().email("must be a valid email address").toLowerCase().optional(),
  phone: z.string().trim().min(1, "must not be empty").optional().nullable(),
  password: z.string().min(8, "password must be at least 8 characters").max(128, "password must not exceed 128 characters").optional(),
  role: z.enum(["OWNER", "ADMIN", "STAFF"]).optional(),
  status: z.enum(["ACTIVE", "DISABLED", "REMOVED"]).optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  disabledAt: z.coerce.date().optional().nullable(),
});

export const employeeIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listEmployeeQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["id", "fullName", "email", "phone", "role", "status", "lastLoginAt", "disabledAt", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type IUpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type IEmployeeIdParam = z.infer<typeof employeeIdParamSchema>;
export type IListEmployeeQuery = z.infer<typeof listEmployeeQuerySchema>;
