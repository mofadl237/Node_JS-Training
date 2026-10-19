/**
 * Profile routes — same flat registration style as users.routes.js.
 * `/user/:userId` is registered BEFORE `/:id` so the literal segment
 * "user" is never swallowed by the `:id` wildcard.
 */
import express from "express";
import {
  createProfileController,
  deleteProfileController,
  getProfileByUserController,
  getProfileController,
  listProfilesController,
  updateProfileController,
} from "../controllers/profile.controllers.js";

export const routerProfiles = express.Router();

routerProfiles.get("/", listProfilesController);
routerProfiles.get("/user/:userId", getProfileByUserController);
routerProfiles.get("/:id", getProfileController);
routerProfiles.post("/", createProfileController);
routerProfiles.patch("/:id", updateProfileController);
routerProfiles.delete("/:id", deleteProfileController);
