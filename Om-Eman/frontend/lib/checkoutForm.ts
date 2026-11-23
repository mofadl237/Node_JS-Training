import type {
  ICheckoutCartLine,
  ICheckoutItem,
  IGuestCheckoutPayload,
} from "@/interface";
import {
  checkoutFormSchema,
  checkoutItemSchema,
  type TCheckoutForm,
} from "@/validation/checkout";

const optionalText = (value: string | undefined): string | undefined =>
  value === undefined || value.trim().length === 0 ? undefined : value.trim();

export const cartLinesToCheckoutItems = (
  lines: ICheckoutCartLine[],
): ICheckoutItem[] =>
  lines.map((line) =>
    checkoutItemSchema.parse({
      productPackageId: line.package?.id,
      quantity: Number(line.quantity),
    }),
  );

export const toCheckoutPayload = (
  values: TCheckoutForm,
  guestToken?: string,
): IGuestCheckoutPayload => {
  const form = checkoutFormSchema.parse(values);
  const firstName = optionalText(form.firstName);
  const lastName = optionalText(form.lastName);
  const email = optionalText(form.email);
  const couponCode = optionalText(form.couponCode);
  const customerNotes = optionalText(form.customerNotes);
  const resolvedGuestToken = optionalText(guestToken ?? form.guestToken);
  const district = optionalText(form.address.district);
  const building = optionalText(form.address.building);
  const floor = optionalText(form.address.floor);
  const landmark = optionalText(form.address.landmark);

  return {
    phone: form.phone,
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
    ...(email ? { email } : {}),
    recipientName: form.recipientName,
    address: {
      governorate: form.address.governorate,
      city: form.address.city,
      street: form.address.street,
      ...(district ? { district } : {}),
      ...(building ? { building } : {}),
      ...(floor ? { floor } : {}),
      ...(landmark ? { landmark } : {}),
      ...(form.address.latitude === undefined
        ? {}
        : { latitude: form.address.latitude }),
      ...(form.address.longitude === undefined
        ? {}
        : { longitude: form.address.longitude }),
    },
    items: form.items,
    ...(couponCode ? { couponCode } : {}),
    ...(customerNotes ? { customerNotes } : {}),
    ...(resolvedGuestToken ? { guestToken: resolvedGuestToken } : {}),
    paymentMethod: form.paymentMethod,
  };
};
