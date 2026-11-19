/**
 * Redis client used by the cache layer.
 *
 * Redis is intentionally optional: if it is down or REDIS_URL is missing the
 * API keeps serving traffic and simply skips caching. That is why connection
 * failures are logged and swallowed here instead of killing the process.
 */
import { createClient } from "redis";
import { env } from "./env.js";
import { logger } from "../shared/logger.js";

export const redis = createClient({
  ...(env.REDIS_URL ? { url: env.REDIS_URL } : {}),
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error("Redis reconnect limit reached", { retries });
        return new Error("Redis reconnect limit reached");
      }
      return Math.min(retries * 200, 3000);
    },
  },
});

redis.on("connect", () => logger.info("Redis connecting"));
redis.on("ready", () => logger.info("Redis ready"));
redis.on("error", (error) => logger.error("Redis client error", { error }));

export async function connectRedis(): Promise<void> {
  if (!env.REDIS_URL) {
    logger.warn("REDIS_URL is not set — cache layer disabled");
    return;
  }
  if (redis.isOpen) return;

  try {
    await redis.connect();
  } catch (error) {
    logger.error("Redis connection failed — continuing without cache", { error });
  }
}

export async function disconnectRedis(): Promise<void> {
  if (!redis.isOpen) return;

  try {
    await redis.quit();
    logger.info("Redis disconnected");
  } catch (error) {
    logger.error("Redis disconnect failed — destroying client", { error });
    redis.destroy();
  }
}
