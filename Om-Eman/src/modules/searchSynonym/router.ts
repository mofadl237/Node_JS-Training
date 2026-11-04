import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { SearchSynonymController } from "./controller.js";
import {
  createSearchSynonymSchema,
  listSearchSynonymQuerySchema,
  searchSynonymIdParamSchema,
  updateSearchSynonymSchema,
} from "./validation.js";

const router = Router();
const controller = new SearchSynonymController();

router.get(
  "/",
  validateQuery(listSearchSynonymQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  validateParams(searchSynonymIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createSearchSynonymSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(searchSynonymIdParamSchema),
  validateBody(updateSearchSynonymSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(searchSynonymIdParamSchema),
  controller.remove,
);

export default router;
