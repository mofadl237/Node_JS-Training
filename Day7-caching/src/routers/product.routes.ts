import express from "express";
import {
  createProductController,
  deleteProductController,
  getProductController,
  listProductsController,
  updateProductController,
} from "../controllers/product.controllers.js";

export const routerProducts = express.Router();

routerProducts.get("/", listProductsController);
routerProducts.get("/:id", getProductController);
routerProducts.post("/", createProductController);
routerProducts.patch("/:id", updateProductController);
routerProducts.delete("/:id", deleteProductController);
