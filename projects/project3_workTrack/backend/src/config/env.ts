import "dotenv/config";

function getEnv(key: string, required = true): string {
  const value = process.env[key];
  if (required && (value === undefined || value === "")) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value as string;
}

function getBoolean(key: string, fallback: boolean): boolean {
  const value = process.env[key];
  if (value === undefined || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function getNumber(key: string, fallback: number): number {
  const value = Number(process.env[key]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function resolveTimeZone(key: string, fallback: string): string {
  const candidate = process.env[key]?.trim() || fallback;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: candidate }).format();
    return candidate;
  } catch {
    return fallback;
  }
}

const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const appTimeZone = resolveTimeZone("APP_TIMEZONE", systemTimeZone);

const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const smtpPort = getNumber("SMTP_PORT", 587);

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: getNumber("PORT", 3000),
  DATABASE_URL: getEnv("DATABASE_URL"),
  JWT_SECRET: getEnv("JWT_SECRET", false) || "change_me_in_production_use_long_random_string",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  REFRESH_TOKEN_TTL_DAYS: getNumber("REFRESH_TOKEN_TTL_DAYS", 30),
  BCRYPT_SALT_ROUNDS: getNumber("BCRYPT_SALT_ROUNDS", 12),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  APP_NAME: process.env.APP_NAME || "WorkTrack HR",
  APP_TIMEZONE: appTimeZone,
  LOG_LEVEL: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
  EMAIL_ENABLED: getBoolean("EMAIL_ENABLED", true),
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: smtpPort,
  SMTP_SECURE: getBoolean("SMTP_SECURE", smtpPort === 465),
  SMTP_USER: smtpUser,
  SMTP_PASS: smtpPass,
  SMTP_FROM:
    process.env.SMTP_FROM ||
    (smtpUser
      ? `${process.env.APP_NAME || "WorkTrack HR"} <${smtpUser}>`
      : "WorkTrack HR <no-reply@worktrack.local>"),
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
  REMINDER_CRON: process.env.REMINDER_CRON || "0 8 * * *",
  REMINDER_TIMEZONE: resolveTimeZone("REMINDER_TIMEZONE", appTimeZone),
  ATTENDANCE_AUTO_ENABLED: getBoolean("ATTENDANCE_AUTO_ENABLED", true),
  ATTENDANCE_CRON: process.env.ATTENDANCE_CRON || "0 2 * * *",
  ATTENDANCE_TIMEZONE: resolveTimeZone("ATTENDANCE_TIMEZONE", appTimeZone),
  ATTENDANCE_LOOKBACK_DAYS: getNumber("ATTENDANCE_LOOKBACK_DAYS", 1),
  ATTENDANCE_WORKER_CONCURRENCY: getNumber("ATTENDANCE_WORKER_CONCURRENCY", 1),
  ATTENDANCE_BATCH_SIZE: getNumber("ATTENDANCE_BATCH_SIZE", 100),
} as const;

export type Env = typeof env;
