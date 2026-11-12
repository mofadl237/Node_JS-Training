import { Router } from "express";
import { validateBody, validateParams, validateQuery } from "../../../middlewares/validate.middleware.js";
import { authenticateCustomer } from "../../../middlewares/customer-auth.middleware.js";
import { StoreCartController } from "./controller.js";
import {
  addCartItemSchema,
  guestTokenParamSchema,
  mergeCartSchema,
  updateCartItemSchema,
} from "./validation.js";
import { z } from "zod";

const router = Router();
const controller = new StoreCartController();

const guestTokenParams = z.object({ guestToken: guestTokenParamSchema });
const itemParams = guestTokenParams.extend({ itemId: z.string().min(1) });

router.get("/cart", validateQuery(z.object({ guestToken: guestTokenParamSchema.optional() })), controller.getOrCreate);
router.post("/cart/merge", authenticateCustomer, validateBody(mergeCartSchema), controller.merge);
router.get("/cart/:guestToken", validateParams(guestTokenParams), controller.get);
router.post("/cart/:guestToken/items", validateParams(guestTokenParams), validateBody(addCartItemSchema), controller.addItem);
router.patch("/cart/:guestToken/items/:itemId", validateParams(itemParams), validateBody(updateCartItemSchema), controller.updateItem);
router.delete("/cart/:guestToken/items/:itemId", validateParams(itemParams), controller.removeItem);

export default router;
