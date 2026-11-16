import { Router } from "express";
import { StoreSitemapController } from "./controller.js";

const router = Router();
const controller = new StoreSitemapController();

router.get("/sitemap", controller.get);

export default router;
