import { Router } from "express";
import { ClinicServiceController } from "./controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validateBody, validateParams, validateQuery } from "../../middlewares/validate.middleware.js";
import {
  clinicServiceIdParamSchema,
  createClinicServiceSchema,
  listClinicServicesQuerySchema,
  updateClinicServiceSchema,
} from "./validation.js";

const router = Router();
const controller = new ClinicServiceController();

router.get("/", validateQuery(listClinicServicesQuerySchema), controller.list);
router.get("/:id", validateParams(clinicServiceIdParamSchema), controller.getById);

router.post("/", authenticate, authorize("ADMIN"), validateBody(createClinicServiceSchema), controller.create);
router.patch("/:id", authenticate, authorize("ADMIN"), validateParams(clinicServiceIdParamSchema), validateBody(updateClinicServiceSchema), controller.update);
router.delete("/:id", authenticate, authorize("ADMIN"), validateParams(clinicServiceIdParamSchema), controller.remove);

export default router;
