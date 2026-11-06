import { createHash, randomBytes } from "node:crypto";
import { env } from "../config/env.js";
const MILLISECONDS_PER_DAY = 86_400_000;
export const createRefreshToken = () => randomBytes(48).toString("base64url");
export const hashRefreshToken = (token) => createHash("sha256").update(token).digest("hex");
export const getRefreshTokenExpiry = () => new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * MILLISECONDS_PER_DAY);
//# sourceMappingURL=refresh-token.js.map