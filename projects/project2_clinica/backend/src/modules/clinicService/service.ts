import { prisma } from "../../config/prisma.js";
import { ConflictError, NotFoundError } from "../../shared/errors.js";
import { ICreateClinicServiceInput, IClinicServiceResponse, IUpdateClinicServiceInput } from "./types.js";

const selectCs = {
  id: true,
  name: true,
  slug: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class ClinicServiceService {
  async create(dto: ICreateClinicServiceInput): Promise<IClinicServiceResponse> {
    const existing = await prisma.clinicService.findFirst({
      where: { OR: [{ name: dto.name }, { slug: dto.slug }] },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictError("Clinic service with same name or slug already exists", "CONFLICT");
    }
    const cs = await prisma.clinicService.create({
      data: {
        name: dto.name.trim(),
        slug: dto.slug.trim().toLowerCase(),
        description: dto.description?.trim() || null,
        isActive: dto.isActive ?? true,
      },
      select: selectCs,
    });
    return cs as IClinicServiceResponse;
  }

  async list(includeInactive = false): Promise<IClinicServiceResponse[]> {
    const items = await prisma.clinicService.findMany({
      where: includeInactive ? {} : { isActive: true },
      select: selectCs,
      orderBy: { name: "asc" },
    });
    return items as IClinicServiceResponse[];
  }

  async getById(id: string): Promise<IClinicServiceResponse> {
    const cs = await prisma.clinicService.findUnique({ where: { id }, select: selectCs });
    if (!cs) {
      throw new NotFoundError("Clinic service not found", "CLINIC_SERVICE_NOT_FOUND");
    }
    return cs as IClinicServiceResponse;
  }

  async update(id: string, dto: IUpdateClinicServiceInput): Promise<IClinicServiceResponse> {
    const existing = await prisma.clinicService.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      throw new NotFoundError("Clinic service not found", "CLINIC_SERVICE_NOT_FOUND");
    }
    if (dto.name || dto.slug) {
      const conflict = await prisma.clinicService.findFirst({
        where: {
          AND: [{ id: { not: id } }],
          OR: [{ name: dto.name?.trim() }, { slug: dto.slug?.trim().toLowerCase() }],
        },
        select: { id: true },
      });
      if (conflict) {
        throw new ConflictError("Clinic service with same name or slug already exists", "CONFLICT");
      }
    }
    const cs = await prisma.clinicService.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.slug !== undefined ? { slug: dto.slug.trim().toLowerCase() } : {}),
        ...(dto.description !== undefined ? { description: dto.description?.trim() || null } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
      select: selectCs,
    });
    return cs as IClinicServiceResponse;
  }

  async remove(id: string): Promise<void> {
    const existing = await prisma.clinicService.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      throw new NotFoundError("Clinic service not found", "CLINIC_SERVICE_NOT_FOUND");
    }
    await prisma.clinicService.delete({ where: { id } });
  }
}
