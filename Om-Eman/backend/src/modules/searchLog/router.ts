import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { SearchLogController } from "./controller.js";
import {
  createSearchLogSchema,
  listSearchLogQuerySchema,
  searchLogIdParamSchema,
  updateSearchLogSchema,
} from "./validation.js";

const router = Router();
const controller = new SearchLogController();

router.get(
  "/",
  authenticate, validateQuery(listSearchLogQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(searchLogIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createSearchLogSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(searchLogIdParamSchema),
  validateBody(updateSearchLogSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(searchLogIdParamSchema),
  controller.remove,
);

export default router;
