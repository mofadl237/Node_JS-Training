/**
 * Post routes — same flat registration style as users.routes.js.
 */
import express from "express";
import {
  createPostController,
  deletePostController,
  getPostController,
  listPostsController,
  updatePostController,
} from "../controllers/post.controllers.js";

export const routerPosts = express.Router();

routerPosts.get("/", listPostsController);
routerPosts.get("/:id", getPostController);
routerPosts.post("/", createPostController);
routerPosts.patch("/:id", updatePostController);
routerPosts.delete("/:id", deletePostController);
