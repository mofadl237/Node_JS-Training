import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { CustomerAddressController } from "./controller.js";
import {
  createCustomerAddressSchema,
  listCustomerAddressQuerySchema,
  customerAddressIdParamSchema,
  updateCustomerAddressSchema,
} from "./validation.js";

const router = Router();
const controller = new CustomerAddressController();

router.get(
  "/",
  authenticate, validateQuery(listCustomerAddressQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(customerAddressIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createCustomerAddressSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(customerAddressIdParamSchema),
  validateBody(updateCustomerAddressSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(customerAddressIdParamSchema),
  controller.remove,
);

export default router;
