import { Router } from "express";
import authRouter from "./auth/routes.js";
import checkoutRouter from "./checkout/routes.js";
import trackRouter from "./track/routes.js";
import cartRouter from "./cart/routes.js";
import searchRouter from "./search/routes.js";
import paymentRouter from "./payments/routes.js";
import productRouter from "./products/routes.js";

// Public/customer-facing storefront API. Mounted under /api/store.
// Dashboard endpoints live in the generated modules, not here.
const router = Router();

router.use("/auth", authRouter);
router.use("/", checkoutRouter);
router.use("/", trackRouter);
router.use("/", cartRouter);
router.use("/", searchRouter);
router.use("/", paymentRouter);
router.use("/", productRouter);

export default router;
