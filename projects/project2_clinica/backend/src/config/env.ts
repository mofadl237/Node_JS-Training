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

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL: getEnv("DATABASE_URL"),
  JWT_SECRET: getEnv("JWT_SECRET", false) || "change_me_in_production_use_long_random_string",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  APP_NAME: process.env.APP_NAME || "Clinica",
  APP_TIMEZONE: appTimeZone,
  EMAIL_ENABLED: getBoolean("EMAIL_ENABLED", true),
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_SECURE: getBoolean("SMTP_SECURE", Number(process.env.SMTP_PORT) === 465),
  SMTP_USER: smtpUser,
  SMTP_PASS: smtpPass,
  SMTP_FROM: process.env.SMTP_FROM || (smtpUser ? `${process.env.APP_NAME || "Clinica"} <${smtpUser}>` : "Clinica <no-reply@clinica.local>"),
  REMINDER_CRON: process.env.REMINDER_CRON || "0 8 * * *",
  REMINDER_TIMEZONE: resolveTimeZone("REMINDER_TIMEZONE", appTimeZone),
} as const;
