import { z } from "zod";

const employeeCodeSchema = z
  .string("employeeCode is required")
  .trim()
  .min(1, "employeeCode is required")
  .max(50, "employeeCode must not exceed 50 characters");

const nameSchema = z
  .string()
  .trim()
  .min(1, "name is required")
  .max(100, "name must not exceed 100 characters");

const emailSchema = z
  .string()
  .trim()
  .email("email must be a valid email address")
  .toLowerCase();

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9]{7,20}$/, "phone must be a valid phone number");

const jobTitleSchema = z
  .string()
  .trim()
  .max(100, "jobTitle must not exceed 100 characters");

const departmentIdSchema = z
  .string("departmentId is required")
  .trim()
  .min(1, "departmentId is required");

const statusSchema = z.enum(["ACTIVE", "INACTIVE"]);

const hireDateSchema = z.coerce.date({ error: "hireDate must be a valid date" });

export const createEmployeeSchema = z.object({
  employeeCode: employeeCodeSchema,
  firstName: z.string("firstName is required").trim().min(1, "firstName is required").max(100, "firstName must not exceed 100 characters"),
  lastName: z.string("lastName is required").trim().min(1, "lastName is required").max(100, "lastName must not exceed 100 characters"),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  departmentId: departmentIdSchema,
  jobTitle: jobTitleSchema.optional(),
  status: statusSchema.optional(),
  hireDate: hireDateSchema,
});

export const updateEmployeeSchema = z
  .object({
    employeeCode: employeeCodeSchema.optional(),
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
    email: emailSchema.optional().nullable(),
    phone: phoneSchema.optional().nullable(),
    departmentId: departmentIdSchema.optional(),
    jobTitle: jobTitleSchema.optional().nullable(),
    status: statusSchema.optional(),
    hireDate: hireDateSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const employeeIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listEmployeesQuerySchema = z.object({
  q: z.string().trim().min(1).max(100).optional(),
  departmentId: z.string().trim().min(1).optional(),
  status: statusSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z
    .enum(["employeeCode", "firstName", "lastName", "hireDate", "createdAt", "updatedAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ICreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type IUpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type IEmployeeIdParam = z.infer<typeof employeeIdParamSchema>;
export type IListEmployeesQuery = z.infer<typeof listEmployeesQuerySchema>;
