import "dotenv/config";
import express from "express";
import type { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { swaggerSpec } from "./config/swagger.js";
import { EEnvironment } from "./enums/EEnvironment.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import apiRouter from "./modules/index.js";
import { logger } from "./utils/logger/index.js";

const app: Application = express();

app.disable("x-powered-by");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "data:"],
      },
    },
  }),
);
app.use(
  cors({
    origin:
      env.CORS_ORIGIN === "*"
        ? "*"
        : env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
    credentials: env.CORS_ORIGIN !== "*",
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  morgan(env.NODE_ENV === EEnvironment.PRODUCTION ? "combined" : "dev", {
    stream: {
      write: (message: string) => {
        logger.info("HTTP request", { source: "http", line: message.trim() });
      },
    },
  }),
);

app.use("/api", apiRouter);

app.get("/api/docs.json", (_req, res) => {
  res.json(swaggerSpec);
});
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: `${env.APP_NAME} API Docs`,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: "none",
      filter: true,
    },
  }),
);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
