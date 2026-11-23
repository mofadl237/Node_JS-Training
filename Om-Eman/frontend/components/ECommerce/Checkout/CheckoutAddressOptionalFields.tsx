"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";
import CheckoutField from "@/components/ECommerce/Checkout/CheckoutField";
import { Input } from "@/components/ui/Input";
import type { TCheckoutForm } from "@/validation/checkout";

interface IProps {
  form: UseFormReturn<TCheckoutForm>;
}

const CheckoutAddressOptionalFields = ({ form }: IProps) => {
  const t = useTranslations();
  const { register } = form;

  return (
    <>
      <CheckoutField
        label={t("checkout.district")}
        htmlFor="checkout-district"
      >
        <Input id="checkout-district" {...register("address.district")} />
      </CheckoutField>
      <CheckoutField
        label={t("checkout.building")}
        htmlFor="checkout-building"
      >
        <Input id="checkout-building" {...register("address.building")} />
      </CheckoutField>
      <CheckoutField label={t("checkout.floor")} htmlFor="checkout-floor">
        <Input id="checkout-floor" {...register("address.floor")} />
      </CheckoutField>
      <CheckoutField
        label={t("checkout.landmark")}
        htmlFor="checkout-landmark"
      >
        <Input id="checkout-landmark" {...register("address.landmark")} />
      </CheckoutField>
    </>
  );
};

export default memo(CheckoutAddressOptionalFields);
