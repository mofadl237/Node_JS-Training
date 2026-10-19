/**
 * User HTTP controllers.
 *
 * Why they stay thin: each handler only parses/validates transport data
 * (params, query, body), delegates to a service, and writes the response.
 * No Prisma calls and no business logic live here, so changing the DB layer
 * never requires touching HTTP code (and vice versa).
 *
 * Express 5 (installed here) automatically catches errors thrown by or
 * rejected from async handlers and forwards them to the error middleware —
 * no try/catch or wrapper needed.
 */
import type { Request, Response } from "express";
import {
  createUserService,
  deleteUserService,
  getUserByIdService,
  getUsersService,
  updateUserService,
} from "../services/users.services.js";
import {
  parseCreateUserBody,
  parseGetUsersQuery,
  parseUpdateUserBody,
  parseUserIdParam,
} from "../shared/validate.js";

/** GET /api/users — filtered/searched/sorted/paginated list. */
export async function listUsersController(req: Request, res: Response): Promise<void> {
  // req.query values can be strings/arrays/objects (qs parsing) — the parser
  // rejects anything that is not a plain string, so the service only ever
  // sees validated, typed options.
  const options = parseGetUsersQuery(req.query as Record<string, unknown>);
  const result = await getUsersService(options);
  // 200 + { data, pagination } — the stable response contract of this API.
  res.status(200).json(result);
}

/** GET /api/users/:id */
export async function getUserController(req: Request, res: Response): Promise<void> {
  const id = parseUserIdParam(req.params["id"]);
  const user = await getUserByIdService(id);
  res.status(200).json({ success: true, data: user });
}

/** POST /api/users — 201 Created on success. */
export async function createUserController(req: Request, res: Response): Promise<void> {
  const input = parseCreateUserBody(req.body);
  const user = await createUserService(input);
  res.status(201).json({ success: true, data: user });
}

/** PATCH /api/users/:id — partial update, omitted fields stay untouched. */
export async function updateUserController(req: Request, res: Response): Promise<void> {
  const id = parseUserIdParam(req.params["id"]);
  const data = parseUpdateUserBody(req.body);
  const user = await updateUserService(id, data);
  res.status(200).json({ success: true, data: user });
}

/** DELETE /api/users/:id — 200 with a confirmation payload. */
export async function deleteUserController(req: Request, res: Response): Promise<void> {
  const id = parseUserIdParam(req.params["id"]);
  await deleteUserService(id);
  res.status(200).json({ success: true, message: `User ${id} deleted successfully` });
}
