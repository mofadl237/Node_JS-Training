import { createHash, randomBytes } from "node:crypto";
import { env } from "../config/env.js";

const MILLISECONDS_PER_DAY = 86_400_000;

export const createRefreshToken = (): string =>
  randomBytes(48).toString("base64url");

export const hashRefreshToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");

export const getRefreshTokenExpiry = (): Date =>
  new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * MILLISECONDS_PER_DAY);
