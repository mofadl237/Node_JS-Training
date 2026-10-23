import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function optionalInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Environment variable ${name} must be a positive integer`);
  }
  return parsed;
}

export const env = {
  NODE_ENV: process.env["NODE_ENV"] ?? "development",
  PORT: optionalInt("PORT", 3000),
  DATABASE_URL: required("DATABASE_URL"),
  REDIS_URL: process.env["REDIS_URL"]?.trim() ?? "",
  LOG_DIR: process.env["LOG_DIR"]?.trim() || "logs",
  CORS_ORIGIN: process.env["CORS_ORIGIN"]?.trim() || "*",
  CACHE_TTL_SECONDS: optionalInt("CACHE_TTL_SECONDS", 60),
} as const;
