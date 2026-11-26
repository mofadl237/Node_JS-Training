import { z } from "zod";

export const adminLoginSchema = z
  .object({
    email: z.string().trim().min(1).max(200),
    password: z.string().min(1).max(200),
  })
  .strict();

export const adminTokenSchema = z
  .string()
  .trim()
  .min(20)
  .max(2048)
  .regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);

export const adminEmployeeSchema = z.object({
  id: z.string().trim().min(1),
  fullName: z.string().trim().min(1),
  email: z.string().trim().min(1),
  phone: z.string().nullable(),
  role: z.enum(["OWNER", "ADMIN", "STAFF"]),
});

export const adminLoginBackendResultSchema = z.object({
  employee: adminEmployeeSchema,
  token: adminTokenSchema,
});

export const adminLoginResultSchema = z.object({
  employee: adminEmployeeSchema,
});

export const adminEmptyResultSchema = z.null();

export type TAdminLoginForm = z.infer<typeof adminLoginSchema>;
