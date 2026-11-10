import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { IApiErrorPayload } from "./types";

export interface INormalizedApiError {
  message: string;
  code?: string;
  status?: number;
  details?: IApiErrorPayload["details"];
}

const isApiErrorPayload = (value: unknown): value is IApiErrorPayload => {
  if (typeof value !== "object" || value === null) return false;

  const payload = value as Partial<IApiErrorPayload>;

  return typeof payload.message === "string";
};

export const normalizeApiError = (error: unknown): INormalizedApiError => {
  if (typeof error === "object" && error !== null && "status" in error) {
    const fetchError = error as FetchBaseQueryError;

    if (fetchError.status === "FETCH_ERROR") {
      return {
        message: "تعذّر الاتصال بالخادم. تحقق من اتصالك ثم حاول مرة أخرى.",
        code: "NETWORK_ERROR",
      };
    }

    if (fetchError.status === "TIMEOUT_ERROR") {
      return {
        message: "انتهت مهلة الاتصال بالخادم. حاول مرة أخرى.",
        code: "TIMEOUT_ERROR",
      };
    }

    if (isApiErrorPayload(fetchError.data)) {
      const retryAfter = fetchError.data.details?.retryAfter;

      return {
        message:
          retryAfter !== undefined
            ? `${fetchError.data.message} (${retryAfter} ثانية)`
            : fetchError.data.message,
        code: fetchError.data.code,
        status:
          typeof fetchError.status === "number" ? fetchError.status : undefined,
        details: fetchError.data.details,
      };
    }

    if (typeof fetchError.status === "number") {
      return {
        message: "حدث خطأ غير متوقع. حاول مرة أخرى.",
        status: fetchError.status,
      };
    }
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "حدث خطأ غير متوقع. حاول مرة أخرى." };
};
