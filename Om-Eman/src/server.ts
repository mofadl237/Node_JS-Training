import "dotenv/config";
import http from "node:http";
import app from "./app.js";
import { env } from "./config/env.js";
import prisma from "./config/prisma.js";
import { logger } from "./utils/logger/index.js";
import { isEmailConfigured } from "./config/email.js";

const server = http.createServer(app);

server.on("error", (error) => {
  logger.error("HTTP server error", { error: error.message });
  void shutdown("serverError");
});

async function start(): Promise<void> {
  await prisma.$connect();
  logger.info("Database connection established");
  logger.info("Email delivery", { enabled: isEmailConfigured });

  server.listen(env.PORT, () => {
    logger.info(`Om Eman API listening on port ${env.PORT}`, {
      environment: env.NODE_ENV,
      timezone: env.APP_TIMEZONE,
      logFile: env.LOG_FILE,
    });
  });
}

let shuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;

  logger.info(`Received ${signal}, shutting down gracefully`);

  const forceExit = setTimeout(() => {
    logger.error("Graceful shutdown timed out, forcing exit");
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  server.close(async (closeError) => {
    if (closeError) {
      logger.error("Error while closing HTTP server", {
        error: closeError.message,
      });
    }

    try {
      await prisma.$disconnect();
      logger.info("Database connection closed");
    } catch (disconnectError) {
      logger.error("Error while disconnecting Prisma", {
        error:
          disconnectError instanceof Error
            ? disconnectError.message
            : String(disconnectError),
      });
    }

    clearTimeout(forceExit);
    await logger.close();
    process.exit(closeError ? 1 : 0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", {
    error: reason instanceof Error ? reason.message : String(reason),
  });
  void shutdown("unhandledRejection");
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", { error: error.message });
  void shutdown("uncaughtException");
});

start().catch(async (error: unknown) => {
  logger.error("Failed to start Om Eman API", {
    error: error instanceof Error ? error.message : String(error),
  });
  await logger.close();
  process.exit(1);
});
