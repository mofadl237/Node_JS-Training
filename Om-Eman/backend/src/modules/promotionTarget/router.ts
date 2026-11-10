import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { PromotionTargetController } from "./controller.js";
import {
  createPromotionTargetSchema,
  listPromotionTargetQuerySchema,
  promotionTargetIdParamSchema,
  updatePromotionTargetSchema,
} from "./validation.js";

const router = Router();
const controller = new PromotionTargetController();

router.get(
  "/",
  authenticate, validateQuery(listPromotionTargetQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(promotionTargetIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createPromotionTargetSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(promotionTargetIdParamSchema),
  validateBody(updatePromotionTargetSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(promotionTargetIdParamSchema),
  controller.remove,
);

export default router;
