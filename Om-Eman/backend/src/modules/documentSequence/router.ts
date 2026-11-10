import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { DocumentSequenceController } from "./controller.js";
import {
  createDocumentSequenceSchema,
  listDocumentSequenceQuerySchema,
  documentSequenceIdParamSchema,
  updateDocumentSequenceSchema,
} from "./validation.js";

const router = Router();
const controller = new DocumentSequenceController();

router.get(
  "/",
  authenticate, validateQuery(listDocumentSequenceQuerySchema),
  controller.list,
);
router.get(
  "/:id",
  authenticate, validateParams(documentSequenceIdParamSchema),
  controller.getById,
);

router.post(
  "/",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateBody(createDocumentSequenceSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(documentSequenceIdParamSchema),
  validateBody(updateDocumentSequenceSchema),
  controller.update,
);
router.delete(
  "/:id",
  authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), validateParams(documentSequenceIdParamSchema),
  controller.remove,
);

export default router;
