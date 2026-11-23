"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface IProps {
  disabled: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  errorKey?: string;
  receiptErrorKey?: string;
}

const CheckoutSubmit = ({
  disabled,
  isSubmitting,
  isSuccess,
  errorKey,
  receiptErrorKey,
}: IProps) => {
  const t = useTranslations();

  return (
    <div className="space-y-2">
      {errorKey ? (
        <p id="checkout-submit-error" role="alert" className="text-sm text-danger">
          {t(errorKey)}
        </p>
      ) : null}
      {receiptErrorKey ? (
        <p id="checkout-receipt-error" role="alert" className="text-sm text-danger">
          {t(receiptErrorKey)}
        </p>
      ) : null}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={disabled || Boolean(receiptErrorKey) || isSuccess}
        isLoading={isSubmitting && !isSuccess}
        aria-describedby={
          errorKey
            ? "checkout-submit-error"
            : receiptErrorKey
              ? "checkout-receipt-error"
              : undefined
        }
      >
        {isSuccess ? (
          <>
            <Check
              aria-hidden="true"
              className="size-5 checkout-check-draw checkout-submit-check"
              strokeWidth={2.5}
            />
            <span className="sr-only">{t("orderSuccess.confirmed")}</span>
          </>
        ) : (
          t("checkout.submit")
        )}
      </Button>
      <p className="text-center text-xs text-ink-soft">{t("checkout.submitNotice")}</p>
    </div>
  );
};

export default memo(CheckoutSubmit);
