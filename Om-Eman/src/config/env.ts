import "dotenv/config";
import { EEnvironment } from "../enums/EEnvironment.js";
import { ELogLevel } from "../enums/ELogLevel.js";

export interface IEnvConfig {
  readonly NODE_ENV: EEnvironment;
  readonly PORT: number;
  readonly DATABASE_URL: string;
  readonly JWT_SECRET: string;
  readonly JWT_EXPIRES_IN: string;
  readonly BCRYPT_SALT_ROUNDS: number;
  readonly CORS_ORIGIN: string;
  readonly APP_NAME: string;
  readonly APP_TIMEZONE: string;
  readonly DEFAULT_CURRENCY: string;
  readonly LOG_LEVEL: ELogLevel;
  readonly LOG_FILE: string;
  readonly EMAIL_ENABLED: boolean;
  readonly SMTP_HOST: string;
  readonly SMTP_PORT: number;
  readonly SMTP_SECURE: boolean;
  readonly SMTP_USER: string;
  readonly SMTP_PASS: string;
  readonly SMTP_FROM: string;
}

function getEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnv(key: string, fallback: string): string {
  const value = process.env[key];
  return value === undefined || value === "" ? fallback : value;
}

function getNumber(key: string, fallback: number): number {
  const value = process.env[key];
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getBoolean(key: string, fallback: boolean): boolean {
  const value = process.env[key];
  if (value === undefined || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function getEnvironment(): EEnvironment {
  const value = process.env.NODE_ENV?.toLowerCase();
  return Object.values(EEnvironment).includes(value as EEnvironment)
    ? (value as EEnvironment)
    : EEnvironment.DEVELOPMENT;
}

function getLogLevel(): ELogLevel {
  const value = process.env.LOG_LEVEL?.toLowerCase();
  return Object.values(ELogLevel).includes(value as ELogLevel)
    ? (value as ELogLevel)
    : ELogLevel.INFO;
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

const nodeEnv = getEnvironment();
const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const appTimeZone = resolveTimeZone("APP_TIMEZONE", systemTimeZone);
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const smtpPort = getNumber("SMTP_PORT", 587);
const appName = process.env.APP_NAME || "Om Eman";

export const env: Readonly<IEnvConfig> = Object.freeze({
  NODE_ENV: nodeEnv,
  PORT: getNumber("PORT", 3000),
  DATABASE_URL: getEnv("DATABASE_URL"),
  JWT_SECRET:
    nodeEnv === EEnvironment.PRODUCTION
      ? getEnv("JWT_SECRET")
      : getOptionalEnv(
          "JWT_SECRET",
          "change_me_in_production_use_long_random_string",
        ),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  BCRYPT_SALT_ROUNDS: getNumber("BCRYPT_SALT_ROUNDS", 12),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  APP_NAME: appName,
  APP_TIMEZONE: appTimeZone,
  DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY || "EGP",
  LOG_LEVEL: getLogLevel(),
  LOG_FILE: process.env.LOG_FILE || "logs/app.log",
  EMAIL_ENABLED: getBoolean("EMAIL_ENABLED", false),
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: smtpPort,
  SMTP_SECURE: getBoolean("SMTP_SECURE", smtpPort === 465),
  SMTP_USER: smtpUser,
  SMTP_PASS: smtpPass,
  SMTP_FROM:
    process.env.SMTP_FROM ||
    (smtpUser
      ? `${appName} <${smtpUser}>`
      : `${appName} <no-reply@om-eman.local>`),
});

export default env;
