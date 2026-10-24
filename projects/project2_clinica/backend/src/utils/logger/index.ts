/**
 * Simple structured logger (lean production style)
 */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const isProd = process.env.NODE_ENV === 'production';

function format(level: LogLevel, message: string, meta?: unknown) {
  const timestamp = new Date().toISOString();
  if (isProd) {
    const payload: Record<string, unknown> = { level, message, timestamp };
    if (meta !== undefined) payload.meta = meta;
    return JSON.stringify(payload);
  }
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
}

export const logger = {
  info: (message: string, meta?: unknown) => console.log(format('info', message, meta)),
  warn: (message: string, meta?: unknown) => console.warn(format('warn', message, meta)),
  error: (message: string, meta?: unknown) => console.error(format('error', message, meta)),
  debug: (message: string, meta?: unknown) => {
    if (!isProd) console.debug(format('debug', message, meta));
  },
};

export default logger;
