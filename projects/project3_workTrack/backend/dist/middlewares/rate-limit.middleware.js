const stores = new Map();
const lastCleanup = new Map();
const cleanupExpired = (store, now) => {
    for (const [key, entry] of store) {
        if (entry.resetAt <= now) {
            store.delete(key);
        }
    }
};
const getStore = (keyPrefix) => {
    const existing = stores.get(keyPrefix);
    if (existing) {
        return existing;
    }
    const store = new Map();
    stores.set(keyPrefix, store);
    return store;
};
const getClientKey = (req) => `${req.ip ?? req.socket.remoteAddress ?? "unknown"}:${req.originalUrl}`;
export const rateLimit = (options) => {
    const store = getStore(options.keyPrefix);
    return (req, res, next) => {
        const now = Date.now();
        const last = lastCleanup.get(options.keyPrefix) ?? 0;
        if (now - last >= 60_000) {
            cleanupExpired(store, now);
            lastCleanup.set(options.keyPrefix, now);
        }
        const key = getClientKey(req);
        const entry = store.get(key);
        if (!entry || entry.resetAt <= now) {
            store.set(key, { count: 1, resetAt: now + options.windowMs });
            res.setHeader("RateLimit-Limit", String(options.max));
            res.setHeader("RateLimit-Remaining", String(Math.max(0, options.max - 1)));
            next();
            return;
        }
        if (entry.count >= options.max) {
            const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
            res.setHeader("Retry-After", String(retryAfter));
            res.setHeader("RateLimit-Limit", String(options.max));
            res.setHeader("RateLimit-Remaining", "0");
            res.status(429).json({
                success: false,
                message: options.message ?? "Too many requests. Please try again later.",
                code: "RATE_LIMITED",
                details: { retryAfter },
            });
            return;
        }
        entry.count += 1;
        res.setHeader("RateLimit-Limit", String(options.max));
        res.setHeader("RateLimit-Remaining", String(Math.max(0, options.max - entry.count)));
        next();
    };
};
//# sourceMappingURL=rate-limit.middleware.js.map