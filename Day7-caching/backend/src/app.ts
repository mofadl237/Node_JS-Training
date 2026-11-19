import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { redis } from "./config/redis.js";
import { routerOffers } from "./routers/offer.routes.js";
import { routerOrders } from "./routers/order.routes.js";
import { routerProducts } from "./routers/product.routes.js";
import { routerUsers } from "./routers/user.routes.js";
import { errorHandler, notFoundHandler } from "./shared/error.middleware.js";
import { logger } from "./shared/logger.js";
import { requestLogger } from "./shared/request.middleware.js";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");

  // 1) Correlation id + request log first, so even body-parser errors are logged.
  app.use(requestLogger);
  app.use(helmet());
  app.use(
    cors({
      origin:
        env.CORS_ORIGIN === "*"
          ? true
          : env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  // 2) Operational endpoints.
  app.get("/", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Restaurant API",
      docs: {
        users: "/api/users",
        products: "/api/products",
        offers: "/api/offers",
        orders: "/api/orders",
        health: "/health",
      },
    });
  });

  app.get("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/health/ready", async (_req, res) => {
    let database = false;
    let cache: "up" | "down" | "disabled" = "disabled";

    try {
      await prisma.$queryRaw`SELECT 1`;
      database = true;
    } catch (error) {
      logger.error("Readiness check: database failed", { error });
    }

    if (env.REDIS_URL !== "") {
      try {
        if (redis.isReady) {
          await redis.ping();
          cache = "up";
        } else {
          cache = "down";
        }
      } catch (error) {
        cache = "down";
        logger.warn("Readiness check: redis failed", { error });
      }
    }

    // Redis is an optimisation, so a down cache is "degraded", not "error".
    const status = database ? (cache === "down" ? "degraded" : "ok") : "error";

    res.status(database ? 200 : 503).json({
      success: database,
      status,
      checks: { database, redis: cache },
      timestamp: new Date().toISOString(),
    });
  });

  // 3) API routes.
  app.use("/api/users", routerUsers);
  app.use("/api/products", routerProducts);
  app.use("/api/offers", routerOffers);
  app.use("/api/orders", routerOrders);

  // 4) 404 + central error handling (must be last).
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
