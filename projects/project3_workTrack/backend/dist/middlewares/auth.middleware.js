import { prisma } from "../config/prisma.js";
import { UnauthorizedError } from "../shared/errors.js";
import { verifyToken } from "../utils/jwt.js";
const mapTokenError = (error) => {
    if (error instanceof Error) {
        if (error.name === "TokenExpiredError") {
            return new UnauthorizedError("Token expired", "TOKEN_EXPIRED");
        }
        if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
            return new UnauthorizedError("Invalid token", "TOKEN_INVALID");
        }
    }
    return error instanceof Error ? error : new Error("Authentication failed");
};
export const authenticate = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("Authorization token is required", "TOKEN_MISSING");
        }
        const token = authHeader.slice("Bearer ".length).trim();
        if (!token) {
            throw new UnauthorizedError("Authorization token is required", "TOKEN_MISSING");
        }
        let decoded;
        try {
            decoded = verifyToken(token);
        }
        catch (error) {
            throw mapTokenError(error);
        }
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                departmentId: true,
            },
        });
        if (!user) {
            throw new UnauthorizedError("Invalid token or user not found", "USER_NOT_FOUND");
        }
        req.user = {
            id: user.id,
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            departmentId: user.departmentId,
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=auth.middleware.js.map