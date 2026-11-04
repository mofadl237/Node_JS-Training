import { Redis } from "ioredis";
import { env } from "./env.js";
import { logger } from "../utils/logger/index.js";
const DEFAULT_REDIS_URL = "redis://localhost:6379";
const CONNECT_TIMEOUT_MS = 5000;
const globalForRedis = globalThis;
export const redisOptions = {
    lazyConnect: true,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    retryStrategy: (attempt) => Math.min(attempt * 200, 5000),
    reconnectOnError: (error) => {
        logger.warn("Redis connection error; reconnecting", { error: error.message });
        return true;
    },
};
const attachListeners = (client) => {
    client.on("connect", () => logger.info("Redis socket connected"));
    client.on("ready", () => logger.info("Redis ready"));
    client.on("close", () => logger.warn("Redis connection closed"));
    client.on("reconnecting", (delay) => logger.warn("Reconnecting to Redis", { delay }));
    client.on("end", () => logger.warn("Redis connection ended"));
    client.on("error", (error) => logger.error("Redis error", { error: error.message }));
};
const createRedisConnection = (options = {}) => {
    const client = new Redis(env.REDIS_URL || DEFAULT_REDIS_URL, {
        ...redisOptions,
        ...options,
    });
    attachListeners(client);
    return client;
};
export const redis = globalForRedis.redis ?? createRedisConnection();
if (env.NODE_ENV !== "production") {
    globalForRedis.redis = redis;
}
export const createRedisClient = createRedisConnection;
export function isRedisReady() {
    return redis.status === "ready";
}
const waitForReady = (timeoutMs) => new Promise((resolve, reject) => {
    if (redis.status === "ready") {
        resolve();
        return;
    }
    const timeout = setTimeout(() => {
        cleanup();
        reject(new Error(`Redis did not become ready within ${timeoutMs}ms`));
    }, timeoutMs);
    const cleanup = () => {
        clearTimeout(timeout);
        redis.off("ready", onReady);
        redis.off("error", onError);
    };
    const onReady = () => {
        cleanup();
        resolve();
    };
    const onError = (error) => {
        cleanup();
        reject(error);
    };
    redis.once("ready", onReady);
    redis.once("error", onError);
});
export async function connectRedis() {
    if (redis.status === "ready")
        return;
    if (redis.status === "wait") {
        await redis.connect();
    }
    await waitForReady(CONNECT_TIMEOUT_MS);
}
export async function disconnectRedis() {
    if (redis.status === "end")
        return;
    if (redis.status === "wait") {
        redis.disconnect();
        return;
    }
    try {
        await redis.quit();
    }
    catch {
        redis.disconnect();
    }
}
export default redis;
//# sourceMappingURL=redis.js.map