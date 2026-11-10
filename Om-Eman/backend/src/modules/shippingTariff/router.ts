import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { ShippingTariffController } from "./controller.js";
import {
  createShippingTariffSchema,
  listShippingTariffQuerySchema,
  shippingTariffIdParamSchema,
  updateShippingTariffSchema,
} from "./validation.js";

const router = Router();
const controller = new ShippingTariffController();

router.get(
  "/",
  authenticate, validateQuery(listShippingTariffQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(shippingTariffIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createShippingTariffSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(shippingTariffIdParamSchema),
  validateBody(updateShippingTariffSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(shippingTariffIdParamSchema),
  controller.remove,
);

export default router;
