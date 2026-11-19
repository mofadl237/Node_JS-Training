import "express";

declare global {
  namespace Express {
    interface Request {
      /** Correlation id set by requestLogger (also returned as x-request-id). */
      requestId: string;
    }
  }
}

export {};
