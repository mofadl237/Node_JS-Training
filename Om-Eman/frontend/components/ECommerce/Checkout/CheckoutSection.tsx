"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import CheckoutContent from "@/components/ECommerce/Checkout/CheckoutContent";
import CheckoutState from "@/components/ECommerce/Checkout/CheckoutState";
import CheckoutSkeleton from "@/components/Skelton/CheckoutSkeleton";
import { Button, buttonVariants } from "@/components/ui/Button";
import { useCartToken } from "@/hooks/useCartToken";
import { isApiError } from "@/lib/cartError";
import { resolveCheckoutErrorKey } from "@/lib/checkoutError";
import { useGetCartByTokenQuery } from "@/store/cartApi";

const subscribeNoop = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const CheckoutSection = () => {
  const t = useTranslations();
  const token = useCartToken();
  const hasHydrated = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );
  const {
    data: cart,
    error: cartError,
    isLoading: isCartLoading,
    refetch,
  } = useGetCartByTokenQuery(token ?? "", { skip: token === undefined });

  const isNetworkError = isApiError(cartError) && cartError.status === 0;
  const cartKey =
    cart?.lines.map((line) => `${line.id}:${line.quantity}`).join("|") ?? "";
  const browseAction = (
    <Link href="/products" className={buttonVariants({ size: "sm" })}>
      {t("cart.continueShopping")}
    </Link>
  );
  const emptyState = (
    <CheckoutState
      kind="empty"
      title={t("checkout.emptyTitle")}
      body={t("checkout.emptyBody")}
      action={browseAction}
    />
  );

  let content: ReactNode;
  if (!hasHydrated || isCartLoading) {
    content = <CheckoutSkeleton />;
  } else if (!token || cart?.lines.length === 0) {
    content = emptyState;
  } else if (cartError || !cart) {
    content = (
      <CheckoutState
        kind={isNetworkError ? "network" : "error"}
        title={
          isNetworkError ? t("checkout.networkTitle") : t("checkout.errorTitle")
        }
        body={
          isNetworkError
            ? t("checkout.networkBody")
            : t(resolveCheckoutErrorKey(cartError, "checkout.loadFailed"))
        }
        action={
          <Button size="sm" onClick={() => void refetch()}>
            {t("checkout.retry")}
          </Button>
        }
      />
    );
  } else {
    content = <CheckoutContent key={cartKey} cart={cart} />;
  }

  return <div>{content}</div>;
};

export default CheckoutSection;
