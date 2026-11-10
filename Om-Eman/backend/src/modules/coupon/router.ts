import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { CouponController } from "./controller.js";
import {
  createCouponSchema,
  listCouponQuerySchema,
  couponIdParamSchema,
  updateCouponSchema,
} from "./validation.js";

const router = Router();
const controller = new CouponController();

router.get(
  "/",
  authenticate, validateQuery(listCouponQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(couponIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createCouponSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(couponIdParamSchema),
  validateBody(updateCouponSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(couponIdParamSchema),
  controller.remove,
);

export default router;
