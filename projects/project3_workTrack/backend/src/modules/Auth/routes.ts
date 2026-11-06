import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { rateLimit } from "../../middlewares/rate-limit.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { AuthController } from "./controller.js";
import {
  loginSchema,
  logoutBodySchema,
  refreshTokenBodySchema,
  registerSchema,
} from "./validation.js";

const router = Router();
const authController = new AuthController();

const registerLimiter = rateLimit({
  keyPrefix: "auth-register",
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many registration attempts. Please try again later.",
});

const loginLimiter = rateLimit({
  keyPrefix: "auth-login",
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again later.",
});

const refreshLimiter = rateLimit({
  keyPrefix: "auth-refresh",
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many token refresh attempts. Please try again later.",
});

router.post(
  "/register",
  registerLimiter,
  validateBody(registerSchema),
  authController.register,
);
router.post("/login", loginLimiter, validateBody(loginSchema), authController.login);
router.post(
  "/refresh",
  refreshLimiter,
  validateBody(refreshTokenBodySchema),
  authController.refresh,
);
router.post(
  "/logout",
  refreshLimiter,
  validateBody(logoutBodySchema),
  authController.logout,
);
router.get("/me", authenticate, authController.me);

export default router;
