import { Router } from "express";
import { StoreSettingsController } from "./controller.js";

const router = Router();
const controller = new StoreSettingsController();

router.get("/settings", controller.get);

export default router;
