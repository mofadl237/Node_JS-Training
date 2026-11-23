import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { EEmployeeRole } from "@prisma/client";
import { optionalCustomer } from "../../middlewares/customer-auth.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { UploadsController } from "./controller.js";
import { proofSignSchema, uploadSignSchema } from "./validation.js";

const router = Router();
const controller = new UploadsController();

// Same budget as the proof endpoint itself: 10 signed uploads per hour.
const proofSignLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many upload attempts, please try again later",
    code: "RATE_LIMITED",
  },
});

// Employee-only: dashboard forms request a signature, then the browser
// uploads the file directly to Cloudinary with it.
router.post(
  "/sign",
  authenticate,
  authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN),
  validateBody(uploadSignSchema),
  controller.sign,
);

// Public: proof uploads are signed after checking the order + tracking token.
router.post(
  "/sign-proof",
  proofSignLimiter,
  optionalCustomer,
  validateBody(proofSignSchema),
  controller.signProof,
);

export default router;
