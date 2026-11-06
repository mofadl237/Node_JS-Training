import type { NextFunction, Request, Response } from "express";
import type { ERole } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { UnauthorizedError } from "../shared/errors.js";
import { verifyToken } from "../utils/jwt.js";

export interface IAuthUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: ERole;
  departmentId: string | null;
}

export interface IAuthRequest extends Request {
  user?: IAuthUser;
}

const mapTokenError = (error: unknown): Error => {
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

export const authenticate = async (
  req: IAuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
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
    } catch (error: unknown) {
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
  } catch (error: unknown) {
    next(error);
  }
};
