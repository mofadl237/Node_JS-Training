import "server-only";
import type { z } from "zod";
import type { IAdminLoginBackendResult, IPaginationMeta } from "@/interface";
import { API_BASE_URL } from "@/lib/config";
import { isEnvelopeFailure, isEnvelopeSuccess } from "@/lib/envelope";
import {
  adminLoginBackendResultSchema,
  type TAdminLoginForm,
} from "@/validation/adminLogin";
import { readAdminSessionToken } from "./adminSession";

export type TAdminFailureCode = string;

export type TAdminResult<T> =
  | { ok: true; data: T; meta?: IPaginationMeta }
  | {
      ok: false;
      status: number;
      code: TAdminFailureCode;
      unauthenticated: boolean;
    };

const baseUrl = (process.env.API_INTERNAL_URL || API_BASE_URL).replace(/\/+$/, "");
const timeoutMs = 8000;

const endpointUrl = (path: string): string =>
  `${baseUrl}/${path.replace(/^\/+/, "")}`;

const networkFailure = <T>(error: unknown): TAdminResult<T> => {
  const isTimeout = error instanceof DOMException && error.name === "TimeoutError";
  return {
    ok: false,
    status: 0,
    code: isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
    unauthenticated: false,
  };
};

const parseResponse = async <T>(
  response: Response,
  schema: z.ZodType<T>,
  metaSchema?: z.ZodType<IPaginationMeta>,
): Promise<TAdminResult<T>> => {
  const body: unknown = await response.json().catch(() => null);
  const unauthenticated = response.status === 401;

  if (isEnvelopeFailure(body)) {
    return { ok: false, status: response.status, code: body.code, unauthenticated };
  }

  if (!response.ok || !isEnvelopeSuccess(body)) {
    return {
      ok: false,
      status: response.status,
      code: response.ok ? "INVALID_RESPONSE" : "REQUEST_FAILED",
      unauthenticated,
    };
  }

  const parsed = schema.safeParse(body.data);
  if (!parsed.success) {
    return { ok: false, status: response.status, code: "INVALID_RESPONSE", unauthenticated };
  }

  let meta: IPaginationMeta | undefined;
  if (metaSchema) {
    const parsedMeta = metaSchema.safeParse(body.meta);
    if (!parsedMeta.success) {
      return {
        ok: false,
        status: response.status,
        code: "INVALID_RESPONSE",
        unauthenticated,
      };
    }
    meta = parsedMeta.data;
  }

  return { ok: true, data: parsed.data, meta };
};

export const adminFetch = async <T>(
  path: string,
  schema: z.ZodType<T>,
  metaSchema?: z.ZodType<IPaginationMeta>,
): Promise<TAdminResult<T>> => {
  const token = await readAdminSessionToken();
  if (!token) {
    return { ok: false, status: 401, code: "TOKEN_MISSING", unauthenticated: true };
  }

  try {
    const response = await fetch(endpointUrl(path), {
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await parseResponse(response, schema, metaSchema);
  } catch (error) {
    return networkFailure<T>(error);
  }
};

export const adminLoginRequest = async (
  credentials: TAdminLoginForm,
): Promise<TAdminResult<IAdminLoginBackendResult>> => {
  try {
    const response = await fetch(endpointUrl("auth/login"), {
      method: "POST",
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    return await parseResponse(response, adminLoginBackendResultSchema);
  } catch (error) {
    return networkFailure<IAdminLoginBackendResult>(error);
  }
};
