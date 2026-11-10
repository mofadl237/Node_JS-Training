import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import type { IAuthPayload } from "../interfaces/auth/IAuthPayload.js";

export function signToken(payload: IAuthPayload): string {
  const expiresIn = env.JWT_EXPIRES_IN as NonNullable<
    SignOptions["expiresIn"]
  >;
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): IAuthPayload {
  return jwt.verify(token, env.JWT_SECRET) as IAuthPayload;
}
