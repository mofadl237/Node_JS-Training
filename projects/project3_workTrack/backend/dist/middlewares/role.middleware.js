import { ForbiddenError, UnauthorizedError } from "../shared/errors.js";
export const authorize = (...allowedRoles) => (req, _res, next) => {
    if (!req.user) {
        next(new UnauthorizedError("Authentication required", "AUTH_REQUIRED"));
        return;
    }
    if (!allowedRoles.includes(req.user.role)) {
        next(new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN"));
        return;
    }
    next();
};
export const requireRole = authorize;
//# sourceMappingURL=role.middleware.js.map