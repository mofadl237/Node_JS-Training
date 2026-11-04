import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { PaymentController } from "./controller.js";
import {
  createPaymentSchema,
  listPaymentQuerySchema,
  paymentIdParamSchema,
  updatePaymentSchema,
} from "./validation.js";

const router = Router();
const controller = new PaymentController();

router.get(
  "/",
  authenticate, validateQuery(listPaymentQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(paymentIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createPaymentSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(paymentIdParamSchema),
  validateBody(updatePaymentSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(paymentIdParamSchema),
  controller.remove,
);

export default router;
