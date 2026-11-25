import { z } from "zod";

export const CUSTOMER_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43,64}$/;

export const customerTokenSchema = z
  .string()
  .regex(CUSTOMER_TOKEN_PATTERN, "customer token is invalid");

const emailSchema = z.string().trim().email().toLowerCase();

const passwordSchema = z.string().min(8).max(72);

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[\d\s()-]{8,20}$/);

export const registerCustomerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().trim().min(1).max(60).optional(),
  lastName: z.string().trim().max(60).optional(),
  phone: phoneSchema.optional(),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(20),
});

export const customerLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: passwordSchema,
});

export const storeCustomerSchema = z.object({
  id: z.string().min(1),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  isGuest: z.boolean(),
  emailVerifiedAt: z.string().datetime().nullable(),
  status: z.enum(["ACTIVE", "BLOCKED", "MERGED"]),
});

export const customerAuthResponseSchema = z.object({
  customer: storeCustomerSchema,
  token: customerTokenSchema,
  expiresInDays: z.number().int().positive(),
});

export const customerMessageResponseSchema = z.object({
  devVerificationLink: z.string().optional(),
});

export type TRegisterCustomerForm = z.infer<typeof registerCustomerSchema>;
export type TCustomerLoginForm = z.infer<typeof customerLoginSchema>;
export type TVerifyEmailForm = z.infer<typeof verifyEmailSchema>;
export type TForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type TResetPasswordForm = z.infer<typeof resetPasswordSchema>;
