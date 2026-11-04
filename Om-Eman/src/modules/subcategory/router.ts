import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { SubcategoryController } from "./controller.js";
import {
  createSubcategorySchema,
  listSubcategoryQuerySchema,
  subcategoryIdParamSchema,
  updateSubcategorySchema,
} from "./validation.js";

const router = Router();
const controller = new SubcategoryController();

router.get(
  "/",
  validateQuery(listSubcategoryQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  validateParams(subcategoryIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createSubcategorySchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(subcategoryIdParamSchema),
  validateBody(updateSubcategorySchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(subcategoryIdParamSchema),
  controller.remove,
);

export default router;
