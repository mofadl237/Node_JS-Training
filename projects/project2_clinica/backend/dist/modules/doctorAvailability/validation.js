import { z } from "zod";
export const createDoctorAvailabilitySchema = z
    .object({
    doctorId: z.string("doctorId is required").trim().min(1, "doctorId is required"),
    startsAt: z.string("startsAt is required").trim().min(1, "startsAt is required"),
    endsAt: z.string("endsAt is required").trim().min(1, "endsAt is required"),
    isActive: z.boolean().optional(),
})
    .refine((data) => {
    const s = new Date(data.startsAt);
    const e = new Date(data.endsAt);
    return !isNaN(s.getTime()) && !isNaN(e.getTime()) && e > s;
}, { message: "endsAt must be after startsAt", path: ["endsAt"] });
export const updateDoctorAvailabilitySchema = z
    .object({
    startsAt: z.string().trim().min(1).optional(),
    endsAt: z.string().trim().min(1).optional(),
    isActive: z.boolean().optional(),
})
    .refine((data) => {
    if (data.startsAt && data.endsAt) {
        const s = new Date(data.startsAt);
        const e = new Date(data.endsAt);
        return !isNaN(s.getTime()) && !isNaN(e.getTime()) && e > s;
    }
    return true;
}, { message: "endsAt must be after startsAt", path: ["endsAt"] });
export const availabilityIdParamSchema = z.object({
    id: z.string("id is required").trim().min(1, "id is required"),
});
export const doctorIdQuerySchema = z
    .object({
    doctorId: z.string().trim().min(1).optional(),
    isActive: z.enum(["true", "false"]).optional(),
    from: z
        .string()
        .trim()
        .min(1)
        .refine((v) => !isNaN(new Date(v).getTime()), "from must be a valid ISO date")
        .optional(),
    to: z
        .string()
        .trim()
        .min(1)
        .refine((v) => !isNaN(new Date(v).getTime()), "to must be a valid ISO date")
        .optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sortBy: z.enum(["startsAt", "endsAt", "createdAt", "updatedAt"]).default("startsAt"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
})
    .refine((data) => !data.from || !data.to || new Date(data.from) <= new Date(data.to), {
    message: "from must be before or equal to to",
    path: ["from"],
});
//# sourceMappingURL=validation.js.map