import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { ShipmentController } from "./controller.js";
import {
  createShipmentSchema,
  listShipmentQuerySchema,
  shipmentIdParamSchema,
  updateShipmentSchema,
} from "./validation.js";

const router = Router();
const controller = new ShipmentController();

router.get(
  "/",
  authenticate, validateQuery(listShipmentQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(shipmentIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createShipmentSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(shipmentIdParamSchema),
  validateBody(updateShipmentSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(shipmentIdParamSchema),
  controller.remove,
);

export default router;
