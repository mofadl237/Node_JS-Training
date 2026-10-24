import { Response, NextFunction } from "express";
import { IAuthRequest } from "./auth.middleware.js";
import { ForbiddenError, UnauthorizedError } from "../shared/errors.js";

export const authorize = (...allowedRoles: string[]) => {
  return (req: IAuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required", "AUTH_REQUIRED");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN");
    }

    next();
  };
};

export const requireRole = authorize;
