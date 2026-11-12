import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[\d\s()-]{8,20}$/, "phone must be a valid phone number");

export const registerSchema = z.object({
  email: z
    .string("email is required")
    .trim()
    .email("email must be a valid email address")
    .toLowerCase(),
  password: z
    .string("password is required")
    .min(8, "password must be at least 8 characters")
    .max(72, "password must be at most 72 characters"),
  firstName: z.string().trim().min(1).max(60).optional(),
  lastName: z.string().trim().max(60).optional(),
  phone: phoneSchema.optional(),
});

export const verifyEmailSchema = z.object({
  token: z.string("token is required").min(20, "token is invalid"),
});

export const customerLoginSchema = z.object({
  email: z
    .string("email is required")
    .trim()
    .email("email must be a valid email address")
    .toLowerCase(),
  password: z.string("password is required").min(1, "password is required"),
});

export const googleCredentialSchema = z.object({
  credential: z.string("credential is required").min(20, "credential is invalid"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string("email is required")
    .trim()
    .email("email must be a valid email address")
    .toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string("token is required").min(20, "token is invalid"),
  password: z
    .string("password is required")
    .min(8, "password must be at least 8 characters")
    .max(72, "password must be at most 72 characters"),
});
