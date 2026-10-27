import { z } from "zod";
const isValidDate = (value) => !isNaN(new Date(value).getTime());
export const appointmentStatusSchema = z.enum(["PENDING", "BOOKED", "COMPLETED", "CANCELED"]);
export const createAppointmentSchema = z.object({
    doctorServiceId: z.string("doctorServiceId is required").trim().min(1, "doctorServiceId is required"),
    startsAt: z
        .string("startsAt is required")
        .trim()
        .min(1, "startsAt is required")
        .refine(isValidDate, "startsAt must be a valid ISO date"),
    patientId: z.string("patientId must be a string").trim().min(1, "patientId must not be empty").optional(),
    notes: z.string().trim().max(1000, "notes must not exceed 1000 characters").optional(),
});
export const appointmentIdParamSchema = z.object({
    id: z.string("id is required").trim().min(1, "id is required"),
});
export const availabilityQuerySchema = z.object({
    doctorServiceId: z.string("doctorServiceId is required").trim().min(1, "doctorServiceId is required"),
    date: z
        .string("date is required")
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format"),
});
export const listAppointmentsQuerySchema = z
    .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    status: appointmentStatusSchema.optional(),
    doctorId: z.string().trim().min(1).optional(),
    patientId: z.string().trim().min(1).optional(),
    doctorServiceId: z.string().trim().min(1).optional(),
    from: z.string().trim().min(1).refine(isValidDate, "from must be a valid ISO date").optional(),
    to: z.string().trim().min(1).refine(isValidDate, "to must be a valid ISO date").optional(),
    sortBy: z.enum(["startsAt", "endsAt", "createdAt", "updatedAt", "status"]).default("startsAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
})
    .refine((data) => !data.from || !data.to || new Date(data.from) <= new Date(data.to), {
    message: "from must be before or equal to to",
    path: ["from"],
});
//# sourceMappingURL=validation.js.map