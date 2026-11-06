import { z } from "zod";

export const uploadIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const listUploadsQuerySchema = z.object({
  type: z.enum(["EMPLOYEE_IMPORT", "ATTENDANCE_IMPORT"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["createdAt", "originalName", "type"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type IUploadIdParam = z.infer<typeof uploadIdParamSchema>;
export type IListUploadsQuery = z.infer<typeof listUploadsQuerySchema>;
