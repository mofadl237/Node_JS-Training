/**
 * User routes.
 * Why flat registrations instead of router.route(): each verb has its own
 * controller now, which keeps access logs, rate limits, or future auth
 * middleware easy to attach per-endpoint.
 */
import express from "express";
import {
  createUserController,
  deleteUserController,
  getUserController,
  listUsersController,
  updateUserController,
} from "../controllers/users.controllers.js";

export const routerUsers = express.Router();

routerUsers.get("/", listUsersController);
routerUsers.get("/:id", getUserController);
routerUsers.post("/", createUserController);
routerUsers.patch("/:id", updateUserController);
routerUsers.delete("/:id", deleteUserController);


// الاجمد .route(/).get().post(Controllers Functions) 
