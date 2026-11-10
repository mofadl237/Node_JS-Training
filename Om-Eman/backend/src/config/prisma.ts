import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "./env.js";
import { EEnvironment } from "../enums/EEnvironment.js";
import { logger } from "../utils/logger/index.js";

const pool = new Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prismaLog: Prisma.LogDefinition[] =
  env.NODE_ENV === EEnvironment.DEVELOPMENT
    ? [
        { emit: "event", level: "query" },
        { emit: "event", level: "warn" },
        { emit: "event", level: "error" },
      ]
    : [
        { emit: "event", level: "warn" },
        { emit: "event", level: "error" },
      ];

const prisma = new PrismaClient({
  adapter,
  log: prismaLog,
});

prisma.$on("error", (event) => {
  logger.error("Prisma error", {
    target: event.target,
    message: event.message,
  });
});

prisma.$on("warn", (event) => {
  logger.warn("Prisma warning", {
    target: event.target,
    message: event.message,
  });
});

if (env.NODE_ENV === EEnvironment.DEVELOPMENT) {
  prisma.$on("query", (event) => {
    logger.debug("Prisma query", {
      query: event.query,
      params: event.params,
      durationMs: event.duration,
      target: event.target,
    });
  });
}

export { prisma };
export default prisma;
