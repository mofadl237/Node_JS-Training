/**
 * Post HTTP controllers — same thin-controller contract as users.
 * Express 5 forwards async errors to the error middleware automatically.
 */
import type { Request, Response } from "express";
import {
  createPostService,
  deletePostService,
  getPostByIdService,
  getPostsService,
  updatePostService,
} from "../services/post.services.js";
import {
  parseCreatePostBody,
  parseGetPostsQuery,
  parseIdParam,
  parseUpdatePostBody,
} from "../shared/validate.js";

/** GET /api/posts — filtered/sorted/paginated list. */
export async function listPostsController(req: Request, res: Response): Promise<void> {
  const options = parseGetPostsQuery(req.query as Record<string, unknown>);
  const result = await getPostsService(options);
  res.status(200).json(result);
}

/** GET /api/posts/:id */
export async function getPostController(req: Request, res: Response): Promise<void> {
  const id = parseIdParam(req.params["id"], "Post");
  const post = await getPostByIdService(id);
  res.status(200).json({ success: true, data: post });
}

/** POST /api/posts — 201 Created on success. */
export async function createPostController(req: Request, res: Response): Promise<void> {
  const input = parseCreatePostBody(req.body);
  const post = await createPostService(input);
  res.status(201).json({ success: true, data: post });
}

/** PATCH /api/posts/:id — partial update, omitted fields stay untouched. */
export async function updatePostController(req: Request, res: Response): Promise<void> {
  const id = parseIdParam(req.params["id"], "Post");
  const data = parseUpdatePostBody(req.body);
  const post = await updatePostService(id, data);
  res.status(200).json({ success: true, data: post });
}

/** DELETE /api/posts/:id — 200 with a confirmation payload. */
export async function deletePostController(req: Request, res: Response): Promise<void> {
  const id = parseIdParam(req.params["id"], "Post");
  await deletePostService(id);
  res.status(200).json({ success: true, message: `Post ${id} deleted successfully` });
}
