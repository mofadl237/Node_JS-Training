import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { CartController } from "./controller.js";
import {
  createCartSchema,
  listCartQuerySchema,
  cartIdParamSchema,
  updateCartSchema,
} from "./validation.js";

const router = Router();
const controller = new CartController();

router.get(
  "/",
  authenticate, validateQuery(listCartQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(cartIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createCartSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(cartIdParamSchema),
  validateBody(updateCartSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(cartIdParamSchema),
  controller.remove,
);

export default router;
