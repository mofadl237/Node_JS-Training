import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { ProductAliasController } from "./controller.js";
import {
  createProductAliasSchema,
  listProductAliasQuerySchema,
  productAliasIdParamSchema,
  updateProductAliasSchema,
} from "./validation.js";

const router = Router();
const controller = new ProductAliasController();

router.get(
  "/",
  validateQuery(listProductAliasQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  validateParams(productAliasIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createProductAliasSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(productAliasIdParamSchema),
  validateBody(updateProductAliasSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(productAliasIdParamSchema),
  controller.remove,
);

export default router;
