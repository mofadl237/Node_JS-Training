"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import CheckoutField from "@/components/ECommerce/Checkout/CheckoutField";
import CheckoutFocusSection from "@/components/ECommerce/Checkout/CheckoutFocusSection";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useProofUpload } from "@/hooks/useProofUpload";

const PaymentProofForm = () => {
  const t = useTranslations("payment");
  const {
    errorKey,
    paymentStatus,
    isBusy,
    onFileChange,
    onReferenceChange,
    submit,
  } = useProofUpload();

  return (
    <CheckoutFocusSection id="payment-proof" className="space-y-4">
      <div className="space-y-1">
        <h2 className="font-display text-lg text-ink">{t("form.title")}</h2>
        <p className="text-sm text-ink-soft">{t("form.subtitle")}</p>
      </div>

      {paymentStatus === "PROOF_UPLOADED" ? (
        <div
          className="flex items-center gap-2 rounded-md bg-success/10 p-3 text-sm text-success"
          role="status"
        >
          <Check
            aria-hidden="true"
            className="size-5 checkout-check-draw"
            strokeWidth={2.5}
          />
          {t("status.proofUploaded")}
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <CheckoutField
            label={t("form.fileLabel")}
            htmlFor="payment-proof-file"
            hint={t("form.fileHint")}
            errorKey={errorKey}
          >
            <Input
              id="payment-proof-file"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              hasError={Boolean(errorKey)}
              disabled={isBusy}
            />
          </CheckoutField>
          <CheckoutField
            label={t("form.referenceLabel")}
            htmlFor="payment-proof-reference"
            hint={t("form.referenceHint")}
          >
            <Input
              id="payment-proof-reference"
              type="text"
              maxLength={100}
              autoComplete="off"
              onChange={onReferenceChange}
              disabled={isBusy}
            />
          </CheckoutField>
          <Button type="submit" isLoading={isBusy}>
            {t("form.submit")}
          </Button>
        </form>
      )}
    </CheckoutFocusSection>
  );
};

export default memo(PaymentProofForm);
