import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { ProductPackageController } from "./controller.js";
import {
  createProductPackageSchema,
  listProductPackageQuerySchema,
  productPackageIdParamSchema,
  updateProductPackageSchema,
} from "./validation.js";

const router = Router();
const controller = new ProductPackageController();

router.get(
  "/",
  validateQuery(listProductPackageQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  validateParams(productPackageIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createProductPackageSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(productPackageIdParamSchema),
  validateBody(updateProductPackageSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(productPackageIdParamSchema),
  controller.remove,
);

export default router;
