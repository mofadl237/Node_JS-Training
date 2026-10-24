import bcrypt from "bcrypt";
import { env } from "../config/env.js";

const SALT_ROUNDS = env.BCRYPT_SALT_ROUNDS;

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
