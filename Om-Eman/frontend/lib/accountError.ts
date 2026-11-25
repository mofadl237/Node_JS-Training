import { isApiError } from "./cartError";

const ACCOUNT_ERROR_KEYS: Record<string, string> = {
  VALIDATION_ERROR: "account.errors.validation",
  REQUEST_FAILED: "account.errors.requestFailed",
  TOO_MANY_REQUESTS: "account.errors.rateLimited",
  RATE_LIMITED: "account.errors.rateLimited",
  EMAIL_ALREADY_REGISTERED: "account.errors.emailAlreadyRegistered",
  EMAIL_NOT_VERIFIED: "account.errors.emailNotVerified",
  INVALID_CREDENTIALS: "account.errors.invalidCredentials",
  CUSTOMER_UNAVAILABLE: "account.errors.customerUnavailable",
  TOKEN_INVALID: "account.errors.tokenInvalid",
  TOKEN_ALREADY_USED: "account.errors.tokenAlreadyUsed",
  TOKEN_EXPIRED: "account.errors.tokenExpired",
  TOKEN_MISSING: "account.errors.tokenMissing",
  SESSION_INVALID: "account.errors.sessionInvalid",
  CUSTOMER_NOT_FOUND: "account.errors.customerNotFound",
};

export const resolveAccountErrorKey = (
  error: unknown,
  fallback = "account.errors.unexpected",
): string => {
  if (!isApiError(error)) return fallback;
  if (error.status === 0) return "account.errors.network";
  return ACCOUNT_ERROR_KEYS[error.code] ?? fallback;
};
