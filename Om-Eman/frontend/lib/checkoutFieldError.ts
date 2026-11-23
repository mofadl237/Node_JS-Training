const CHECKOUT_FIELD_ERROR_KEYS: Record<string, string> = {
  phone: "checkout.validation.phone",
  recipientName: "checkout.validation.recipientName",
  "address.governorate": "checkout.validation.governorate",
  "address.city": "checkout.validation.city",
  "address.street": "checkout.validation.street",
  items: "checkout.errors.invalidQuantity",
  couponCode: "checkout.validation.couponCode",
  paymentMethod: "checkout.validation.paymentMethod",
};

export const resolveCheckoutFieldErrorKey = (name: string): string =>
  CHECKOUT_FIELD_ERROR_KEYS[name] ?? "checkout.errors.validation";
