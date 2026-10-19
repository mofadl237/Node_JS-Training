/**
 * Central error-handling middleware.
 *
 * Why: without this, every async controller would need its own try/catch and
 * Prisma errors (or worse, stack traces) could leak to clients. Express 5
 * forwards both sync throws and rejected async handlers here automatically,
 * so this single function is the only place that turns an error into JSON.
 */
import type { ErrorRequestHandler, RequestHandler } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "./errors.js";

/** 404 fallback for unmatched routes — registered after all routers. */
export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  // 1) Operational errors we raised ourselves (validation, not found, ...).
  //    These are safe to show to the client verbatim.
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
    return;
  }

  // 2) Known Prisma errors — mapped here so services stay free of HTTP codes.
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2025: record required by the operation was not found (update/delete).
    // Generic message: this handler serves users, profiles AND posts.
    if (err.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "The requested record was not found",
        code: "NOT_FOUND",
      });
      return;
    }
    // P2002: unique constraint violation. Currently hit by Profile.userId
    // (one profile per user) — e.g. POST /profiles twice with the same user.
    if (err.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "A record with the same unique value already exists",
        code: "CONFLICT",
      });
      return;
    }
    // P2003: foreign key violation — e.g. creating a profile/post whose
    // userId/authorId references a user that does not exist. The client sent
    // the bad FK, so a 400 is the honest status; no field/index names leaked.
    if (err.code === "P2003") {
      res.status(400).json({
        success: false,
        message: "A referenced related record does not exist",
        code: "FOREIGN_KEY_ERROR",
      });
      return;
    }
  }

  // 3) Prisma validation errors mean we sent malformed input to the client
  //    library — usually a bug, but safe to report as a bad request without
  //    exposing internals.
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: "Invalid data provided to the database client",
      code: "VALIDATION_ERROR",
    });
    return;
  }

  // 4) Malformed JSON body — body-parser raises a SyntaxError with status 400.
  if (err instanceof SyntaxError && "status" in err && err.status === 400) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
      code: "INVALID_JSON",
    });
    return;
  }

  // 5) Anything else is a bug: log it server-side, never leak stack traces,
  //    SQL, connection strings, or Prisma internals to the client.
  console.error(`[error] ${req.method} ${req.path}`, err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  });
};
