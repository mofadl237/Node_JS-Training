import type { NextFunction, Request, Response } from "express";
import { EEmployeeStatus } from "@prisma/client";
import type { EEmployeeRole } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { UnauthorizedError } from "../shared/errors.js";
import { verifyToken } from "../utils/jwt.js";

export interface IAuthRequest extends Request {
  employee?: {
    id: string;
    email: string;
    role: EEmployeeRole;
  };
}

export async function authenticate(
  req: IAuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "Authorization token is required",
        "TOKEN_MISSING",
      );
    }

    const token = authHeader.slice("Bearer ".length).trim();
    if (!token) {
      throw new UnauthorizedError(
        "Authorization token is required",
        "TOKEN_MISSING",
      );
    }

    const decoded = verifyToken(token);
    const employee = await prisma.employee.findUnique({
      where: { id: decoded.employeeId },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!employee || employee.status !== EEmployeeStatus.ACTIVE) {
      throw new UnauthorizedError(
        "Invalid token or employee is not active",
        "EMPLOYEE_UNAVAILABLE",
      );
    }

    req.employee = {
      id: employee.id,
      email: employee.email,
      role: employee.role,
    };

    next();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      throw new UnauthorizedError("Invalid token", "TOKEN_INVALID");
    }
    if (error instanceof Error && error.name === "TokenExpiredError") {
      throw new UnauthorizedError("Token expired", "TOKEN_EXPIRED");
    }
    throw error;
  }
}
