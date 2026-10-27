import { Router } from "express";
import { DoctorServiceController } from "./controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validateBody, validateParams, validateQuery } from "../../middlewares/validate.middleware.js";
import { createDoctorServiceSchema, doctorServiceIdParamSchema, listDoctorServiceQuerySchema, updateDoctorServiceSchema } from "./validation.js";
const router = Router();
const controller = new DoctorServiceController();
router.get("/", validateQuery(listDoctorServiceQuerySchema), controller.list);
router.get("/:id", validateParams(doctorServiceIdParamSchema), controller.getById);
router.post("/", authenticate, authorize("ADMIN", "DOCTOR"), validateBody(createDoctorServiceSchema), controller.create);
router.patch("/:id", authenticate, authorize("ADMIN", "DOCTOR"), validateParams(doctorServiceIdParamSchema), validateBody(updateDoctorServiceSchema), controller.update);
router.delete("/:id", authenticate, authorize("ADMIN", "DOCTOR"), validateParams(doctorServiceIdParamSchema), controller.remove);
export default router;
//# sourceMappingURL=router.js.map