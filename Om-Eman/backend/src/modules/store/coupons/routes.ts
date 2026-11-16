import { Router } from "express";
import rateLimit from "express-rate-limit";
import { optionalCustomer } from "../../../middlewares/customer-auth.middleware.js";
import { validateBody } from "../../../middlewares/validate.middleware.js";
import { StoreCouponsController } from "./controller.js";
import { validateCouponSchema } from "./validation.js";

const router = Router();
const controller = new StoreCouponsController();

// Anti brute-force: coupon codes are guessable, so the preview endpoint must
// never be a free oracle. Same shape as the checkout limiter.
const couponLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many coupon attempts, please try again later",
    code: "RATE_LIMITED",
  },
});

router.post(
  "/coupons/validate",
  couponLimiter,
  optionalCustomer,
  validateBody(validateCouponSchema),
  controller.validate,
);

export default router;
