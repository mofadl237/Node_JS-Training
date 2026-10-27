import { z } from "zod";

const userCreateSchema = z.object({
  name: z
    .string("name is required")
    .trim()
    .min(2, "name must be at least 2 characters")
    .max(50, "name must not exceed 50 characters"),
  email: z
    .string("email is required")
    .trim()
    .email("email must be a valid email address")
    .toLowerCase(),
  password: z
    .string("password is required")
    .min(8, "password must be at least 8 characters")
    .max(128, "password must not exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, "phone must be a valid phone number")
    .optional(),
});

export const createDoctorSchema = z
  .object({
    userId: z.string().trim().min(1, "userId is required").optional(),
    user: userCreateSchema.optional(),
    specializationId: z.string("specializationId is required").trim().min(1, "specializationId is required"),
    imageUrl: z.string().trim().url("imageUrl must be a valid url").optional(),
    bio: z.string().trim().max(1000, "bio must not exceed 1000 characters").optional(),
  })
  .refine((data) => data.userId || data.user, {
    message: "either userId or user must be provided",
    path: ["userId"],
  });

export const updateDoctorSchema = z.object({
  specializationId: z.string().trim().min(1, "specializationId is required").optional(),
  imageUrl: z.string().trim().url("imageUrl must be a valid url").optional().nullable(),
  bio: z.string().trim().max(1000, "bio must not exceed 1000 characters").optional().nullable(),
});

export const doctorIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listDoctorsQuerySchema = z.object({
  specializationId: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export type ICreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type IUpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
export type IDoctorIdParam = z.infer<typeof doctorIdParamSchema>;
export type IListDoctorsQuery = z.infer<typeof listDoctorsQuerySchema>;
