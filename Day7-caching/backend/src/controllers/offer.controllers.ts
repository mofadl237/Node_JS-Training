/**
 * Offer HTTP controllers.
 */
import type { Request, Response } from "express";
import {
  createOfferService,
  deleteOfferService,
  getOfferByIdService,
  getOffersService,
  updateOfferService,
} from "../services/offer.services.js";
import {
  parseCreateOfferBody,
  parseGetOffersQuery,
  parseIdParam,
  parseUpdateOfferBody,
} from "../shared/validate.js";

export async function listOffersController(req: Request, res: Response): Promise<void> {
  const options = parseGetOffersQuery(req.query as Record<string, unknown>);
  const result = await getOffersService(options);
  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
}

export async function getOfferController(req: Request, res: Response): Promise<void> {
  const id = parseIdParam(req.params["id"], "Offer");
  const offer = await getOfferByIdService(id);
  res.status(200).json({ success: true, data: offer });
}

export async function createOfferController(req: Request, res: Response): Promise<void> {
  const input = parseCreateOfferBody(req.body);
  const offer = await createOfferService(input);
  res.status(201).json({ success: true, data: offer });
}

export async function updateOfferController(req: Request, res: Response): Promise<void> {
  const id = parseIdParam(req.params["id"], "Offer");
  const data = parseUpdateOfferBody(req.body);
  const offer = await updateOfferService(id, data);
  res.status(200).json({ success: true, data: offer });
}

export async function deleteOfferController(req: Request, res: Response): Promise<void> {
  const id = parseIdParam(req.params["id"], "Offer");
  await deleteOfferService(id);
  res.status(200).json({ success: true, message: `Offer ${id} deleted successfully` });
}
