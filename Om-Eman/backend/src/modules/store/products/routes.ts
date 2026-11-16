import { Router } from "express";
import { validateParams, validateQuery } from "../../../middlewares/validate.middleware.js";
import { StoreProductController } from "./controller.js";
import {
  listStoreProductsQuerySchema,
  slugParamSchema,
} from "./validation.js";

const router = Router();
const controller = new StoreProductController();

// Storefront catalog. Public: ACTIVE products with published packages only.
router.get(
  "/products",
  validateQuery(listStoreProductsQuerySchema),
  controller.list,
);
router.get(
  "/products/:slug",
  validateParams(slugParamSchema),
  controller.getBySlug,
);

export default router;
