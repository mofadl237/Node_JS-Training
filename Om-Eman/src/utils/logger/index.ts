import { createWriteStream, mkdirSync, type WriteStream } from "node:fs";
import { dirname, resolve } from "node:path";
import { env } from "../../config/env.js";
import { EEnvironment } from "../../enums/EEnvironment.js";
import { ELogLevel } from "../../enums/ELogLevel.js";
import type {
  ILogContext,
  ILogEntry,
  ILogger,
} from "../../interfaces/logger/ILogger.js";

const LEVEL_PRIORITY: Record<ELogLevel, number> = {
  [ELogLevel.DEBUG]: 10,
  [ELogLevel.INFO]: 20,
  [ELogLevel.WARN]: 30,
  [ELogLevel.ERROR]: 40,
};

const logFilePath = resolve(process.cwd(), env.LOG_FILE);
let fileStream: WriteStream | null = null;
let fileEnabled = true;

try {
  mkdirSync(dirname(logFilePath), { recursive: true });
  fileStream = createWriteStream(logFilePath, {
    flags: "a",
    encoding: "utf8",
  });
  fileStream.on("error", (error: Error) => {
    fileEnabled = false;
    console.error(`[LOGGER] Unable to write log file: ${error.message}`);
  });
} catch (error) {
  fileEnabled = false;
  console.error(
    `[LOGGER] Unable to initialize log file: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
}

function serializeContext(context?: ILogContext): string | undefined {
  if (!context || Object.keys(context).length === 0) return undefined;
  try {
    return JSON.stringify(context);
  } catch {
    return JSON.stringify({ contextError: "Unable to serialize log context" });
  }
}

function buildLine(
  level: ELogLevel,
  message: string,
  context?: ILogContext,
): string {
  const timestamp = new Date().toISOString();

  if (env.NODE_ENV === EEnvironment.PRODUCTION) {
    const entry: ILogEntry = {
      timestamp,
      level,
      message,
      pid: process.pid,
    };
    if (context !== undefined) entry.context = context;
    return JSON.stringify(entry);
  }

  const contextText = serializeContext(context);
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${
    contextText ? ` ${contextText}` : ""
  }`;
}

class Logger implements ILogger {
  private write(
    level: ELogLevel,
    message: string,
    context?: ILogContext,
  ): void {
    if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[env.LOG_LEVEL]) return;

    const line = buildLine(level, message, context);

    switch (level) {
      case ELogLevel.ERROR:
        console.error(line);
        break;
      case ELogLevel.WARN:
        console.warn(line);
        break;
      case ELogLevel.DEBUG:
        console.debug(line);
        break;
      default:
        console.log(line);
        break;
    }

    if (fileEnabled && fileStream) {
      fileStream.write(`${line}\n`);
    }
  }

  debug(message: string, context?: ILogContext): void {
    this.write(ELogLevel.DEBUG, message, context);
  }

  info(message: string, context?: ILogContext): void {
    this.write(ELogLevel.INFO, message, context);
  }

  warn(message: string, context?: ILogContext): void {
    this.write(ELogLevel.WARN, message, context);
  }

  error(message: string, context?: ILogContext): void {
    this.write(ELogLevel.ERROR, message, context);
  }

  async close(): Promise<void> {
    if (!fileStream) return;

    const stream = fileStream;
    fileStream = null;
    fileEnabled = false;

    await new Promise<void>((resolveClose) => {
      stream.end(() => resolveClose());
    });
  }
}

export const logger = new Logger();
export default logger;
