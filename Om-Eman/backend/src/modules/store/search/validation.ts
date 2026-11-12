import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(200),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  sessionId: z.string().trim().min(5).max(100).optional(),
});
