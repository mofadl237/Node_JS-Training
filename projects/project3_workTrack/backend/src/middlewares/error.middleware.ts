import type { ErrorRequestHandler, Request, RequestHandler } from "express";
import { AppError, PayloadTooLargeError, ServiceUnavailableError } from "../shared/errors.js";
import {
  isPrismaInitializationError,
  isPrismaRustPanicError,
  isPrismaValidationError,
  mapPrismaError,
} from "../shared/errors/prisma-error.mapper.js";
import { logger } from "../utils/logger/index.js";

interface IRequestError extends Error {
  status?: number;
  statusCode?: number;
  type?: string;
}

const isProduction = () => process.env.NODE_ENV === "production";

const requestContext = (req: Request) => ({
  method: req.method,
  path: req.originalUrl,
  ip: req.ip,
});

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    code: "ROUTE_NOT_FOUND",
  });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof AppError) {
    const response: Record<string, unknown> = {
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

  const mappedError = mapPrismaError(err);
  if (mappedError) {
    if (isProduction() && mappedError.statusCode >= 500) {
      logger.error("Mapped Prisma error", { ...requestContext(req), error: mappedError.message });
    }
    res.status(mappedError.statusCode).json({
      success: false,
      message: mappedError.message,
      code: mappedError.code,
    });
    return;
  }

  if (isPrismaValidationError(err)) {
    logger.warn("Prisma validation error", requestContext(req));
    res.status(400).json({
      success: false,
      message: "Invalid data provided to the database client",
      code: "VALIDATION_ERROR",
    });
    return;
  }

  if (isPrismaInitializationError(err) || isPrismaRustPanicError(err)) {
    logger.error("Database unavailable", {
      ...requestContext(req),
      error: err instanceof Error ? err.message : "Unknown database error",
    });
    const unavailable = new ServiceUnavailableError("Database service unavailable", "DB_UNAVAILABLE");
    res.status(unavailable.statusCode).json({
      success: false,
      message: unavailable.message,
      code: unavailable.code,
    });
    return;
  }

  if (err instanceof SyntaxError && "status" in err && (err as IRequestError).status === 400) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
      code: "INVALID_JSON",
    });
    return;
  }

  const requestError = err as IRequestError;
  if (requestError.type === "entity.too.large" || requestError.status === 413) {
    const payloadError = new PayloadTooLargeError();
    res.status(payloadError.statusCode).json({
      success: false,
      message: payloadError.message,
      code: payloadError.code,
    });
    return;
  }

  logger.error("Unhandled application error", {
    ...requestContext(req),
    error: err instanceof Error ? err.message : String(err),
    ...(isProduction() ? {} : { stack: err instanceof Error ? err.stack : undefined }),
  });

  const statusCode = requestError.statusCode ?? requestError.status ?? 500;
  const isServerError = statusCode >= 500;

  res.status(statusCode).json({
    success: false,
    message:
      isProduction() || isServerError
        ? "Internal server error"
        : err instanceof Error
          ? err.message
          : "Internal server error",
    code: isServerError ? "INTERNAL_ERROR" : "REQUEST_ERROR",
  });
};
