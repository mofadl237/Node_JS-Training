import { prisma } from "../../config/prisma.js";
import { ForbiddenError, NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
import { hashPassword } from "../../utils/password.js";
const selectUser = {
    id: true,
    name: true,
    email: true,
    role: true,
    phone: true,
    createdAt: true,
    updatedAt: true,
};
export class UserService {
    async getMe(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true, updatedAt: true },
        });
        if (!user)
            throw new NotFoundError("User not found", "USER_NOT_FOUND");
        return user;
    }
    async getAll(query, auth) {
        if (auth.role !== "ADMIN")
            throw new ForbiddenError("Only admins can list users", "FORBIDDEN");
        const where = {};
        if (query.role)
            where.role = query.role;
        if (query.q) {
            where.OR = [
                { name: { contains: query.q, mode: "insensitive" } },
                { email: { contains: query.q, mode: "insensitive" } },
            ];
        }
        const pagination = resolvePagination(query.page, query.limit);
        const sortBy = query.sortBy ?? "createdAt";
        const sortOrder = query.sortOrder ?? "desc";
        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                where,
                select: selectUser,
                orderBy: { [sortBy]: sortOrder },
                skip: pagination.skip,
                take: pagination.take,
            }),
            prisma.user.count({ where }),
        ]);
        return toPaginatedResult(users, total, pagination.page, pagination.limit);
    }
    async getById(id, auth) {
        if (auth.role !== "ADMIN" && auth.userId !== id)
            throw new ForbiddenError("Forbidden", "FORBIDDEN");
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true, updatedAt: true },
        });
        if (!user)
            throw new NotFoundError("User not found", "USER_NOT_FOUND");
        return user;
    }
    async update(id, dto, auth) {
        if (auth.role !== "ADMIN" && auth.userId !== id)
            throw new ForbiddenError("Forbidden", "FORBIDDEN");
        if (dto.role !== undefined && auth.role !== "ADMIN") {
            throw new ForbiddenError("Only admins can change user roles", "FORBIDDEN");
        }
        const data = {};
        if (dto.name !== undefined)
            data.name = dto.name;
        if (dto.phone !== undefined)
            data.phone = dto.phone;
        if (dto.password !== undefined)
            data.password = await hashPassword(dto.password);
        if (dto.role !== undefined)
            data.role = dto.role;
        const user = await prisma.user.update({
            where: { id },
            data,
            select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true, updatedAt: true },
        });
        return user;
    }
}
//# sourceMappingURL=service.js.map