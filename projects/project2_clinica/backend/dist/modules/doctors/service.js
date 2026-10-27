import { prisma } from "../../config/prisma.js";
import { ConflictError, NotFoundError, BadRequestError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import { UserRole } from "@prisma/client";
import { hashPassword } from "../../utils/password.js";
const doctorSelect = {
    id: true,
    userId: true,
    specializationId: true,
    imageUrl: true,
    bio: true,
    createdAt: true,
    updatedAt: true,
    user: {
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
        },
    },
    specialization: {
        select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
        },
    },
};
export class DoctorsService {
    async create(dto) {
        let userId = dto.userId;
        if (dto.user) {
            const email = dto.user.email.toLowerCase().trim();
            const existingUser = await prisma.user.findUnique({
                where: { email },
                select: { id: true },
            });
            if (existingUser) {
                throw new ConflictError("Email already registered", "EMAIL_EXISTS");
            }
            const hashedPassword = await hashPassword(dto.user.password);
            const user = await prisma.user.create({
                data: {
                    name: dto.user.name.trim(),
                    email,
                    password: hashedPassword,
                    phone: dto.user.phone?.trim() || null,
                    role: UserRole.DOCTOR,
                },
                select: { id: true },
            });
            userId = user.id;
        }
        if (!userId) {
            throw new BadRequestError("userId or user is required", "BAD_REQUEST");
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true },
        });
        if (!user) {
            throw new NotFoundError("User not found", "USER_NOT_FOUND");
        }
        const specialization = await prisma.specialization.findUnique({
            where: { id: dto.specializationId },
            select: { id: true, isActive: true },
        });
        if (!specialization) {
            throw new NotFoundError("Specialization not found", "SPECIALIZATION_NOT_FOUND");
        }
        const existingDoctor = await prisma.doctor.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (existingDoctor) {
            throw new ConflictError("Doctor profile already exists for this user", "DOCTOR_EXISTS");
        }
        const doctor = await prisma.doctor.create({
            data: {
                userId,
                specializationId: dto.specializationId,
                imageUrl: dto.imageUrl?.trim() || null,
                bio: dto.bio?.trim() || null,
            },
            select: doctorSelect,
        });
        return doctor;
    }
    async list(query = {}) {
        const where = {};
        if (query.specializationId) {
            where.specializationId = query.specializationId;
        }
        if (query.q) {
            where.user = {
                OR: [
                    { name: { contains: query.q, mode: "insensitive" } },
                    { email: { contains: query.q, mode: "insensitive" } },
                ],
            };
        }
        const pagination = resolvePagination(query.page, query.limit);
        const sortBy = query.sortBy ?? "createdAt";
        const sortOrder = query.sortOrder ?? "desc";
        const orderBy = sortBy === "name" ? { user: { name: sortOrder } } : { [sortBy]: sortOrder };
        const [doctors, total] = await prisma.$transaction([
            prisma.doctor.findMany({
                where,
                select: doctorSelect,
                orderBy,
                skip: pagination.skip,
                take: pagination.take,
            }),
            prisma.doctor.count({ where }),
        ]);
        return toPaginatedResult(doctors, total, pagination.page, pagination.limit);
    }
    async getById(id) {
        const doctor = await prisma.doctor.findUnique({
            where: { id },
            select: doctorSelect,
        });
        if (!doctor) {
            throw new NotFoundError("Doctor not found", "DOCTOR_NOT_FOUND");
        }
        return doctor;
    }
    async update(id, dto) {
        const existing = await prisma.doctor.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!existing) {
            throw new NotFoundError("Doctor not found", "DOCTOR_NOT_FOUND");
        }
        if (dto.specializationId) {
            const specialization = await prisma.specialization.findUnique({
                where: { id: dto.specializationId },
                select: { id: true },
            });
            if (!specialization) {
                throw new NotFoundError("Specialization not found", "SPECIALIZATION_NOT_FOUND");
            }
        }
        const doctor = await prisma.doctor.update({
            where: { id },
            data: {
                ...(dto.specializationId ? { specializationId: dto.specializationId } : {}),
                ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl?.trim() || null } : {}),
                ...(dto.bio !== undefined ? { bio: dto.bio?.trim() || null } : {}),
            },
            select: doctorSelect,
        });
        return doctor;
    }
    async remove(id) {
        const existing = await prisma.doctor.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!existing) {
            throw new NotFoundError("Doctor not found", "DOCTOR_NOT_FOUND");
        }
        await prisma.doctor.delete({ where: { id } });
    }
}
//# sourceMappingURL=service.js.map