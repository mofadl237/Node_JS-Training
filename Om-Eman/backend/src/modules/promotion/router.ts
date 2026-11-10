import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { PromotionController } from "./controller.js";
import {
  createPromotionSchema,
  listPromotionQuerySchema,
  promotionIdParamSchema,
  updatePromotionSchema,
} from "./validation.js";

const router = Router();
const controller = new PromotionController();

router.get(
  "/",
  authenticate, validateQuery(listPromotionQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(promotionIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createPromotionSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(promotionIdParamSchema),
  validateBody(updatePromotionSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(promotionIdParamSchema),
  controller.remove,
);

export default router;
