import type { ELogLevel } from "../../enums/ELogLevel.js";

export type ILogContext = Record<string, unknown>;

export interface ILogEntry {
  timestamp: string;
  level: ELogLevel;
  message: string;
  pid: number;
  context?: ILogContext;
}

export interface ILogger {
  debug(message: string, context?: ILogContext): void;
  info(message: string, context?: ILogContext): void;
  warn(message: string, context?: ILogContext): void;
  error(message: string, context?: ILogContext): void;
  close(): Promise<void>;
}
