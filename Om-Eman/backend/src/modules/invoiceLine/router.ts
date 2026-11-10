import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { InvoiceLineController } from "./controller.js";
import {
  createInvoiceLineSchema,
  listInvoiceLineQuerySchema,
  invoiceLineIdParamSchema,
  updateInvoiceLineSchema,
} from "./validation.js";

const router = Router();
const controller = new InvoiceLineController();

router.get(
  "/",
  authenticate, validateQuery(listInvoiceLineQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(invoiceLineIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createInvoiceLineSchema),
  controller.create,
);

export default router;
