"use client";

import { memo, useState } from "react";
import { useTranslations } from "next-intl";
import { Shake } from "@/components/Animation/Shake";
import CheckoutField from "@/components/ECommerce/Checkout/CheckoutField";
import CheckoutFocusSection from "@/components/ECommerce/Checkout/CheckoutFocusSection";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { resolveCheckoutErrorKey } from "@/lib/checkoutError";
import { useValidateCouponMutation } from "@/store/couponApi";
import type { ICouponPreview, ICheckoutItem } from "@/interface";

interface IProps {
  items: ICheckoutItem[];
  hasInvalidItems: boolean;
  onPreviewChange: (preview: ICouponPreview | null) => void;
}

const CheckoutCoupon = ({
  items,
  hasInvalidItems,
  onPreviewChange,
}: IProps) => {
  const t = useTranslations();
  const tCommon = useTranslations("common");
  const [code, setCode] = useState("");
  const [preview, setPreview] = useState<ICouponPreview | null>(null);
  const [errorKey, setErrorKey] = useState<string | undefined>(undefined);
  const [shakeKey, setShakeKey] = useState(0);
  const [validateCoupon, { isLoading }] = useValidateCouponMutation();

  const normalizedCode = code.trim();
  const isDisabled =
    normalizedCode.length === 0 || hasInvalidItems || items.length === 0;

  const handleApply = async () => {
    if (isDisabled) return;

    setErrorKey(undefined);
    try {
      const result = await validateCoupon({
        couponCode: normalizedCode,
        items,
      }).unwrap();
      if (!result.valid) {
        setPreview(null);
        onPreviewChange(null);
        setErrorKey("checkout.errors.couponInvalid");
        setShakeKey((key) => key + 1);
        return;
      }
      setPreview(result);
      onPreviewChange(result);
    } catch (error) {
      const nextErrorKey = resolveCheckoutErrorKey(error, "checkout.loadFailed");
      setPreview(null);
      onPreviewChange(null);
      setErrorKey(nextErrorKey);
      if (nextErrorKey === "checkout.errors.couponInvalid") {
        setShakeKey((key) => key + 1);
      }
    }
  };

  const handleClear = () => {
    setCode("");
    setPreview(null);
    setErrorKey(undefined);
    onPreviewChange(null);
  };

  return (
    <CheckoutFocusSection id="checkout-coupon" className="space-y-3">
      <h2 className="font-display text-xl text-ink">
        {t("checkout.couponTitle")}
      </h2>
      <Shake key={shakeKey} isShaking={errorKey === "checkout.errors.couponInvalid"}>
        <CheckoutField
          label={t("checkout.couponPlaceholder")}
          htmlFor="checkout-coupon-code"
        >
          <Input
            id="checkout-coupon-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder={t("checkout.couponPlaceholder")}
            aria-describedby={
              errorKey
                ? "checkout-coupon-error"
                : preview
                  ? "checkout-coupon-success"
                  : undefined
            }
          />
        </CheckoutField>
      </Shake>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => void handleApply()}
          disabled={isDisabled}
          isLoading={isLoading}
        >
          {t("checkout.applyCoupon")}
        </Button>
        {preview ? (
          <Button variant="ghost" onClick={handleClear}>
            {t("checkout.clearCoupon")}
          </Button>
        ) : null}
      </div>
      <div aria-live="polite" className="space-y-1">
        {errorKey ? (
          <p id="checkout-coupon-error" role="alert" className="text-sm text-danger">
            {t(errorKey)}
          </p>
        ) : null}
        {preview ? (
          <p id="checkout-coupon-success" className="text-sm text-success">
            {t("checkout.couponApplied", {
              code: preview.couponCode,
              discount: preview.discount,
              currency: tCommon("currencyEgp"),
            })}
          </p>
        ) : null}
      </div>
    </CheckoutFocusSection>
  );
};

export default memo(CheckoutCoupon);
