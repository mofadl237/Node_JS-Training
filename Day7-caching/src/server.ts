/**
 * Server bootstrap + graceful shutdown.
 * Keeping app creation in app.ts makes it easy to test the Express app
 * without opening a port.
 */
import type { Server } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";
import { closeLogger, logger } from "./shared/logger.js";

let shuttingDown = false;

async function shutdown(server: Server, signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;

  logger.info("Shutting down", { signal });

  const forceExit = setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  server.close(async (error) => {
    if (error) logger.error("HTTP server close failed", { error });

    try {
      await prisma.$disconnect();
      await disconnectRedis();
    } catch (cleanupError) {
      logger.error("Cleanup failed", { error: cleanupError });
    } finally {
      logger.info("Shutdown complete", { signal });
      closeLogger();
      process.exit(error ? 1 : 0);
    }
  });
}

async function main(): Promise<void> {
  await connectRedis();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info("Server listening", {
      port: env.PORT,
      environment: env.NODE_ENV,
      cache: env.REDIS_URL ? "redis" : "disabled",
    });
  });

  process.on("SIGINT", () => void shutdown(server, "SIGINT"));
  process.on("SIGTERM", () => void shutdown(server, "SIGTERM"));

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection", {
      error: reason instanceof Error ? reason : new Error(String(reason)),
    });
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception — shutting down", { error });
    void shutdown(server, "uncaughtException");
  });
}

main().catch((error) => {
  logger.error("Failed to start server", { error });
  closeLogger();
  process.exit(1);
});
