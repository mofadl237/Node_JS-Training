import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { ShipmentStatusHistoryController } from "./controller.js";
import {
  createShipmentStatusHistorySchema,
  listShipmentStatusHistoryQuerySchema,
  shipmentStatusHistoryIdParamSchema,
  updateShipmentStatusHistorySchema,
} from "./validation.js";

const router = Router();
const controller = new ShipmentStatusHistoryController();

router.get(
  "/",
  authenticate, validateQuery(listShipmentStatusHistoryQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(shipmentStatusHistoryIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createShipmentStatusHistorySchema),
  controller.create,
);

export default router;
