import { ForbiddenError, UnauthorizedError } from "../shared/errors.js";
export const authorize = (...allowedRoles) => {
    return (req, _res, next) => {
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
//# sourceMappingURL=role.middleware.js.map