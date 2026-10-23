/**
 * Order HTTP controllers.
 */
import type { Request, Response } from "express";
import {
  createOrderService,
  getOrderByIdService,
  getOrdersService,
  updateOrderStatusService,
} from "../services/order.services.js";
import {
  parseCreateOrderBody,
  parseGetOrdersQuery,
  parseIdParam,
  parseUpdateOrderStatusBody,
} from "../shared/validate.js";

export async function listOrdersController(req: Request, res: Response): Promise<void> {
  const options = parseGetOrdersQuery(req.query as Record<string, unknown>);
  const result = await getOrdersService(options);
  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
}

export async function getOrderController(req: Request, res: Response): Promise<void> {
  const id = parseIdParam(req.params["id"], "Order");
  const order = await getOrderByIdService(id);
  res.status(200).json({ success: true, data: order });
}

export async function createOrderController(req: Request, res: Response): Promise<void> {
  const input = parseCreateOrderBody(req.body);
  const order = await createOrderService(input);
  res.status(201).json({ success: true, data: order });
}

export async function updateOrderStatusController(req: Request, res: Response): Promise<void> {
  const id = parseIdParam(req.params["id"], "Order");
  const input = parseUpdateOrderStatusBody(req.body);
  const order = await updateOrderStatusService(id, input);
  res.status(200).json({ success: true, data: order });
}
