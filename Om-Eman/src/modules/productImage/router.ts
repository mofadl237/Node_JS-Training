import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { ProductImageController } from "./controller.js";
import {
  createProductImageSchema,
  listProductImageQuerySchema,
  productImageIdParamSchema,
  updateProductImageSchema,
} from "./validation.js";

const router = Router();
const controller = new ProductImageController();

router.get(
  "/",
  validateQuery(listProductImageQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  validateParams(productImageIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createProductImageSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(productImageIdParamSchema),
  validateBody(updateProductImageSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(productImageIdParamSchema),
  controller.remove,
);

export default router;
