import "server-only";
import { API_BASE_URL } from "@/lib/config";
import { isEnvelopeFailure, isEnvelopeSuccess } from "@/lib/envelope";
import type { IPaginationMeta } from "@/interface";

export type TStoreFailureCode =
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "INVALID_RESPONSE"
  | "REQUEST_FAILED"
  | string;

export type TStoreResult<T> =
  | { ok: true; data: T; meta?: IPaginationMeta }
  | { ok: false; status: number; code: TStoreFailureCode };

const baseUrl = (process.env.API_INTERNAL_URL || API_BASE_URL).replace(/\/+$/, "");

export const storeFetch = async <T>(path: string): Promise<TStoreResult<T>> => {
  try {
    const response = await fetch(`${baseUrl}/${path.replace(/^\/+/, "")}`, {
      signal: AbortSignal.timeout(8000),
      headers: { Accept: "application/json" },
    });
    const body: unknown = await response.json().catch(() => null);

    if (isEnvelopeFailure(body)) {
      console.error("[store]", { path, status: response.status, code: body.code });
      return { ok: false, status: response.status, code: body.code };
    }

    if (!response.ok || !isEnvelopeSuccess(body)) {
      const code = response.ok ? "INVALID_RESPONSE" : "REQUEST_FAILED";
      console.error("[store]", { path, status: response.status, code });
      return { ok: false, status: response.status, code };
    }

    return { ok: true, data: body.data as T, meta: body.meta };
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === "TimeoutError";
    const code = isTimeout ? "TIMEOUT" : "NETWORK_ERROR";
    console.error("[store]", { path, status: 0, code });
    return { ok: false, status: 0, code };
  }
};
