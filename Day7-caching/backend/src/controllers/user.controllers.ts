/**
 * User HTTP controllers — parse transport data, delegate, respond.
 * Express 5 forwards async errors to the central error middleware.
 */
import type { Request, Response } from "express";
import {
  createUserService,
  deleteUserService,
  getUserByIdService,
  getUsersService,
  updateUserService,
} from "../services/user.services.js";
import {
  parseCreateUserBody,
  parseGetUsersQuery,
  parseUpdateUserBody,
  parseUserIdParam,
} from "../shared/validate.js";

export async function listUsersController(req: Request, res: Response): Promise<void> {
  const options = parseGetUsersQuery(req.query as Record<string, unknown>);
  const result = await getUsersService(options);
  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
}

export async function getUserController(req: Request, res: Response): Promise<void> {
  const id = parseUserIdParam(req.params["id"]);
  const user = await getUserByIdService(id);
  res.status(200).json({ success: true, data: user });
}

export async function createUserController(req: Request, res: Response): Promise<void> {
  const input = parseCreateUserBody(req.body);
  const user = await createUserService(input);
  res.status(201).json({ success: true, data: user });
}

export async function updateUserController(req: Request, res: Response): Promise<void> {
  const id = parseUserIdParam(req.params["id"]);
  const data = parseUpdateUserBody(req.body);
  const user = await updateUserService(id, data);
  res.status(200).json({ success: true,message: `User ${id} Update successfully` , data: user });
}

export async function deleteUserController(req: Request, res: Response): Promise<void> {
  const id = parseUserIdParam(req.params["id"]);
  await deleteUserService(id);
  res.status(200).json({ success: true, message: `User ${id} deleted successfully` });
}
