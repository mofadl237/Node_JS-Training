import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { PromotionRedemptionController } from "./controller.js";
import {
  createPromotionRedemptionSchema,
  listPromotionRedemptionQuerySchema,
  promotionRedemptionIdParamSchema,
  updatePromotionRedemptionSchema,
} from "./validation.js";

const router = Router();
const controller = new PromotionRedemptionController();

router.get(
  "/",
  authenticate, validateQuery(listPromotionRedemptionQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(promotionRedemptionIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createPromotionRedemptionSchema),
  controller.create,
);

export default router;
