import { z } from "zod";

export const createDoctorAvailabilitySchema = z
  .object({
    doctorId: z.string("doctorId is required").trim().min(1, "doctorId is required"),
    startsAt: z.string("startsAt is required").trim().min(1, "startsAt is required"),
    endsAt: z.string("endsAt is required").trim().min(1, "endsAt is required"),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      const s = new Date(data.startsAt);
      const e = new Date(data.endsAt);
      return !isNaN(s.getTime()) && !isNaN(e.getTime()) && e > s;
    },
    { message: "endsAt must be after startsAt", path: ["endsAt"] }
  );

export const updateDoctorAvailabilitySchema = z
  .object({
    startsAt: z.string().trim().min(1).optional(),
    endsAt: z.string().trim().min(1).optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.startsAt && data.endsAt) {
        const s = new Date(data.startsAt);
        const e = new Date(data.endsAt);
        return !isNaN(s.getTime()) && !isNaN(e.getTime()) && e > s;
      }
      return true;
    },
    { message: "endsAt must be after startsAt", path: ["endsAt"] }
  );

export const availabilityIdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const doctorIdQuerySchema = z.object({
  doctorId: z.string().trim().min(1).optional(),
});

export type ICreateDoctorAvailabilityInput = z.infer<typeof createDoctorAvailabilitySchema>;
export type IUpdateDoctorAvailabilityInput = z.infer<typeof updateDoctorAvailabilitySchema>;
export type IAvailabilityIdParam = z.infer<typeof availabilityIdParamSchema>;
export type IDoctorIdQuery = z.infer<typeof doctorIdQuerySchema>;
