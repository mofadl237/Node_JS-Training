import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { CartItemController } from "./controller.js";
import {
  createCartItemSchema,
  listCartItemQuerySchema,
  cartItemIdParamSchema,
  updateCartItemSchema,
} from "./validation.js";

const router = Router();
const controller = new CartItemController();

router.get(
  "/",
  authenticate, validateQuery(listCartItemQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(cartItemIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createCartItemSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(cartItemIdParamSchema),
  validateBody(updateCartItemSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(cartItemIdParamSchema),
  controller.remove,
);

export default router;
