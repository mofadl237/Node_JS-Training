import express from "express";
import {
  createOfferController,
  deleteOfferController,
  getOfferController,
  listOffersController,
  updateOfferController,
} from "../controllers/offer.controllers.js";

export const routerOffers = express.Router();

routerOffers.get("/", listOffersController);
routerOffers.get("/:id", getOfferController);
routerOffers.post("/", createOfferController);
routerOffers.patch("/:id", updateOfferController);
routerOffers.delete("/:id", deleteOfferController);
