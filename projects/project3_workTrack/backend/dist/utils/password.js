import bcrypt from "bcrypt";
import { env } from "../config/env.js";
const SALT_ROUNDS = env.BCRYPT_SALT_ROUNDS;
export async function hashPassword(plainPassword) {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
}
export async function comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}
//# sourceMappingURL=password.js.map