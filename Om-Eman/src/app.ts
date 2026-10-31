import "dotenv/config";
import express from "express";
import type { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { EEnvironment } from "./enums/EEnvironment.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { logger } from "./utils/logger/index.js";

const app: Application = express();

app.disable("x-powered-by");

app.use(helmet());
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

// No business or infrastructure endpoints are registered in this phase.
// Routers will be added under src/modules and mounted here in a later phase.
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
