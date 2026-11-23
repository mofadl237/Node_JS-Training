"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import CheckoutAddressForm from "@/components/ECommerce/Checkout/CheckoutAddressForm";
import CheckoutCoupon from "@/components/ECommerce/Checkout/CheckoutCoupon";
import CheckoutItems from "@/components/ECommerce/Checkout/CheckoutItems";
import CheckoutPaymentMethod from "@/components/ECommerce/Checkout/CheckoutPaymentMethod";
import CheckoutShipping from "@/components/ECommerce/Checkout/CheckoutShipping";
import CheckoutStepper from "@/components/ECommerce/Checkout/CheckoutStepper";
import CheckoutSubmit from "@/components/ECommerce/Checkout/CheckoutSubmit";
import CheckoutSummary from "@/components/ECommerce/Checkout/CheckoutSummary";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import { useCheckoutSubmit } from "@/hooks/useCheckoutSubmit";
import { resolveCheckoutErrorKey } from "@/lib/checkoutError";
import { CHECKOUT_SUCCESS_HREF } from "@/lib/routes";
import {
  useGetShippingAreasQuery,
  useGetShippingQuoteQuery,
} from "@/store/shippingApi";
import type { IStoreCart } from "@/store/cartApi";
import type { ICouponPreview } from "@/interface";
import { shippingQuoteQuerySchema } from "@/validation/shipping";

interface IProps {
  cart: IStoreCart;
}

const CheckoutContent = ({ cart }: IProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [couponPreview, setCouponPreview] = useState<ICouponPreview | null>(null);
  const [isSubmitSucceeded, setIsSubmitSucceeded] = useState(false);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { form, items, hasInvalidItems, governorate, city } = useCheckoutForm({
    lines: cart.lines,
  });
  const handleCouponPreviewChange = useCallback((preview: ICouponPreview | null) => {
    setCouponPreview(preview);
  }, []);
  const goToReceipt = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(CHECKOUT_SUCCESS_HREF);
      return;
    }
    setIsSubmitSucceeded(true);
    navigationTimer.current = setTimeout(() => {
      router.push(CHECKOUT_SUCCESS_HREF);
    }, 520);
  }, [router]);
  useEffect(() => {
    return () => {
      if (navigationTimer.current !== null) clearTimeout(navigationTimer.current);
    };
  }, []);
  const { submit, isSubmitting, isLocked, errorKey, receiptErrorKey } =
    useCheckoutSubmit({
      form,
      cart,
      couponCode: couponPreview?.couponCode,
      hasInvalidItems,
      onSuccess: goToReceipt,
    });
  const {
    data: areas = [],
    error: areasError,
    isLoading: areAreasLoading,
  } = useGetShippingAreasQuery();
  const quoteQuery = useMemo(() => {
    const parsed = shippingQuoteQuerySchema.safeParse({ governorate, city });
    return parsed.success ? parsed.data : null;
  }, [city, governorate]);
  const {
    data: quoteData,
    error: quoteError,
    isLoading: isQuoteLoading,
  } = useGetShippingQuoteQuery(quoteQuery ?? { governorate: "", city: "" }, {
    skip: quoteQuery === null,
  });

  const quote = quoteData ?? null;
  const activeStep = !governorate || !city ? 0 : quote ? 2 : 1;
  const areasErrorKey = areasError
    ? resolveCheckoutErrorKey(areasError, "checkout.loadFailed")
    : undefined;
  const quoteErrorKey = quoteError
    ? resolveCheckoutErrorKey(quoteError, "checkout.loadFailed")
    : undefined;

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      {hasInvalidItems || form.formState.errors.items ? (
        <p role="alert" className="text-sm text-danger">
          {t("checkout.errors.invalidQuantity")}
        </p>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <CheckoutStepper activeStep={activeStep} />
          <CheckoutItems lines={cart.lines} />
          <CheckoutAddressForm
            form={form}
            areas={areas}
            isAreasLoading={areAreasLoading}
            areasErrorKey={areasErrorKey}
          />
          <CheckoutPaymentMethod form={form} isDisabled={isSubmitting} />
        </div>
        <div className="space-y-6">
          <CheckoutShipping
            governorate={governorate}
            city={city}
            isLoading={isQuoteLoading}
            quote={quote}
            errorKey={quoteErrorKey}
          />
          <CheckoutCoupon
            items={items}
            hasInvalidItems={hasInvalidItems}
            onPreviewChange={handleCouponPreviewChange}
          />
          <CheckoutSummary
            cartSubtotal={cart.subtotal}
            itemsCount={cart.itemsCount}
            couponPreview={couponPreview}
            quote={quote}
            isQuoteLoading={isQuoteLoading}
            quoteErrorKey={quoteErrorKey}
          />
          <CheckoutSubmit
            disabled={hasInvalidItems || isLocked}
            isSubmitting={isSubmitting}
            isSuccess={isSubmitSucceeded}
            errorKey={errorKey}
            receiptErrorKey={receiptErrorKey}
          />
        </div>
      </div>
    </form>
  );
};

export default CheckoutContent;
