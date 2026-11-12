import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validateParams } from "../../../middlewares/validate.middleware.js";
import { StoreTrackController } from "./controller.js";
import { trackingTokenParamSchema } from "./validation.js";
import { z } from "zod";

const router = Router();
const controller = new StoreTrackController();

const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const paramSchema = z.object({ trackingToken: trackingTokenParamSchema });

router.get("/track/:trackingToken", trackLimiter, validateParams(paramSchema), controller.track);

export default router;
