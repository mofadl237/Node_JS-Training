/**
 * Profile HTTP controllers — same thin-controller contract as users:
 * parse/validate transport data → call service → write response.
 * Express 5 forwards async errors to the error middleware automatically.
 */
import type { Request, Response } from "express";
import {
  createProfileService,
  deleteProfileService,
  getProfileByIdService,
  getProfileByUserIdService,
  getProfilesService,
  updateProfileService,
} from "../services/profile.services.js";
import {
  parseCreateProfileBody,
  parseGetProfilesQuery,
  parseIdParam,
  parseUpdateProfileBody,
} from "../shared/validate.js";

/** GET /api/profiles — filtered/sorted/paginated list. */
export async function listProfilesController(req: Request, res: Response): Promise<void> {
  const options = parseGetProfilesQuery(req.query as Record<string, unknown>);
  const result = await getProfilesService(options);
  res.status(200).json(result);
}

/** GET /api/profiles/user/:userId — lookup by the unique natural key. */
export async function getProfileByUserController(req: Request, res: Response): Promise<void> {
  const userId = parseIdParam(req.params["userId"], "User");
  const profile = await getProfileByUserIdService(userId);
  res.status(200).json({ success: true, data: profile });
}

/** GET /api/profiles/:id */
export async function getProfileController(req: Request, res: Response): Promise<void> {
  const id = parseIdParam(req.params["id"], "Profile");
  const profile = await getProfileByIdService(id);
  res.status(200).json({ success: true, data: profile });
}

/** POST /api/profiles — 201 Created on success. */
export async function createProfileController(req: Request, res: Response): Promise<void> {
  const input = parseCreateProfileBody(req.body);
  const profile = await createProfileService(input);
  res.status(201).json({ success: true, data: profile });
}

/** PATCH /api/profiles/:id — partial update, omitted fields stay untouched. */
export async function updateProfileController(req: Request, res: Response): Promise<void> {
  const id = parseIdParam(req.params["id"], "Profile");
  const data = parseUpdateProfileBody(req.body);
  const profile = await updateProfileService(id, data);
  res.status(200).json({ success: true, data: profile });
}

/** DELETE /api/profiles/:id — 200 with a confirmation payload. */
export async function deleteProfileController(req: Request, res: Response): Promise<void> {
  const id = parseIdParam(req.params["id"], "Profile");
  await deleteProfileService(id);
  res.status(200).json({ success: true, message: `Profile ${id} deleted successfully` });
}
