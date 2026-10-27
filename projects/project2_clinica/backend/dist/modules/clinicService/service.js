import { prisma } from "../../config/prisma.js";
import { ConflictError, NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
const selectCs = {
    id: true,
    name: true,
    slug: true,
    description: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
};
export class ClinicServiceService {
    async create(dto) {
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
        return cs;
    }
    async list(query = {}) {
        const where = {
            isActive: query.isActive === undefined ? true : query.isActive === "true",
        };
        if (query.q) {
            where.OR = [
                { name: { contains: query.q, mode: "insensitive" } },
                { slug: { contains: query.q, mode: "insensitive" } },
            ];
        }
        const pagination = resolvePagination(query.page, query.limit);
        const sortBy = query.sortBy ?? "name";
        const sortOrder = query.sortOrder ?? "asc";
        const [items, total] = await prisma.$transaction([
            prisma.clinicService.findMany({
                where,
                select: selectCs,
                orderBy: { [sortBy]: sortOrder },
                skip: pagination.skip,
                take: pagination.take,
            }),
            prisma.clinicService.count({ where }),
        ]);
        return toPaginatedResult(items, total, pagination.page, pagination.limit);
    }
    async getById(id) {
        const cs = await prisma.clinicService.findUnique({ where: { id }, select: selectCs });
        if (!cs) {
            throw new NotFoundError("Clinic service not found", "CLINIC_SERVICE_NOT_FOUND");
        }
        return cs;
    }
    async update(id, dto) {
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
        return cs;
    }
    async remove(id) {
        const existing = await prisma.clinicService.findUnique({ where: { id }, select: { id: true } });
        if (!existing) {
            throw new NotFoundError("Clinic service not found", "CLINIC_SERVICE_NOT_FOUND");
        }
        await prisma.clinicService.delete({ where: { id } });
    }
}
//# sourceMappingURL=service.js.map