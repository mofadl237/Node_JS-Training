import { Router } from "express";
import { AppointmentController } from "./controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validateBody, validateQuery, validateParams } from "../../middlewares/validate.middleware.js";
import { createAppointmentSchema, availabilityQuerySchema, appointmentIdParamSchema, listAppointmentsQuerySchema, } from "./validation.js";
const router = Router();
const controller = new AppointmentController();
router.get("/availability", validateQuery(availabilityQuerySchema), controller.getAvailability);
router.get("/", authenticate, validateQuery(listAppointmentsQuerySchema), controller.list);
router.get("/:id", authenticate, validateParams(appointmentIdParamSchema), controller.getById);
router.post("/", authenticate, validateBody(createAppointmentSchema), controller.create);
router.patch("/:id/cancel", authenticate, validateParams(appointmentIdParamSchema), controller.cancel);
export default router;
//# sourceMappingURL=router.js.map