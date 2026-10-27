const isProd = process.env.NODE_ENV === 'production';
function format(level, message, meta) {
    const timestamp = new Date().toISOString();
    if (isProd) {
        const payload = { level, message, timestamp };
        if (meta !== undefined)
            payload.meta = meta;
        return JSON.stringify(payload);
    }
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
}
export const logger = {
    info: (message, meta) => console.log(format('info', message, meta)),
    warn: (message, meta) => console.warn(format('warn', message, meta)),
    error: (message, meta) => console.error(format('error', message, meta)),
    debug: (message, meta) => {
        if (!isProd)
            console.debug(format('debug', message, meta));
    },
};
export default logger;
//# sourceMappingURL=index.js.map