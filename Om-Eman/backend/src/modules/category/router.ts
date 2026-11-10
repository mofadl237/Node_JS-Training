import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { CategoryController } from "./controller.js";
import {
  createCategorySchema,
  listCategoryQuerySchema,
  categoryIdParamSchema,
  updateCategorySchema,
} from "./validation.js";

const router = Router();
const controller = new CategoryController();

router.get(
  "/",
  validateQuery(listCategoryQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  validateParams(categoryIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createCategorySchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(categoryIdParamSchema),
  validateBody(updateCategorySchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(categoryIdParamSchema),
  controller.remove,
);

export default router;
