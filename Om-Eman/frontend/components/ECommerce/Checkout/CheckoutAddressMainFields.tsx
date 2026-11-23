"use client";

import type { ChangeEvent } from "react";
import { type UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import CheckoutField from "@/components/ECommerce/Checkout/CheckoutField";
import { CheckoutSelect } from "@/components/ECommerce/Checkout/CheckoutSelect";
import { Input } from "@/components/ui/Input";
import { resolveCheckoutFieldErrorKey } from "@/lib/checkoutFieldError";
import type { IShippingArea } from "@/interface";
import type { TCheckoutForm } from "@/validation/checkout";
import { shippingQuoteQuerySchema } from "@/validation/shipping";

interface IProps {
  form: UseFormReturn<TCheckoutForm>;
  areas: IShippingArea[];
  governorateValue: string;
  isSelectDisabled: boolean;
}

const CheckoutAddressMainFields = ({
  form,
  areas,
  governorateValue,
  isSelectDisabled,
}: IProps) => {
  const t = useTranslations();
  const { register, setValue, formState } = form;
  const { errors } = formState;
  const selectedArea = areas.find(
    (area) => area.governorate === governorateValue,
  );
  const governorateField = register("address.governorate");
  const cityField = register("address.city");

  const governorateOptions = [
    { value: "", label: t("checkout.selectGovernorate") },
    ...areas.map((area) => ({ value: area.governorate, label: area.governorate })),
  ];
  const cityOptions = (selectedArea?.cities ?? []).flatMap((city) =>
    city.city && shippingQuoteQuerySchema.shape.city.safeParse(city.city).success ? [city.city] : [],
  );

  const handleGovernorateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    governorateField.onChange(event);
    setValue("address.city", "", { shouldValidate: false });
  };

  const errorKey = (name: string, hasError: boolean) =>
    hasError ? resolveCheckoutFieldErrorKey(name) : undefined;

  return (
    <>
      <CheckoutField
        label={t("checkout.recipientName")}
        htmlFor="checkout-recipient"
        errorKey={errorKey("recipientName", Boolean(errors.recipientName))}
      >
        <Input
          id="checkout-recipient"
          autoComplete="name"
          hasError={Boolean(errors.recipientName)}
          aria-invalid={Boolean(errors.recipientName)}
          aria-describedby={errors.recipientName ? "checkout-recipient-error" : undefined}
          {...register("recipientName")}
        />
      </CheckoutField>

      <CheckoutField
        label={t("checkout.phone")}
        htmlFor="checkout-phone"
        errorKey={errorKey("phone", Boolean(errors.phone))}
      >
        <Input
          id="checkout-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          hasError={Boolean(errors.phone)}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "checkout-phone-error" : undefined}
          {...register("phone")}
        />
      </CheckoutField>

      <CheckoutField
        label={t("checkout.governorate")}
        htmlFor="checkout-governorate"
        errorKey={errorKey("address.governorate", Boolean(errors.address?.governorate))}
      >
        <CheckoutSelect
          id="checkout-governorate"
          autoComplete="address-level1"
          options={governorateOptions}
          disabled={isSelectDisabled}
          hasError={Boolean(errors.address?.governorate)}
          aria-invalid={Boolean(errors.address?.governorate)}
          aria-describedby={errors.address?.governorate ? "checkout-governorate-error" : undefined}
          {...governorateField}
          onChange={handleGovernorateChange}
        />
      </CheckoutField>

      <CheckoutField
        label={t("checkout.city")}
        htmlFor="checkout-city"
        hint={t("checkout.cityHint")}
        errorKey={errorKey("address.city", Boolean(errors.address?.city))}
      >
        <Input
          id="checkout-city"
          list="checkout-city-options"
          autoComplete="address-level2"
          disabled={isSelectDisabled || !governorateValue}
          hasError={Boolean(errors.address?.city)}
          aria-invalid={Boolean(errors.address?.city)}
          aria-describedby={
            ["checkout-city-hint", errors.address?.city ? "checkout-city-error" : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          {...cityField}
        />
        <datalist id="checkout-city-options">
          {cityOptions.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>
      </CheckoutField>

      <CheckoutField
        label={t("checkout.street")}
        htmlFor="checkout-street"
        className="sm:col-span-2"
        errorKey={errorKey("address.street", Boolean(errors.address?.street))}
      >
        <Input
          id="checkout-street"
          autoComplete="street-address"
          hasError={Boolean(errors.address?.street)}
          aria-invalid={Boolean(errors.address?.street)}
          aria-describedby={errors.address?.street ? "checkout-street-error" : undefined}
          {...register("address.street")}
        />
      </CheckoutField>
    </>
  );
};

export default CheckoutAddressMainFields;
