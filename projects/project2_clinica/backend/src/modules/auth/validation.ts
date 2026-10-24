import z from "zod";

export const registerSchema   = z.object({
    name:z.string().min(2).max(30),
    email:z.string(),
    password:z.string()
})
export const loginSchema   = z.object({
    email:z.string(),
    password:z.string()
})