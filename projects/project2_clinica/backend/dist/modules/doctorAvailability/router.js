import { Router } from "express";
import { DoctorAvailabilityController } from "./controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validateBody, validateParams, validateQuery } from "../../middlewares/validate.middleware.js";
import { availabilityIdParamSchema, createDoctorAvailabilitySchema, doctorIdQuerySchema, updateDoctorAvailabilitySchema } from "./validation.js";
const router = Router();
const controller = new DoctorAvailabilityController();
router.get("/", validateQuery(doctorIdQuerySchema), controller.list);
router.get("/:id", validateParams(availabilityIdParamSchema), controller.getById);
router.post("/", authenticate, authorize("ADMIN", "DOCTOR"), validateBody(createDoctorAvailabilitySchema), controller.create);
router.patch("/:id", authenticate, authorize("ADMIN", "DOCTOR"), validateParams(availabilityIdParamSchema), validateBody(updateDoctorAvailabilitySchema), controller.update);
router.delete("/:id", authenticate, authorize("ADMIN", "DOCTOR"), validateParams(availabilityIdParamSchema), controller.remove);
export default router;
//# sourceMappingURL=router.js.map