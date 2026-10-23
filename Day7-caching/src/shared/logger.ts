/**
 * Tiny dependency-free logger.
 *
 * Why: in development console output is enough, but in production we need to
 * know what happened after a crash. Every line is written as JSON to
 *   logs/app-YYYY-MM-DD.log
 * and errors are additionally written to
 *   logs/error-YYYY-MM-DD.log
 *
 * The files live on the machine running the API today. Moving them to a log
 * server later only requires changing `write()` (or shipping these files with
 * Filebeat / Promtail / a similar agent) — callers do not change.
 */
import { createWriteStream, mkdirSync, type WriteStream } from "node:fs";
import { join } from "node:path";
import { env } from "../config/env.js";

export type LogLevel = "debug" | "info" | "warn" | "error";

const streams = new Map<string, WriteStream>();

mkdirSync(env.LOG_DIR, { recursive: true });

function streamFor(fileName: string): WriteStream {
  const existing = streams.get(fileName);
  if (existing) return existing;

  const stream = createWriteStream(join(env.LOG_DIR, fileName), { flags: "a" });
  stream.on("error", (error) => {
    // If disk logging fails we must not crash the request — fall back to stderr.
    console.error(`[logger] failed to write ${fileName}`, error);
  });
  streams.set(fileName, stream);
  return stream;
}

function dateStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

function serializeError(error: Error): Record<string, unknown> {
  const result: Record<string, unknown> = {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };

  if ("code" in error) {
    result["code"] = (error as Error & { code?: unknown }).code;
  }
  if ("statusCode" in error) {
    result["statusCode"] = (error as Error & { statusCode?: unknown }).statusCode;
  }

  return result;
}

function normalizeMeta(meta?: Record<string, unknown>): Record<string, unknown> {
  if (!meta) return {};

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(meta)) {
    result[key] = value instanceof Error ? serializeError(value) : value;
  }
  return result;
}

function write(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  const normalizedMeta = normalizeMeta(meta);
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...normalizedMeta,
  };
  const line = `${JSON.stringify(entry)}\n`;

  streamFor(`app-${dateStamp()}.log`).write(line);
  if (level === "error") {
    streamFor(`error-${dateStamp()}.log`).write(line);
  }

  if (env.NODE_ENV !== "production") {
    const suffix =
      Object.keys(normalizedMeta).length > 0 ? ` ${JSON.stringify(normalizedMeta)}` : "";
    const consoleFn =
      level === "error" ? console.error : level === "warn" ? console.warn : console.log;
    consoleFn(`[${entry.timestamp}] ${level.toUpperCase()} ${message}${suffix}`);
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>): void => write("debug", message, meta),
  info: (message: string, meta?: Record<string, unknown>): void => write("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>): void => write("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>): void => write("error", message, meta),
};

/** Flush and close all log streams (used during graceful shutdown). */
export function closeLogger(): void {
  for (const stream of streams.values()) {
    stream.end();
  }
  streams.clear();
}
