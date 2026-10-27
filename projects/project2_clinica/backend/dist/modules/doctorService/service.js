import { prisma } from "../../config/prisma.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../../shared/errors.js";
import { Prisma } from "@prisma/client";
const selectDs = {
    id: true,
    doctorId: true,
    clinicServiceId: true,
    price: true,
    durationMinutes: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
    doctor: {
        select: {
            id: true,
            userId: true,
            user: { select: { id: true, name: true, email: true } },
        },
    },
    clinicService: {
        select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
        },
    },
};
export class DoctorServiceService {
    async getDoctorIdForUser(userId) {
        const doctor = await prisma.doctor.findUnique({ where: { userId }, select: { id: true } });
        return doctor?.id || null;
    }
    async create(dto, auth) {
        let doctorId = dto.doctorId;
        if (auth.role === "DOCTOR") {
            const own = await this.getDoctorIdForUser(auth.userId);
            if (!own)
                throw new ForbiddenError("Doctor profile not found", "FORBIDDEN");
            doctorId = own;
        }
        else if (auth.role !== "ADMIN") {
            throw new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN");
        }
        if (!doctorId) {
            throw new NotFoundError("doctorId is required", "BAD_REQUEST");
        }
        const doctor = await prisma.doctor.findUnique({ where: { id: doctorId }, select: { id: true } });
        if (!doctor)
            throw new NotFoundError("Doctor not found", "DOCTOR_NOT_FOUND");
        const cs = await prisma.clinicService.findUnique({ where: { id: dto.clinicServiceId }, select: { id: true, isActive: true } });
        if (!cs)
            throw new NotFoundError("Clinic service not found", "CLINIC_SERVICE_NOT_FOUND");
        const exists = await prisma.doctorService.findUnique({
            where: { doctorId_clinicServiceId: { doctorId, clinicServiceId: dto.clinicServiceId } },
            select: { id: true },
        });
        if (exists)
            throw new ConflictError("Doctor already offers this clinic service", "CONFLICT");
        const price = new Prisma.Decimal(typeof dto.price === "string" ? dto.price : dto.price.toFixed(2));
        const ds = await prisma.doctorService.create({
            data: {
                doctorId,
                clinicServiceId: dto.clinicServiceId,
                price,
                durationMinutes: dto.durationMinutes,
                isActive: dto.isActive ?? true,
            },
            select: selectDs,
        });
        return ds;
    }
    async list(query, auth) {
        const where = {};
        if (query.doctorId)
            where.doctorId = query.doctorId;
        else if (auth?.role === "DOCTOR") {
            const own = await this.getDoctorIdForUser(auth.userId);
            if (own)
                where.doctorId = own;
        }
        if (query.clinicServiceId)
            where.clinicServiceId = query.clinicServiceId;
        const items = await prisma.doctorService.findMany({ where, select: selectDs, orderBy: { createdAt: "desc" } });
        return items;
    }
    async getById(id) {
        const ds = await prisma.doctorService.findUnique({ where: { id }, select: selectDs });
        if (!ds)
            throw new NotFoundError("Doctor service not found", "DOCTOR_SERVICE_NOT_FOUND");
        return ds;
    }
    async update(id, dto, auth) {
        const existing = await prisma.doctorService.findUnique({ where: { id }, select: { id: true, doctorId: true } });
        if (!existing)
            throw new NotFoundError("Doctor service not found", "DOCTOR_SERVICE_NOT_FOUND");
        if (auth.role === "DOCTOR") {
            const own = await this.getDoctorIdForUser(auth.userId);
            if (!own || own !== existing.doctorId)
                throw new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN");
        }
        else if (auth.role !== "ADMIN") {
            throw new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN");
        }
        const data = {};
        if (dto.price !== undefined)
            data.price = new Prisma.Decimal(typeof dto.price === "string" ? dto.price : dto.price.toFixed(2));
        if (dto.durationMinutes !== undefined)
            data.durationMinutes = dto.durationMinutes;
        if (dto.isActive !== undefined)
            data.isActive = dto.isActive;
        const ds = await prisma.doctorService.update({ where: { id }, data, select: selectDs });
        return ds;
    }
    async remove(id, auth) {
        const existing = await prisma.doctorService.findUnique({ where: { id }, select: { id: true, doctorId: true } });
        if (!existing)
            throw new NotFoundError("Doctor service not found", "DOCTOR_SERVICE_NOT_FOUND");
        if (auth.role === "DOCTOR") {
            const own = await this.getDoctorIdForUser(auth.userId);
            if (!own || own !== existing.doctorId)
                throw new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN");
        }
        else if (auth.role !== "ADMIN") {
            throw new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN");
        }
        await prisma.doctorService.delete({ where: { id } });
    }
}
//# sourceMappingURL=service.js.map