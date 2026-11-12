import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticateCustomer } from "../../../middlewares/customer-auth.middleware.js";
import { validateBody } from "../../../middlewares/validate.middleware.js";
import { StoreAuthController } from "./controller.js";
import {
  customerLoginSchema,
  forgotPasswordSchema,
  googleCredentialSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./validation.js";

const router = Router();
const controller = new StoreAuthController();

// Brute-force protection on every endpoint that grants something or proves an
// identity. Counted per IP; the store runs behind one proxy, so trustProxy is
// configured at the app level.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Try again later.",
    code: "TOO_MANY_REQUESTS",
  },
});

router.post("/register", authLimiter, validateBody(registerSchema), controller.register);
router.post("/verify-email", authLimiter, validateBody(verifyEmailSchema), controller.verifyEmail);
router.post("/login", authLimiter, validateBody(customerLoginSchema), controller.login);
router.post("/google", authLimiter, validateBody(googleCredentialSchema), controller.googleLogin);
router.post("/forgot-password", authLimiter, validateBody(forgotPasswordSchema), controller.forgotPassword);
router.post("/reset-password", authLimiter, validateBody(resetPasswordSchema), controller.resetPassword);
router.post("/logout", authenticateCustomer, controller.logout);
router.get("/me", authenticateCustomer, controller.me);

export default router;
