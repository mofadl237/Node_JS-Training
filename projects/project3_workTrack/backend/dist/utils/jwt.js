import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export function signToken(payload) {
    const options = {
        expiresIn: env.JWT_EXPIRES_IN,
    };
    return jwt.sign(payload, env.JWT_SECRET, options);
}
export function verifyToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
}
//# sourceMappingURL=jwt.js.map