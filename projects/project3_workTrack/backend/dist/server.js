import "dotenv/config";
import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";
import { isEmailConfigured } from "./config/email.js";
import { startAttendanceAutomation, stopAttendanceAutomation, } from "./jobs/attendance/index.js";
import { logger } from "./utils/logger/index.js";
const SHUTDOWN_TIMEOUT_MS = 10_000;
let server = null;
let isShuttingDown = false;
const closeServer = async (httpServer) => {
    await new Promise((resolve, reject) => {
        httpServer.close((error) => {
            if (error)
                reject(error);
            else
                resolve();
        });
    });
};
const shutdown = async (signal, exitCode = 0) => {
    if (isShuttingDown)
        return;
    isShuttingDown = true;
    logger.info(`Received ${signal}; starting graceful shutdown`);
    const forceExit = setTimeout(() => {
        logger.error("Graceful shutdown timed out; forcing exit");
        process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    forceExit.unref();
    try {
        if (server) {
            await closeServer(server);
            logger.info("HTTP server closed");
        }
        try {
            await stopAttendanceAutomation();
            logger.info("Attendance automation stopped");
        }
        catch (error) {
            logger.error("Failed to stop attendance automation", {
                error: error instanceof Error ? error.message : String(error),
            });
        }
        await disconnectRedis();
        logger.info("Redis disconnected");
        await prisma.$disconnect();
        logger.info("Database disconnected");
        logger.info("Shutdown complete");
        process.exit(exitCode);
    }
    catch (error) {
        logger.error("Shutdown failed", {
            error: error instanceof Error ? error.message : String(error),
        });
        process.exit(1);
    }
};
const startServer = async () => {
    try {
        await prisma.$connect();
        logger.info("Database connected");
        try {
            await connectRedis();
            logger.info("Redis connected");
            try {
                startAttendanceAutomation();
            }
            catch (error) {
                logger.error("Failed to start attendance automation", {
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        }
        catch (error) {
            logger.warn("Redis unavailable; continuing without Redis", {
                error: error instanceof Error ? error.message : String(error),
            });
        }
        logger.info("Email delivery", {
            enabled: isEmailConfigured,
        });
        server = app.listen(env.PORT, () => {
            logger.info("Server started", {
                port: env.PORT,
                env: env.NODE_ENV,
                health: `http://localhost:${env.PORT}/health`,
            });
        });
        server.on("error", (error) => {
            logger.error("HTTP server error", { error: error.message });
            void shutdown("serverError", 1);
        });
        process.once("SIGINT", () => void shutdown("SIGINT", 0));
        process.once("SIGTERM", () => void shutdown("SIGTERM", 0));
        process.on("uncaughtException", (error) => {
            logger.error("Uncaught exception", { error: error.message, stack: error.stack });
            void shutdown("uncaughtException", 1);
        });
        process.on("unhandledRejection", (reason) => {
            logger.error("Unhandled rejection", {
                error: reason instanceof Error ? reason.message : String(reason),
                stack: reason instanceof Error ? reason.stack : undefined,
            });
            void shutdown("unhandledRejection", 1);
        });
    }
    catch (error) {
        logger.error("Failed to start server", {
            error: error instanceof Error ? error.message : String(error),
        });
        await prisma.$disconnect().catch(() => undefined);
        process.exit(1);
    }
};
void startServer();
//# sourceMappingURL=server.js.map