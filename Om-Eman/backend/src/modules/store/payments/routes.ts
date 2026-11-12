import { Router } from "express";
import rateLimit from "express-rate-limit";
import { optionalCustomer } from "../../../middlewares/customer-auth.middleware.js";
import { validateBody } from "../../../middlewares/validate.middleware.js";
import { StorePaymentController } from "./controller.js";
import { paymentProofSchema } from "./validation.js";

const router = Router();
const controller = new StorePaymentController();

const proofLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

router.post(
  "/payments/proof",
  proofLimiter,
  optionalCustomer,
  validateBody(paymentProofSchema),
  controller.submitProof,
);

export default router;
