import "dotenv/config";
import type { Server } from "http";
import app from "./app.js";
import { prisma } from "./config/prisma.js";
import { logger } from "./utils/logger/index.js";
import { isEmailConfigured } from "./config/email.js";
import {
  startAppointmentReminderJob,
  stopAppointmentReminderJob,
} from "./jobs/appointmentReminder.job.js";

const PORT = Number(process.env.PORT) || 3000;
let isShuttingDown = false;
let reminderTask: ReturnType<typeof startAppointmentReminderJob> = null;

const gracefulShutdown = async (server: Server, signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  logger.info(`Received ${signal}, starting graceful shutdown...`);

  const forceTimeout = setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
  forceTimeout.unref();

  await stopAppointmentReminderJob(reminderTask).catch((error: any) => {
    logger.error("Reminder job stop error", { error: error?.message });
  });

  server.close(async (err) => {
    if (err) logger.error("HTTP server close error", { error: err.message });
    try {
      await prisma.$disconnect();
      logger.info("Database disconnected");
    } catch (e: any) {
      logger.error("Database disconnect error", { error: e?.message });
    }
    logger.info("Shutdown complete");
    process.exit(err ? 1 : 0);
  });
};

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info("Database connected");
    logger.info("Email delivery", { enabled: isEmailConfigured });

    reminderTask = startAppointmentReminderJob();

    const server = app.listen(PORT, () => {
      logger.info("Server started", {
        port: PORT,
        env: process.env.NODE_ENV || "development",
        health: `http://localhost:${PORT}/health`,
      });
    });

    process.on("SIGINT", () => gracefulShutdown(server, "SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown(server, "SIGTERM"));
    process.on("uncaughtException", (err) => {
      logger.error("Uncaught Exception", { error: err.message });
      gracefulShutdown(server, "uncaughtException");
    });
    process.on("unhandledRejection", (reason: any) => {
      logger.error("Unhandled Rejection", { error: reason?.message || reason });
      gracefulShutdown(server, "unhandledRejection");
    });
  } catch (error: any) {
    logger.error("Failed to start server", { error: error?.message });
    await stopAppointmentReminderJob(reminderTask).catch(() => {});
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
};

startServer();
