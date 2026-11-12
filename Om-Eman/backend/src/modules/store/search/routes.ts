import { Router } from "express";
import { optionalCustomer } from "../../../middlewares/customer-auth.middleware.js";
import { validateQuery } from "../../../middlewares/validate.middleware.js";
import { StoreSearchController } from "./controller.js";
import { searchQuerySchema } from "./validation.js";

const router = Router();
const controller = new StoreSearchController();

router.get(
  "/search",
  optionalCustomer,
  validateQuery(searchQuerySchema),
  controller.search,
);

export default router;
