import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { AuthController } from "./controller.js";
import { loginSchema } from "./validation.js";

const router = Router();
const controller = new AuthController();

router.post("/login", validateBody(loginSchema), controller.login);
router.get("/me", authenticate, controller.me);

export default router;
