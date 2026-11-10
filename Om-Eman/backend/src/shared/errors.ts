/**
 * Central application error classes.
 *
 * Operational errors carry an HTTP status and a machine-readable code. The
 * error middleware is the only place that translates them into responses, so
 * services never import Express and never build HTTP payloads themselves.
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational = true;
  public readonly details?: unknown;

  constructor(
    statusCode: number,
    message: string,
    code = "APP_ERROR",
    details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code = "VALIDATION_ERROR", details?: unknown) {
    super(400, message, code, details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", code = "BAD_REQUEST") {
    super(400, message, code);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", code = "UNAUTHORIZED") {
    super(401, message, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", code = "FORBIDDEN") {
    super(403, message, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", code = "NOT_FOUND") {
    super(404, message, code);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists", code = "CONFLICT") {
    super(409, message, code);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Too many requests", code = "TOO_MANY_REQUESTS") {
    super(429, message, code);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error", code = "INTERNAL_ERROR") {
    super(500, message, code);
  }
}
