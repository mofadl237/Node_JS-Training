import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { ValidationError } from "../shared/errors.js";

interface IZodIssue {
  path?: PropertyKey[];
  message?: string;
}

const formatZodIssues = (issues: IZodIssue[]) =>
  issues.map((issue) => {
    const path =
      issue.path && issue.path.length > 0 ? issue.path.map(String).join(".") : "body";
    const message = issue.message || "Validation failed";
    return {
      field: path,
      message: path === "body" ? message : `${path}: ${message}`,
    };
  });

const buildValidationMessage = (issues: IZodIssue[]): string => {
  const first = issues[0];
  if (!first) return "Validation failed";

  const path =
    first.path && first.path.length > 0 ? first.path.map(String).join(".") : null;
  const message = first.message || "Validation failed";
  return path ? `${path}: ${message}` : message;
};

const assignValidatedValue = (
  req: Request,
  key: "body" | "query" | "params",
  value: unknown,
): void => {
  try {
    req[key] = value as never;
  } catch {
    Object.defineProperty(req, key, {
      value,
      writable: true,
      configurable: true,
    });
  }
};

const validate =
  (schema: ZodSchema, source: "body" | "query" | "params") =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = formatZodIssues(result.error.issues);
      const message = buildValidationMessage(result.error.issues);
      next(new ValidationError(message, "VALIDATION_ERROR", { errors: details }));
      return;
    }

    assignValidatedValue(req, source, result.data);
    next();
  };

export const validateBody = (schema: ZodSchema) => validate(schema, "body");
export const validateQuery = (schema: ZodSchema) => validate(schema, "query");
export const validateParams = (schema: ZodSchema) => validate(schema, "params");
