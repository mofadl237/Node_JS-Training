import { z } from "zod";
export const registerSchema = z.object({
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
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "password must contain at least one uppercase letter, one lowercase letter, and one number"),
    phone: z
        .string()
        .trim()
        .regex(/^\+?[0-9]{10,15}$/, "phone must be a valid phone number")
        .optional(),
    role: z
        .never({ error: "role cannot be set during public registration" })
        .optional(),
});
export const loginSchema = z.object({
    email: z
        .string("email is required")
        .trim()
        .email("email must be a valid email address")
        .toLowerCase(),
    password: z
        .string("password is required")
        .min(1, "password is required"),
});
//# sourceMappingURL=validation.js.map