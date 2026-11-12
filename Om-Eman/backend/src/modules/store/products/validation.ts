import { z } from "zod";

export const slugParamSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "slug is invalid"),
});
