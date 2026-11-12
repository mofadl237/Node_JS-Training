import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validateBody } from "../../../middlewares/validate.middleware.js";
import { StoreCheckoutController } from "./controller.js";
import { guestCheckoutSchema } from "./validation.js";

const router = Router();
const controller = new StoreCheckoutController();

// Creating orders from the public internet needs a tighter limit than reads.
const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many checkout attempts. Try again later.",
    code: "TOO_MANY_REQUESTS",
  },
});

router.post("/checkout", checkoutLimiter, validateBody(guestCheckoutSchema), controller.checkout);

export default router;
