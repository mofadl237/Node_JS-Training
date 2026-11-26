import type { z } from "zod";
import type { IPaginationMeta, IApiError, IUnwrapped } from "@/interface";
import { isEnvelopeFailure, isEnvelopeSuccess } from "@/lib/envelope";
import { adminProductQuerySchema, type TAdminProductQueryForm } from "@/validation/adminProduct";

export interface IAdminClientRequest<T> {
  url: string;
  method: "GET" | "POST" | "DELETE";
  schema: z.ZodType<T>;
  metaSchema?: z.ZodType<IPaginationMeta>;
  body?: unknown;
}

export interface IAdminProductListArgs {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: TAdminProductQueryForm["sortBy"];
  sortOrder?: TAdminProductQueryForm["sortOrder"];
}

export type TAdminClientResult<T> =
  | { data: IUnwrapped<T> }
  | { error: IApiError };

export const requestAdmin = async <T>(
  config: IAdminClientRequest<T>,
): Promise<TAdminClientResult<T>> => {
  try {
    const hasBody = config.body !== undefined;
    const response = await fetch(config.url, {
      method: config.method,
      credentials: "same-origin",
      headers: hasBody ? { "Content-Type": "application/json" } : undefined,
      body: hasBody ? JSON.stringify(config.body) : undefined,
      signal: AbortSignal.timeout(8000),
    });

    const payload: unknown = await response.json().catch(() => null);
    if (isEnvelopeFailure(payload)) {
      return { error: { status: response.status, message: payload.message, code: payload.code } };
    }
    if (!response.ok || !isEnvelopeSuccess(payload)) {
      return {
        error: {
          status: response.status,
          message: "",
          code: response.ok ? "INVALID_RESPONSE" : "REQUEST_FAILED",
        },
      };
    }

    const parsed = config.schema.safeParse(payload.data);
    if (!parsed.success) {
      return { error: { status: response.status, message: "", code: "INVALID_RESPONSE" } };
    }

    let meta: IPaginationMeta | undefined;
    if (config.metaSchema) {
      const parsedMeta = config.metaSchema.safeParse(payload.meta);
      if (!parsedMeta.success) {
        return { error: { status: response.status, message: "", code: "INVALID_RESPONSE" } };
      }
      meta = parsedMeta.data;
    }

    return { data: { data: parsed.data, meta } };
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === "TimeoutError";
    return { error: { status: 0, message: "", code: isTimeout ? "TIMEOUT" : "NETWORK_ERROR" } };
  }
};

export const adminProductListUrl = (args: IAdminProductListArgs): string => {
  const parsed = adminProductQuerySchema.safeParse(args);
  const params = new URLSearchParams();
  if (parsed.success) {
    for (const [key, value] of Object.entries(parsed.data)) {
      if (value !== undefined) params.set(key, String(value));
    }
  }
  const suffix = params.toString();
  return `/api/admin/products${suffix ? `?${suffix}` : ""}`;
};
