/**
 * Central error-handling middleware.
 *
 * Express 5 forwards both sync throws and rejected async handlers here
 * automatically. This is the only place that turns an error into JSON, so
 * clients never see stack traces, SQL or connection strings.
 */
import type { ErrorRequestHandler, RequestHandler } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "./errors.js";
import { logger } from "./logger.js";

/** 404 fallback for unmatched routes — registered after all routers. */
export const notFoundHandler: RequestHandler = (req, res) => {
  const requestId = req.requestId;

  logger.warn("Route not found", {
    requestId,
    method: req.method,
    path: req.path,
  });

  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    code: "NOT_FOUND",
    requestId,
  });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const requestId = req.requestId;

  // 1) Operational errors raised by our own code (validation, not found, ...).
  if (err instanceof AppError) {
    logger.warn("Operational error", {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
    });

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      requestId,
    });
    return;
  }

  // 2) Known Prisma errors — mapped here so services stay free of HTTP codes.
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      logger.warn("Prisma record not found", { requestId, code: err.code });
      res.status(404).json({
        success: false,
        message: "The requested record was not found",
        code: "NOT_FOUND",
        requestId,
      });
      return;
    }

    if (err.code === "P2002") {
      logger.warn("Prisma unique constraint violation", { requestId, code: err.code });
      res.status(409).json({
        success: false,
        message: "A record with the same unique value already exists",
        code: "CONFLICT",
        requestId,
      });
      return;
    }

    if (err.code === "P2003") {
      logger.warn("Prisma foreign key constraint violation", { requestId, code: err.code });
      res.status(409).json({
        success: false,
        message: "The operation conflicts with a related record",
        code: "FOREIGN_KEY_ERROR",
        requestId,
      });
      return;
    }
  }

  // 3) Malformed data sent to the Prisma client — a bug, but reported as 400.
  if (err instanceof Prisma.PrismaClientValidationError) {
    logger.error("Prisma validation error", { requestId, error: err });
    res.status(400).json({
      success: false,
      message: "Invalid data provided to the database client",
      code: "VALIDATION_ERROR",
      requestId,
    });
    return;
  }

  // 4) Malformed JSON body — body-parser raises a SyntaxError with status 400.
  if (err instanceof SyntaxError && "status" in err && err.status === 400) {
    logger.warn("Invalid JSON body", { requestId, method: req.method, path: req.path });
    res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
      code: "INVALID_JSON",
      requestId,
    });
    return;
  }

  // 5) Unknown error = bug. Full details go to logs, never to the client.
  logger.error("Unhandled error", {
    requestId,
    method: req.method,
    path: req.path,
    error: err,
  });

  res.status(500).json({
    success: false,
    message: "Internal server error",
    code: "INTERNAL_ERROR",
    requestId,
  });
};
