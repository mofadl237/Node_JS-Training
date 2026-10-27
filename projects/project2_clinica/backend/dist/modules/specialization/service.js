import { prisma } from "../../config/prisma.js";
import { ConflictError, NotFoundError } from "../../shared/errors.js";
const selectSpec = {
    id: true,
    name: true,
    slug: true,
    description: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
};
export class SpecializationService {
    async create(dto) {
        const existing = await prisma.specialization.findFirst({
            where: { OR: [{ name: dto.name }, { slug: dto.slug }] },
            select: { id: true },
        });
        if (existing) {
            throw new ConflictError("Specialization with same name or slug already exists", "CONFLICT");
        }
        const spec = await prisma.specialization.create({
            data: {
                name: dto.name.trim(),
                slug: dto.slug.trim().toLowerCase(),
                description: dto.description?.trim() || null,
                isActive: dto.isActive ?? true,
            },
            select: selectSpec,
        });
        return spec;
    }
    async list(includeInactive = false) {
        const specs = await prisma.specialization.findMany({
            where: includeInactive ? {} : { isActive: true },
            select: selectSpec,
            orderBy: { name: "asc" },
        });
        return specs;
    }
    async getById(id) {
        const spec = await prisma.specialization.findUnique({
            where: { id },
            select: selectSpec,
        });
        if (!spec) {
            throw new NotFoundError("Specialization not found", "SPECIALIZATION_NOT_FOUND");
        }
        return spec;
    }
    async update(id, dto) {
        const existing = await prisma.specialization.findUnique({ where: { id }, select: { id: true } });
        if (!existing) {
            throw new NotFoundError("Specialization not found", "SPECIALIZATION_NOT_FOUND");
        }
        if (dto.name || dto.slug) {
            const conflict = await prisma.specialization.findFirst({
                where: {
                    AND: [{ id: { not: id } }],
                    OR: [{ name: dto.name?.trim() }, { slug: dto.slug?.trim().toLowerCase() }],
                },
                select: { id: true },
            });
            if (conflict) {
                throw new ConflictError("Specialization with same name or slug already exists", "CONFLICT");
            }
        }
        const spec = await prisma.specialization.update({
            where: { id },
            data: {
                ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
                ...(dto.slug !== undefined ? { slug: dto.slug.trim().toLowerCase() } : {}),
                ...(dto.description !== undefined ? { description: dto.description?.trim() || null } : {}),
                ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
            },
            select: selectSpec,
        });
        return spec;
    }
    async remove(id) {
        const existing = await prisma.specialization.findUnique({ where: { id }, select: { id: true } });
        if (!existing) {
            throw new NotFoundError("Specialization not found", "SPECIALIZATION_NOT_FOUND");
        }
        await prisma.specialization.delete({ where: { id } });
    }
}
//# sourceMappingURL=service.js.map