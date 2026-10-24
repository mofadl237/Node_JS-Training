import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { IJwtPayload } from "../interfaces/auth/IAuthPayload.js";

export function signToken(payload: IJwtPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): IJwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as IJwtPayload;
}
