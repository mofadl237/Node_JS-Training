import { Router } from "express";
import { validateParams } from "../../../middlewares/validate.middleware.js";
import { StoreProductController } from "./controller.js";
import { slugParamSchema } from "./validation.js";

const router = Router();
const controller = new StoreProductController();

router.get("/products/:slug", validateParams(slugParamSchema), controller.getBySlug);

export default router;
