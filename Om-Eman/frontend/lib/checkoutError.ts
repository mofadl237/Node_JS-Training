import type { IApiError } from "@/interface/api";
import { isApiError } from "./cartError";

const CHECKOUT_ERROR_KEYS: Record<string, string> = {
  VALIDATION_ERROR: "checkout.errors.validation",
  REQUEST_FAILED: "checkout.errors.requestFailed",
  CHECKOUT_EMPTY: "checkout.errors.emptyCart",
  CHECKOUT_INVALID_QUANTITY: "checkout.errors.invalidQuantity",
  PACKAGE_NOT_FOUND: "checkout.errors.packageNotFound",
  PACKAGE_NOT_SALEABLE: "checkout.errors.packageNotSaleable",
  PACKAGE_OUT_OF_STOCK: "checkout.errors.packageOutOfStock",
  SHIPPING_AREA_NOT_CONFIGURED: "checkout.errors.shippingAreaNotConfigured",
  COUPON_INVALID: "checkout.errors.couponInvalid",
  COUPON_NOT_ACTIVE: "checkout.errors.couponNotActive",
  COUPON_EXPIRED: "checkout.errors.couponExpired",
  COUPON_NOT_FOR_CUSTOMER: "checkout.errors.couponNotForCustomer",
  COUPON_MIN_ORDER: "checkout.errors.couponMinOrder",
  COUPON_LIMIT_REACHED: "checkout.errors.couponLimitReached",
  COUPON_PER_CUSTOMER_REACHED: "checkout.errors.couponPerCustomerReached",
  RATE_LIMITED: "checkout.errors.rateLimited",
  TOO_MANY_REQUESTS: "checkout.errors.rateLimited",
  ORDER_NOT_FOUND: "payment.errors.orderNotFound",
  ORDER_ACCESS_DENIED: "payment.errors.orderAccessDenied",
  PAYMENT_ALREADY_CONFIRMED: "payment.errors.alreadyConfirmed",
  PAYMENT_UNDER_REVIEW: "payment.errors.underReview",
  PAYMENT_METHOD_NOT_ONLINE: "payment.errors.methodNotOnline",
};

export const resolveCheckoutErrorKey = (
  error: unknown,
  fallback = "checkout.errors.unexpected",
): string => {
  const apiError: IApiError | null = isApiError(error) ? error : null;
  return apiError ? CHECKOUT_ERROR_KEYS[apiError.code] ?? fallback : fallback;
};

export const resolveCheckoutSubmitErrorKey = (error: unknown): string => {
  if (isApiError(error) && error.status === 0) {
    return "checkout.errors.networkUnclear";
  }
  return resolveCheckoutErrorKey(error);
};
