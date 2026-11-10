import type { NextFunction, Response } from "express";
import type { EEmployeeRole } from "@prisma/client";
import type { IAuthRequest } from "./auth.middleware.js";
import { ForbiddenError, UnauthorizedError } from "../shared/errors.js";

export function authorize(...allowedRoles: EEmployeeRole[]) {
  return (
    req: IAuthRequest,
    _res: Response,
    next: NextFunction,
  ): void => {
    if (!req.employee) {
      throw new UnauthorizedError(
        "Authentication required",
        "AUTH_REQUIRED",
      );
    }

    if (!allowedRoles.includes(req.employee.role)) {
      throw new ForbiddenError(
        "You do not have permission to access this resource",
        "FORBIDDEN",
      );
    }

    next();
  };
}

export const requireRole = authorize;
