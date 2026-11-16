import { Router } from "express";
import { validateParams } from "../../../middlewares/validate.middleware.js";
import { z } from "zod";
import { StoreContentController } from "./controller.js";

const router = Router();
const controller = new StoreContentController();

const slugParams = z.object({
  slug: z
    .string("slug is required")
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug is invalid"),
});

router.get("/banners", controller.getBanners);
router.get("/faqs", controller.getFaqs);
router.get("/pages/:slug", validateParams(slugParams), controller.getPage);

export default router;
