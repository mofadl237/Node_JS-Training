import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { UnauthorizedError } from "../shared/errors.js";
import { prisma } from "../config/prisma.js";
import { IJwtPayload } from "../interfaces/auth/IAuthPayload.js";

export interface IAuthRequest extends Request {
  user?: {
    id: string;
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (req: IAuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authorization token is required", "TOKEN_MISSING");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("Authorization token is required", "TOKEN_MISSING");
    }

    const decoded = verifyToken(token) as IJwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid token or user not found", "USER_NOT_FOUND");
    }

    req.user = {
      id: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      throw new UnauthorizedError("Invalid token", "TOKEN_INVALID");
    }
    if (error.name === "TokenExpiredError") {
      throw new UnauthorizedError("Token expired", "TOKEN_EXPIRED");
    }
    throw error;
  }
};
