import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { ShippingCarrierController } from "./controller.js";
import {
  createShippingCarrierSchema,
  listShippingCarrierQuerySchema,
  shippingCarrierIdParamSchema,
  updateShippingCarrierSchema,
} from "./validation.js";

const router = Router();
const controller = new ShippingCarrierController();

router.get(
  "/",
  authenticate, validateQuery(listShippingCarrierQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(shippingCarrierIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createShippingCarrierSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(shippingCarrierIdParamSchema),
  validateBody(updateShippingCarrierSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(shippingCarrierIdParamSchema),
  controller.remove,
);

export default router;
