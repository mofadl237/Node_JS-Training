import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { ProductController } from "./controller.js";
import {
  createProductSchema,
  listProductQuerySchema,
  productIdParamSchema,
  updateProductSchema,
} from "./validation.js";

const router = Router();
const controller = new ProductController();

router.get(
  "/",
  validateQuery(listProductQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  validateParams(productIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createProductSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(productIdParamSchema),
  validateBody(updateProductSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(productIdParamSchema),
  controller.remove,
);

export default router;
