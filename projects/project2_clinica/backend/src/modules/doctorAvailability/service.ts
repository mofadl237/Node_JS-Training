import { prisma } from "../../config/prisma.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../shared/errors.js";
import { ICreateDoctorAvailabilityInput, IDoctorAvailabilityResponse, IUpdateDoctorAvailabilityInput } from "./types.js";

const selectAv = {
  id: true,
  doctorId: true,
  startsAt: true,
  endsAt: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class DoctorAvailabilityService {
  private async getDoctorIdForUser(userId: string): Promise<string | null> {
    const doctor = await prisma.doctor.findUnique({ where: { userId }, select: { id: true } });
    return doctor?.id || null;
  }

  async create(dto: ICreateDoctorAvailabilityInput, auth: { userId: string; role: string }): Promise<IDoctorAvailabilityResponse> {
    let doctorId = dto.doctorId;
    if (auth.role === "DOCTOR") {
      const own = await this.getDoctorIdForUser(auth.userId);
      if (!own) {
        throw new ForbiddenError("Doctor profile not found", "FORBIDDEN");
      }
      doctorId = own;
    } else if (auth.role !== "ADMIN") {
      throw new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN");
    }

    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId }, select: { id: true } });
    if (!doctor) {
      throw new NotFoundError("Doctor not found", "DOCTOR_NOT_FOUND");
    }

    const startsAt = new Date(dto.startsAt);
    const endsAt = new Date(dto.endsAt);

    const av = await prisma.doctorAvailability.create({
      data: {
        doctorId,
        startsAt,
        endsAt,
        isActive: dto.isActive ?? true,
      },
      select: selectAv,
    });
    return av as IDoctorAvailabilityResponse;
  }

  async list(query: { doctorId?: string }, auth?: { userId: string; role: string }): Promise<IDoctorAvailabilityResponse[]> {
    const where: any = {};
    if (query.doctorId) {
      where.doctorId = query.doctorId;
    } else if (auth?.role === "DOCTOR") {
      const own = await this.getDoctorIdForUser(auth.userId);
      if (own) where.doctorId = own;
    }
    const items = await prisma.doctorAvailability.findMany({
      where,
      select: selectAv,
      orderBy: { startsAt: "asc" },
    });
    return items as IDoctorAvailabilityResponse[];
  }

  async getById(id: string): Promise<IDoctorAvailabilityResponse> {
    const av = await prisma.doctorAvailability.findUnique({ where: { id }, select: selectAv });
    if (!av) {
      throw new NotFoundError("Doctor availability not found", "DOCTOR_AVAILABILITY_NOT_FOUND");
    }
    return av as IDoctorAvailabilityResponse;
  }

  async update(id: string, dto: IUpdateDoctorAvailabilityInput, auth: { userId: string; role: string }): Promise<IDoctorAvailabilityResponse> {
    const existing = await prisma.doctorAvailability.findUnique({ where: { id }, select: { id: true, doctorId: true } });
    if (!existing) {
      throw new NotFoundError("Doctor availability not found", "DOCTOR_AVAILABILITY_NOT_FOUND");
    }
    if (auth.role === "DOCTOR") {
      const own = await this.getDoctorIdForUser(auth.userId);
      if (!own || own !== existing.doctorId) {
        throw new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN");
      }
    } else if (auth.role !== "ADMIN") {
      throw new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN");
    }

    const data: any = {};
    if (dto.startsAt !== undefined) data.startsAt = new Date(dto.startsAt);
    if (dto.endsAt !== undefined) data.endsAt = new Date(dto.endsAt);
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (data.startsAt && data.endsAt && data.endsAt <= data.startsAt) {
      throw new BadRequestError("endsAt must be after startsAt", "BAD_REQUEST");
    }

    const av = await prisma.doctorAvailability.update({ where: { id }, data, select: selectAv });
    return av as IDoctorAvailabilityResponse;
  }

  async remove(id: string, auth: { userId: string; role: string }): Promise<void> {
    const existing = await prisma.doctorAvailability.findUnique({ where: { id }, select: { id: true, doctorId: true } });
    if (!existing) {
      throw new NotFoundError("Doctor availability not found", "DOCTOR_AVAILABILITY_NOT_FOUND");
    }
    if (auth.role === "DOCTOR") {
      const own = await this.getDoctorIdForUser(auth.userId);
      if (!own || own !== existing.doctorId) {
        throw new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN");
      }
    } else if (auth.role !== "ADMIN") {
      throw new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN");
    }
    await prisma.doctorAvailability.delete({ where: { id } });
  }
}
