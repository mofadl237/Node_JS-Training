import "dotenv/config";
import app from "./app.js";
import { prisma } from "./config/prisma.js";
import { logger } from "./utils/logger/index.js";
const PORT = Number(process.env.PORT) || 3000;
let isShuttingDown = false;
const gracefulShutdown = async (server, signal) => {
    if (isShuttingDown)
        return;
    isShuttingDown = true;
    logger.info(`Received ${signal}, starting graceful shutdown...`);
    const forceTimeout = setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
    }, 10000);
    forceTimeout.unref();
    server.close(async (err) => {
        if (err)
            logger.error("HTTP server close error", { error: err.message });
        try {
            await prisma.$disconnect();
            logger.info("Database disconnected");
        }
        catch (e) {
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
        process.on("unhandledRejection", (reason) => {
            logger.error("Unhandled Rejection", { error: reason?.message || reason });
            gracefulShutdown(server, "unhandledRejection");
        });
    }
    catch (error) {
        logger.error("Failed to start server", { error: error?.message });
        await prisma.$disconnect().catch(() => { });
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map