import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { InvoiceController } from "./controller.js";
import {
  createInvoiceSchema,
  listInvoiceQuerySchema,
  invoiceIdParamSchema,
  updateInvoiceSchema,
} from "./validation.js";

const router = Router();
const controller = new InvoiceController();

router.get(
  "/",
  authenticate, validateQuery(listInvoiceQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(invoiceIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createInvoiceSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(invoiceIdParamSchema),
  validateBody(updateInvoiceSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(invoiceIdParamSchema),
  controller.remove,
);

export default router;
