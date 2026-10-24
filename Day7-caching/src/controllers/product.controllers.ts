/**
 * Product HTTP controllers.
 */
import type { Request, Response } from "express";
import {
  createProductService,
  deleteProductService,
  getProductByIdService,
  getProductsService,
  updateProductService,
} from "../services/product.services.js";
import {
  parseCreateProductBody,
  parseGetProductsQuery,
  parseIdParam,
  parseUpdateProductBody,
} from "../shared/validate.js";

export async function listProductsController(req: Request, res: Response): Promise<void> {
  const options = parseGetProductsQuery(req.query as Record<string, unknown>);
  const result = await getProductsService(options);
  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
}

export async function getProductController(req: Request, res: Response): Promise<void> {
  const id = parseIdParam(req.params["id"], "Product");
  const product = await getProductByIdService(id);
  res.status(200).json({ success: true, data: product });
}

export async function createProductController(req: Request, res: Response): Promise<void> {
  const input = parseCreateProductBody(req.body);
  const product = await createProductService(input);
  res.status(201).json({ success: true, data: product });
}

export async function updateProductController(req: Request, res: Response): Promise<void> {
  const id = parseIdParam(req.params["id"], "Product");
  const data = parseUpdateProductBody(req.body);
  const product = await updateProductService(id, data);
  res.status(200).json({ success: true,  message: `Product ${id} updated successfully`,data: product });
}

export async function deleteProductController(req: Request, res: Response): Promise<void> {
  const id = parseIdParam(req.params["id"], "Product");
  await deleteProductService(id);
  res.status(200).json({ success: true, message: `Product ${id} deleted successfully` });
}
