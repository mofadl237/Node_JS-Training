import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../shared/errors.js";
import {
  isPrismaInitializationError,
  isPrismaRustPanicError,
  isPrismaValidationError,
  mapPrismaError,
} from "../shared/errors/prisma-error.mapper.js";
import { env } from "../config/env.js";
import { EEnvironment } from "../enums/EEnvironment.js";
import { logger } from "../utils/logger/index.js";

export const notFoundHandler: RequestHandler = (req, res) => {
  logger.warn("Route not found", {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    code: "ROUTE_NOT_FOUND",
  });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
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

  const mapped = mapPrismaError(err);
  if (mapped) {
    res.status(mapped.statusCode).json({
      success: false,
      message: mapped.message,
      code: mapped.code,
    });
    return;
  }

  if (isPrismaValidationError(err)) {
    res.status(400).json({
      success: false,
      message: "Invalid data provided to the database client",
      code: "VALIDATION_ERROR",
    });
    return;
  }

  if (isPrismaInitializationError(err) || isPrismaRustPanicError(err)) {
    logger.error("Database unavailable", {
      method: req.method,
      path: req.path,
      error: err instanceof Error ? err.message : String(err),
    });
    res.status(503).json({
      success: false,
      message: "Database service unavailable",
      code: "DB_UNAVAILABLE",
    });
    return;
  }

  if (err instanceof SyntaxError && "status" in err && (err as { status?: number }).status === 400) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
      code: "INVALID_JSON",
    });
    return;
  }

  logger.error("Unhandled application error", {
    method: req.method,
    path: req.path,
    error: err instanceof Error ? err.message : String(err),
  });

  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === EEnvironment.PRODUCTION
        ? "Internal server error"
        : err instanceof Error
          ? err.message
          : "Internal server error",
    code: "INTERNAL_ERROR",
  });
};
