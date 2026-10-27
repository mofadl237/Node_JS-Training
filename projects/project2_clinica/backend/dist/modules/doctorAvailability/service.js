import { prisma } from "../../config/prisma.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
const selectAv = {
    id: true,
    doctorId: true,
    startsAt: true,
    endsAt: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
};
export class DoctorAvailabilityService {
    async getDoctorIdForUser(userId) {
        const doctor = await prisma.doctor.findUnique({ where: { userId }, select: { id: true } });
        return doctor?.id || null;
    }
    async create(dto, auth) {
        let doctorId = dto.doctorId;
        if (auth.role === "DOCTOR") {
            const own = await this.getDoctorIdForUser(auth.userId);
            if (!own) {
                throw new ForbiddenError("Doctor profile not found", "FORBIDDEN");
            }
            doctorId = own;
        }
        else if (auth.role !== "ADMIN") {
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
        return av;
    }
    async list(query, auth) {
        const where = {};
        if (auth?.role === "DOCTOR") {
            const own = await this.getDoctorIdForUser(auth.userId);
            if (own)
                where.doctorId = own;
        }
        else if (query.doctorId) {
            where.doctorId = query.doctorId;
        }
        if (query.isActive !== undefined) {
            where.isActive = query.isActive === "true";
        }
        if (query.from && query.to) {
            where.startsAt = { lte: new Date(query.to) };
            where.endsAt = { gte: new Date(query.from) };
        }
        else if (query.from) {
            where.startsAt = { gte: new Date(query.from) };
        }
        else if (query.to) {
            where.endsAt = { lte: new Date(query.to) };
        }
        const pagination = resolvePagination(query.page, query.limit);
        const sortBy = query.sortBy ?? "startsAt";
        const sortOrder = query.sortOrder ?? "asc";
        const [items, total] = await prisma.$transaction([
            prisma.doctorAvailability.findMany({
                where,
                select: selectAv,
                orderBy: { [sortBy]: sortOrder },
                skip: pagination.skip,
                take: pagination.take,
            }),
            prisma.doctorAvailability.count({ where }),
        ]);
        return toPaginatedResult(items, total, pagination.page, pagination.limit);
    }
    async getById(id) {
        const av = await prisma.doctorAvailability.findUnique({ where: { id }, select: selectAv });
        if (!av) {
            throw new NotFoundError("Doctor availability not found", "DOCTOR_AVAILABILITY_NOT_FOUND");
        }
        return av;
    }
    async update(id, dto, auth) {
        const existing = await prisma.doctorAvailability.findUnique({ where: { id }, select: { id: true, doctorId: true } });
        if (!existing) {
            throw new NotFoundError("Doctor availability not found", "DOCTOR_AVAILABILITY_NOT_FOUND");
        }
        if (auth.role === "DOCTOR") {
            const own = await this.getDoctorIdForUser(auth.userId);
            if (!own || own !== existing.doctorId) {
                throw new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN");
            }
        }
        else if (auth.role !== "ADMIN") {
            throw new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN");
        }
        const data = {};
        if (dto.startsAt !== undefined)
            data.startsAt = new Date(dto.startsAt);
        if (dto.endsAt !== undefined)
            data.endsAt = new Date(dto.endsAt);
        if (dto.isActive !== undefined)
            data.isActive = dto.isActive;
        if (data.startsAt && data.endsAt && data.endsAt <= data.startsAt) {
            throw new BadRequestError("endsAt must be after startsAt", "BAD_REQUEST");
        }
        const av = await prisma.doctorAvailability.update({ where: { id }, data, select: selectAv });
        return av;
    }
    async remove(id, auth) {
        const existing = await prisma.doctorAvailability.findUnique({ where: { id }, select: { id: true, doctorId: true } });
        if (!existing) {
            throw new NotFoundError("Doctor availability not found", "DOCTOR_AVAILABILITY_NOT_FOUND");
        }
        if (auth.role === "DOCTOR") {
            const own = await this.getDoctorIdForUser(auth.userId);
            if (!own || own !== existing.doctorId) {
                throw new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN");
            }
        }
        else if (auth.role !== "ADMIN") {
            throw new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN");
        }
        await prisma.doctorAvailability.delete({ where: { id } });
    }
}
//# sourceMappingURL=service.js.map