import { Router } from "express";
import { validateQuery } from "../../../middlewares/validate.middleware.js";
import { StoreShippingController } from "./controller.js";
import { shippingQuoteQuerySchema } from "./validation.js";

const router = Router();
const controller = new StoreShippingController();

router.get("/shipping/areas", controller.getAreas);
router.get("/shipping/quote", validateQuery(shippingQuoteQuerySchema), controller.getQuote);

export default router;
