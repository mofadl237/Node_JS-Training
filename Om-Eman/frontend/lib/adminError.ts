import { isApiError } from "./cartError";

const ADMIN_ERROR_KEYS: Record<string, string> = {
  VALIDATION_ERROR: "dashboard.errors.validation",
  REQUEST_FAILED: "dashboard.errors.requestFailed",
  NETWORK_ERROR: "dashboard.errors.network",
  TIMEOUT: "dashboard.errors.timeout",
  INVALID_CREDENTIALS: "dashboard.errors.invalidCredentials",
  EMPLOYEE_DISABLED: "dashboard.errors.employeeDisabled",
  EMPLOYEE_NOT_FOUND: "dashboard.errors.employeeUnavailable",
  TOKEN_MISSING: "dashboard.errors.sessionMissing",
  TOKEN_INVALID: "dashboard.errors.sessionInvalid",
  TOKEN_EXPIRED: "dashboard.errors.sessionExpired",
  UNAUTHORIZED: "dashboard.errors.sessionInvalid",
  SESSION_INVALID: "dashboard.errors.sessionInvalid",
  TOO_MANY_REQUESTS: "dashboard.errors.rateLimited",
  RATE_LIMITED: "dashboard.errors.rateLimited",
  ROUTE_NOT_ALLOWED: "dashboard.errors.routeNotAllowed",
  INVALID_RESPONSE: "dashboard.errors.invalidResponse",
};

export const resolveAdminErrorKey = (
  error: unknown,
  fallback = "dashboard.errors.unexpected",
): string => {
  if (!isApiError(error)) return fallback;
  if (error.code === "TIMEOUT") return "dashboard.errors.timeout";
  if (error.status === 0) return "dashboard.errors.network";
  return ADMIN_ERROR_KEYS[error.code] ?? fallback;
};
