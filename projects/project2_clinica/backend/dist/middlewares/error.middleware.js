import { AppError } from "../shared/errors.js";
import { mapPrismaError, isPrismaValidationError, isPrismaInitializationError, isPrismaRustPanicError } from "../shared/errors/prisma-error.mapper.js";
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
        code: "ROUTE_NOT_FOUND",
    });
};
export const errorHandler = (err, req, res, _next) => {
    // 1) App operational errors
    if (err instanceof AppError) {
        const response = {
            success: false,
            message: err.message,
            code: err.code,
        };
        if (err.details !== undefined) {
            response.details = err.details;
        }
        res.status(err.statusCode).json(response);
        return;
    }
    // 2) Prisma known errors mapped
    const mapped = mapPrismaError(err);
    if (mapped) {
        res.status(mapped.statusCode).json({
            success: false,
            message: mapped.message,
            code: mapped.code,
        });
        return;
    }
    // 3) Prisma validation
    if (isPrismaValidationError(err)) {
        res.status(400).json({
            success: false,
            message: "Invalid data provided to the database client",
            code: "VALIDATION_ERROR",
        });
        return;
    }
    // 4) Prisma init/rust panic - don't leak details
    if (isPrismaInitializationError(err) || isPrismaRustPanicError(err)) {
        if (process.env.NODE_ENV !== "production") {
            console.error(`[db-fatal] ${req.method} ${req.path}`, err);
        }
        else {
            console.error(`[db-fatal] ${req.method} ${req.path}`);
        }
        res.status(503).json({
            success: false,
            message: "Database service unavailable",
            code: "DB_UNAVAILABLE",
        });
        return;
    }
    // 5) JSON parse
    if (err instanceof SyntaxError && "status" in err && err.status === 400) {
        res.status(400).json({
            success: false,
            message: "Invalid JSON in request body",
            code: "INVALID_JSON",
        });
        return;
    }
    // 6) Fallback
    if (process.env.NODE_ENV !== "production") {
        console.error(`[error] ${req.method} ${req.path}`, err);
        res.status(500).json({
            success: false,
            message: err.message,
            code: "INTERNAL_ERROR",
        });
        return;
    }
    console.error(`[error] ${req.method} ${req.path}`);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        code: "INTERNAL_ERROR",
    });
};
//# sourceMappingURL=error.middleware.js.map