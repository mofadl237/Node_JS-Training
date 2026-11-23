"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import CheckoutAddressMainFields from "@/components/ECommerce/Checkout/CheckoutAddressMainFields";
import CheckoutAddressOptionalFields from "@/components/ECommerce/Checkout/CheckoutAddressOptionalFields";
import CheckoutFocusSection from "@/components/ECommerce/Checkout/CheckoutFocusSection";
import type { IShippingArea } from "@/interface";
import type { TCheckoutForm } from "@/validation/checkout";

interface IProps {
  form: UseFormReturn<TCheckoutForm>;
  areas: IShippingArea[];
  isAreasLoading: boolean;
  areasErrorKey?: string;
}

const CheckoutAddressForm = ({
  form,
  areas,
  isAreasLoading,
  areasErrorKey,
}: IProps) => {
  const t = useTranslations();
  const governorateValue =
    useWatch({ control: form.control, name: "address.governorate" }) ?? "";
  const isSelectDisabled =
    isAreasLoading || Boolean(areasErrorKey) || areas.length === 0;

  return (
    <CheckoutFocusSection id="checkout-address" className="space-y-4">
      <h2 className="font-display text-xl text-ink">
        {t("checkout.addressTitle")}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <CheckoutAddressMainFields
          form={form}
          areas={areas}
          governorateValue={governorateValue}
          isSelectDisabled={isSelectDisabled}
        />
        <CheckoutAddressOptionalFields form={form} />
      </div>
      {isAreasLoading ? (
        <p role="status" className="text-sm text-ink-soft">
          {t("checkout.areasLoading")}
        </p>
      ) : null}
      {areasErrorKey ? (
        <p role="alert" className="text-sm text-danger">
          {t(areasErrorKey)}
        </p>
      ) : null}
      {!isAreasLoading && !areasErrorKey && areas.length === 0 ? (
        <p role="status" className="text-sm text-ink-soft">
          {t("checkout.areasUnavailable")}
        </p>
      ) : null}
    </CheckoutFocusSection>
  );
};

export default CheckoutAddressForm;
