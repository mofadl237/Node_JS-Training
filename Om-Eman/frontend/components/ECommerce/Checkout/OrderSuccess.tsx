"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import CheckoutFocusSection from "@/components/ECommerce/Checkout/CheckoutFocusSection";
import PaymentProofForm from "@/components/ECommerce/Checkout/PaymentProofForm";
import CheckoutSuccessSkeleton from "@/components/Skelton/CheckoutSuccessSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { buttonVariants } from "@/components/ui/Button";
import { useOrderReceipt } from "@/hooks/useOrderReceipt";
import { CART_HREF } from "@/lib/routes";

const OrderSuccess = () => {
  const t = useTranslations("orderSuccess");
  const { receipt, status } = useOrderReceipt();

  if (status === "loading") return <CheckoutSuccessSkeleton />;

  if (!receipt) {
    return (
      <ErrorState
        title={t("missingTitle")}
        body={t("missingBody")}
        action={
          <Link href={CART_HREF} className={buttonVariants({ variant: "soft" })}>
            {t("backToCart")}
          </Link>
        }
      />
    );
  }

  const totals = receipt.totals;
  const paymentLabel =
    receipt.paymentMethod === "COD" ? t("paymentCod") : t("paymentOnline");

  return (
    <CheckoutFocusSection id="order-success" className="space-y-5">
      <div className="space-y-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-success" role="status">
          <Check
            aria-hidden="true"
            className="size-5 checkout-check-draw"
            strokeWidth={2.5}
          />
          {t("confirmed")}
        </p>
        <h2 className="font-display text-2xl text-ink">{t("title")}</h2>
        <p className="text-ink-soft">
          {receipt.paymentMethod === "COD" ? t("codMessage") : t("onlineMessage")}
        </p>
      </div>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-md bg-paper p-3">
          <dt className="text-ink-soft">{t("orderNumber")}</dt>
          <dd className="font-semibold text-ink">{receipt.orderNumber}</dd>
        </div>
        <div className="rounded-md bg-paper p-3">
          <dt className="text-ink-soft">{t("paymentMethod")}</dt>
          <dd className="font-semibold text-ink">{paymentLabel}</dd>
        </div>
        <div className="rounded-md bg-paper p-3">
          <dt className="text-ink-soft">{t("subtotal")}</dt>
          <dd className="font-semibold text-ink">
            {totals.subtotal} {totals.currency}
          </dd>
        </div>
        <div className="rounded-md bg-paper p-3">
          <dt className="text-ink-soft">{t("discount")}</dt>
          <dd className="font-semibold text-ink">
            {totals.discountTotal} {totals.currency}
          </dd>
        </div>
        <div className="rounded-md bg-paper p-3">
          <dt className="text-ink-soft">{t("shipping")}</dt>
          <dd className="font-semibold text-ink">
            {totals.shippingTotal} {totals.currency}
          </dd>
        </div>
        <div className="rounded-md bg-paper p-3">
          <dt className="text-ink-soft">{t("tax")}</dt>
          <dd className="font-semibold text-ink">
            {totals.taxTotal} {totals.currency}
          </dd>
        </div>
        <div className="rounded-md bg-primary/10 p-3 sm:col-span-2">
          <dt className="text-ink-soft">{t("grandTotal")}</dt>
          <dd className="font-display text-xl text-ink">
            {totals.grandTotal} {totals.currency}
          </dd>
        </div>
      </dl>
      <div className="rounded-md bg-surface-2 p-3 text-sm text-ink-soft">
        {t("sessionNotice")}
      </div>
      {receipt.paymentMethod === "ONLINE_TRANSFER" ? <PaymentProofForm /> : null}
      <Link href={CART_HREF} className={buttonVariants({ variant: "soft" })}>
        {t("continueShopping")}
      </Link>
    </CheckoutFocusSection>
  );
};

export default memo(OrderSuccess);
