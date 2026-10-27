import { z } from "zod";
export const createDoctorServiceSchema = z.object({
    doctorId: z.string().trim().min(1).optional(),
    clinicServiceId: z.string("clinicServiceId is required").trim().min(1, "clinicServiceId is required"),
    price: z.union([z.number(), z.string()]).refine((v) => {
        const n = typeof v === "string" ? parseFloat(v) : v;
        return !isNaN(n) && n >= 0;
    }, "price must be a valid non-negative number"),
    durationMinutes: z.coerce.number().int("durationMinutes must be integer").positive("durationMinutes must be positive"),
    isActive: z.boolean().optional(),
});
export const updateDoctorServiceSchema = z.object({
    price: z.union([z.number(), z.string()]).optional().refine((v) => {
        if (v === undefined)
            return true;
        const n = typeof v === "string" ? parseFloat(v) : v;
        return !isNaN(n) && n >= 0;
    }, "price must be a valid non-negative number"),
    durationMinutes: z.coerce.number().int("durationMinutes must be integer").positive("durationMinutes must be positive").optional(),
    isActive: z.boolean().optional(),
});
export const doctorServiceIdParamSchema = z.object({
    id: z.string("id is required").trim().min(1, "id is required"),
});
export const listDoctorServiceQuerySchema = z.object({
    doctorId: z.string().trim().min(1).optional(),
    clinicServiceId: z.string().trim().min(1).optional(),
});
//# sourceMappingURL=validation.js.map