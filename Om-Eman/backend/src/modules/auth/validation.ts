import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string("email is required")
    .trim()
    .email("email must be a valid email address")
    .toLowerCase(),
  password: z.string("password is required").min(1, "password is required"),
});

export type ILoginInput = z.infer<typeof loginSchema>;
