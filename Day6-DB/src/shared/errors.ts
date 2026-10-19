/**
 * Shared error types used across services, controllers and the error middleware.
 *
 * Why: services and validation code need a way to signal "this is a client
 * error, not a bug" (400/404/...) without importing Express or building HTTP
 * responses inside the business layer. A single AppError class carrying an
 * HTTP status lets the central error middleware translate any thrown error
 * into the right JSON response in exactly one place.
 */

/** Operational error that carries an HTTP status code and a machine-readable code. */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(statusCode: number, message: string, code = "APP_ERROR") {
    super(message);
    // Keep the real subclass name (ValidationError / NotFoundError / ...)
    // in stack traces so logs stay readable.
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
  }
}

/** 400 — the client sent invalid query params, body or path params. */
export class ValidationError extends AppError {
  constructor(message: string, code = "VALIDATION_ERROR") {
    super(400, message, code);
  }
}

/** 404 — the requested resource does not exist. */
export class NotFoundError extends AppError {
  constructor(message = "User not found") {
    super(404, message, "NOT_FOUND");
  }
}
