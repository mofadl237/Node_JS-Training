import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { ProductBundleComponentController } from "./controller.js";
import {
  createProductBundleComponentSchema,
  listProductBundleComponentQuerySchema,
  productBundleComponentIdParamSchema,
  updateProductBundleComponentSchema,
} from "./validation.js";

const router = Router();
const controller = new ProductBundleComponentController();

router.get(
  "/",
  validateQuery(listProductBundleComponentQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  validateParams(productBundleComponentIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createProductBundleComponentSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(productBundleComponentIdParamSchema),
  validateBody(updateProductBundleComponentSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(productBundleComponentIdParamSchema),
  controller.remove,
);

export default router;
