/**
 * Request logging + correlation id.
 *
 * Every request gets an `x-request-id` (incoming one is reused when present).
 * The id is attached to response headers, logs and error payloads, so a
 * support ticket can be matched with exact log lines.
 */
import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";
import { logger } from "./logger.js";

export const requestLogger: RequestHandler = (req, res, next) => {
  const incoming = req.header("x-request-id");
  const requestId =
    incoming && incoming.trim() !== "" ? incoming.trim().slice(0, 100) : randomUUID();

  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);

  const startedAt = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const meta = {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs * 100) / 100,
      ip: req.ip,
    };

    if (res.statusCode >= 500) logger.error("HTTP request", meta);
    else if (res.statusCode >= 400) logger.warn("HTTP request", meta);
    else logger.info("HTTP request", meta);
  });

  next();
};
