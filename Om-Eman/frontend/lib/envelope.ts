import type { IApiSuccess, IEnvelopeFailure } from "@/interface/api";

export const isEnvelopeFailure = (value: unknown): value is IEnvelopeFailure =>
  typeof value === "object" &&
  value !== null &&
  "success" in value &&
  value.success === false &&
  "message" in value &&
  typeof value.message === "string" &&
  "code" in value &&
  typeof value.code === "string";

export const isEnvelopeSuccess = (value: unknown): value is IApiSuccess<unknown> =>
  typeof value === "object" &&
  value !== null &&
  "success" in value &&
  value.success === true &&
  "message" in value &&
  typeof value.message === "string" &&
  "data" in value;
