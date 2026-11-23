"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import CheckoutFocusSection from "@/components/ECommerce/Checkout/CheckoutFocusSection";
import type { UseFormReturn } from "react-hook-form";
import { resolveCheckoutFieldErrorKey } from "@/lib/checkoutFieldError";
import type { TCheckoutForm } from "@/validation/checkout";

interface IProps {
  form: UseFormReturn<TCheckoutForm>;
  isDisabled: boolean;
}

const CheckoutPaymentMethod = ({ form, isDisabled }: IProps) => {
  const t = useTranslations();
  const { register, formState } = form;
  const paymentField = register("paymentMethod");

  return (
    <CheckoutFocusSection id="checkout-payment">
      <fieldset
        className="space-y-3"
        aria-describedby={
          formState.errors.paymentMethod ? "checkout-payment-error" : undefined
        }
      >
        <legend className="font-display text-xl text-ink">
          {t("checkout.paymentMethodTitle")}
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex items-center gap-2 rounded-md bg-paper p-3 text-ink">
            <input
              type="radio"
              value="COD"
              disabled={isDisabled}
              className="size-4 accent-primary focus-visible:outline-2 focus-visible:outline-primary"
              {...paymentField}
            />
            <span className="text-sm font-semibold">
              {t("checkout.paymentCod")}
            </span>
          </label>
          <label className="flex items-center gap-2 rounded-md bg-paper p-3 text-ink">
            <input
              type="radio"
              value="ONLINE_TRANSFER"
              disabled={isDisabled}
              className="size-4 accent-primary focus-visible:outline-2 focus-visible:outline-primary"
              {...paymentField}
            />
            <span className="text-sm font-semibold">
              {t("checkout.paymentOnline")}
            </span>
          </label>
        </div>
      </fieldset>
      {formState.errors.paymentMethod ? (
        <p id="checkout-payment-error" role="alert" className="mt-2 text-sm text-danger">
          {t(resolveCheckoutFieldErrorKey("paymentMethod"))}
        </p>
      ) : null}
    </CheckoutFocusSection>
  );
};

export default memo(CheckoutPaymentMethod);
