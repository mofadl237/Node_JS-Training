import type { NextFunction, Request, Response } from "express";
import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { logger } from "../utils/logger/index.js";
import type { IAuthRequest } from "./auth.middleware.js";

const SKIPPED_PREFIXES = ["/api/auth", "/api/audit-logs"];

const resolveAction = (method: string, path: string): string | null => {
  if (path.startsWith("/api/uploads")) {
    return "IMPORT";
  }

  if (path.startsWith("/api/attendance/process")) {
    return "PROCESS";
  }

  if (method === "POST") {
    return "CREATE";
  }

  if (method === "PATCH" || method === "PUT") {
    return "UPDATE";
  }

  if (method === "DELETE") {
    return "DELETE";
  }

  return null;
};

const resolveEntity = (path: string): string => {
  const [, resource, subResource] = path.split("/").filter(Boolean);

  switch (resource) {
    case "attendance":
      if (subResource === "logs") return "AttendanceLog";
      if (subResource === "records") return "AttendanceRecord";
      if (subResource === "process") return "AttendanceProcess";
      return "Attendance";
    case "shifts":
      return subResource === "assignments" ? "EmployeeShift" : "Shift";
    case "departments":
      return "Department";
    case "employees":
      return "Employee";
    case "leaves":
      return "Leave";
    case "uploads":
      return "UploadedFile";
    case "dashboard":
      return "Dashboard";
    default:
      return resource || "System";
  }
};

const getResponseEntityId = (
  req: Request,
  res: Response,
): string | null => {
  const paramsId = req.params.id;

  if (typeof paramsId === "string" && paramsId.length > 0) {
    return paramsId;
  }

  const responseBody = res.locals.auditResponse as
    | { data?: { id?: unknown } }
    | undefined;
  const responseId = responseBody?.data?.id;

  return typeof responseId === "string" && responseId.length > 0
    ? responseId
    : null;
};

export const auditLogger = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const path = req.originalUrl.split("?")[0];

  if (
    !["POST", "PATCH", "PUT", "DELETE"].includes(req.method) ||
    SKIPPED_PREFIXES.some((prefix) => path.startsWith(prefix))
  ) {
    next();
    return;
  }

  const action = resolveAction(req.method, path);

  if (!action) {
    next();
    return;
  }

  const originalJson = res.json.bind(res);

  res.json = ((body: unknown) => {
    res.locals.auditResponse = body;
    return originalJson(body);
  }) as Response["json"];

  res.on("finish", () => {
    if (res.statusCode < 200 || res.statusCode >= 400) {
      return;
    }

    const actor = req.user;

    if (!actor) {
      return;
    }

    const details = {
      method: req.method,
      path,
      statusCode: res.statusCode,
      params: req.params,
      query: req.query,
      ip: req.ip ?? null,
      userAgent: req.get("user-agent") ?? null,
    } as Prisma.InputJsonValue;

    void prisma.auditLog
      .create({
        data: {
          userId: actor.id,
          action,
          entity: resolveEntity(path),
          entityId: getResponseEntityId(req, res),
          details,
        },
      })
      .catch((error: unknown) => {
        logger.warn("Automatic audit log failed", {
          error: error instanceof Error ? error.message : "Unknown error",
          path,
          action,
        });
      });
  });

  next();
};
