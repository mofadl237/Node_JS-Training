import express from "express";
import {
  createOrderController,
  getOrderController,
  listOrdersController,
  updateOrderStatusController,
} from "../controllers/order.controllers.js";

export const routerOrders = express.Router();

routerOrders.get("/", listOrdersController);
routerOrders.get("/:id", getOrderController);
routerOrders.post("/", createOrderController);
routerOrders.patch("/:id/status", updateOrderStatusController);
