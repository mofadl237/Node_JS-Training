import { Router } from "express";
import { StoreCategoriesController } from "./controller.js";

const router = Router();
const controller = new StoreCategoriesController();

router.get("/categories", controller.getTree);

export default router;
