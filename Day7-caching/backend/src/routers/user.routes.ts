import express from "express";
import {
  createUserController,
  deleteUserController,
  getUserController,
  listUsersController,
  updateUserController,
} from "../controllers/user.controllers.js";

export const routerUsers = express.Router();

routerUsers.get("/", listUsersController);
routerUsers.get("/:id", getUserController);
routerUsers.post("/", createUserController);
routerUsers.patch("/:id", updateUserController);
routerUsers.delete("/:id", deleteUserController);
