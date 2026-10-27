import { prisma } from "../../config/prisma.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { signToken } from "../../utils/jwt.js";
import { ConflictError, UnauthorizedError } from "../../shared/errors.js";
import { UserRole } from "@prisma/client";
export class AuthService {
    async register(dto) {
        const email = dto.email.toLowerCase().trim();
        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });
        if (existingUser) {
            throw new ConflictError("Email already registered", "EMAIL_EXISTS");
        }
        const hashedPassword = await hashPassword(dto.password);
        const role = dto.role && Object.values(UserRole).includes(dto.role) ? dto.role : UserRole.PATIENT;
        const user = await prisma.user.create({
            data: {
                name: dto.name.trim(),
                email,
                password: hashedPassword,
                phone: dto.phone?.trim() || null,
                role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
            },
        });
        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return { user, token };
    }
    async login(dto) {
        const email = dto.email.toLowerCase().trim();
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new UnauthorizedError("Invalid email or password", "INVALID_CREDENTIALS");
        }
        const isPasswordValid = await comparePassword(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid email or password", "INVALID_CREDENTIALS");
        }
        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
            },
            token,
        };
    }
}
//# sourceMappingURL=service.js.map