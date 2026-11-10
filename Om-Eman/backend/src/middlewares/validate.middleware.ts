import type { NextFunction, Request, Response } from "express";
import type { ZodIssue, ZodType } from "zod";
import { ValidationError } from "../shared/errors.js";

interface IFormattedIssue {
  field: string;
  message: string;
}

function formatZodIssues(issues: ZodIssue[]): IFormattedIssue[] {
  return issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "body";
    const message = issue.message || "Validation failed";
    return {
      field: path,
      message: path === "body" ? message : `${path}: ${message}`,
    };
  });
}

function buildValidationMessage(issues: ZodIssue[]): string {
  const first = issues[0];
  if (!first) return "Validation failed";

  const path = first.path.length > 0 ? first.path.join(".") : null;
  return path
    ? `${path}: ${first.message || "Validation failed"}`
    : first.message || "Validation failed";
}

function reject(issues: ZodIssue[]): never {
  const details = formatZodIssues(issues);
  const message = buildValidationMessage(issues);
  throw new ValidationError(message, "VALIDATION_ERROR", { errors: details });
}

export function validateBody(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      reject(result.error.issues);
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      reject(result.error.issues);
    }
    Object.defineProperty(req, "query", {
      value: result.data,
      writable: true,
      configurable: true,
    });
    next();
  };
}

export function validateParams(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      reject(result.error.issues);
    }
    Object.defineProperty(req, "params", {
      value: result.data,
      writable: true,
      configurable: true,
    });
    next();
  };
}
