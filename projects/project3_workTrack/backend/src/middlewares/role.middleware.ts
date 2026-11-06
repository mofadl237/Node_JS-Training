import type { NextFunction, Response } from "express";
import type { ERole } from "@prisma/client";
import type { IAuthRequest } from "./auth.middleware.js";
import { ForbiddenError, UnauthorizedError } from "../shared/errors.js";

export const authorize =
  (...allowedRoles: ERole[]) =>
  (req: IAuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError("Authentication required", "AUTH_REQUIRED"));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(
        new ForbiddenError(
          "You do not have permission to access this resource",
          "FORBIDDEN",
        ),
      );
      return;
    }

    next();
  };

export const requireRole = authorize;
