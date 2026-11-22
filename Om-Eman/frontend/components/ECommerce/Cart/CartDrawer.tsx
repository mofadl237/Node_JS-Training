"use client";

import { useId, useSyncExternalStore, type ReactNode } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import CartSkeleton from "@/components/Skelton/CartSkeleton";
import { Button, buttonVariants } from "@/components/ui/Button";
import { useCartActions } from "@/hooks/useCartActions";
import { useCartToken } from "@/hooks/useCartToken";
import { useDrawerFocus } from "@/hooks/useDrawerFocus";
import { resolveCartErrorKey } from "@/lib/cartError";
import { cn } from "@/lib/utils";
import { useGetCartByTokenQuery } from "@/store/cartApi";
import CartLine from "./CartLine";
import CartState from "./CartState";
import CartSummary from "./CartSummary";

interface IProps {
  freeShippingThreshold: string | null;
}

const subscribeNoop = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const CartDrawer = ({ freeShippingThreshold }: IProps) => {
  const t = useTranslations("cart");
  const token = useCartToken();
  const hasHydrated = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);
  const { data, error, isLoading, refetch } = useGetCartByTokenQuery(token ?? "", {
    skip: token === undefined,
  });
  const { isMutating, errorKey, updateQuantity, removeItem } = useCartActions(token);
  const { isOpen, open, close, panelRef, triggerRef } = useDrawerFocus();
  const titleId = useId();
  const panelId = useId();

  const browseAction = (
    <Link href="/products" className={buttonVariants({ size: "sm" })}>
      {t("continueShopping")}
    </Link>
  );

  let content: ReactNode;
  if (!hasHydrated) {
    content = <CartSkeleton />;
  } else if (!token) {
    content = <CartState kind="empty" title={t("emptyTitle")} body={t("emptyBody")} action={browseAction} />;
  } else if (isLoading) {
    content = <CartSkeleton />;
  } else if (error || !data) {
    content = (
      <CartState
        kind="error"
        title={t("errorTitle")}
        body={t(resolveCartErrorKey(error, "loadFailed"))}
        action={
          <Button size="sm" onClick={() => void refetch()}>
            {t("retry")}
          </Button>
        }
      />
    );
  } else if (data.lines.length === 0) {
    content = <CartState kind="empty" title={t("emptyTitle")} body={t("emptyBody")} action={browseAction} />;
  } else {
    content = (
      <div className="space-y-4">
        <ul className="space-y-3">
          {data.lines.map((line) => (
            <CartLine
              key={line.id}
              line={line}
              isBusy={isMutating}
              onQuantityChange={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </ul>
        <CartSummary
          subtotal={data.subtotal}
          itemsCount={data.itemsCount}
          freeShippingThreshold={freeShippingThreshold}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        ref={triggerRef}
        type="button"
        onClick={open}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={buttonVariants({ variant: "soft", size: "sm" })}
      >
        {t("openDrawer")}
      </button>
      {isOpen ? (
        <button
          type="button"
          aria-label={t("closeDrawer")}
          onClick={close}
          className="fixed inset-0 z-50 bg-ink/40"
        />
      ) : null}
      <aside
        ref={panelRef}
        id={panelId}
        role={isOpen ? "dialog" : undefined}
        aria-modal={isOpen || undefined}
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "space-y-4 rounded-lg bg-surface p-4 shadow-rest outline-none transition-shadow duration-200 motion-reduce:transition-none",
          isOpen && "fixed inset-y-0 end-0 z-50 w-full max-w-md overflow-y-auto rounded-none shadow-floating",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id={titleId} className="font-display text-lg text-ink">
            {t("drawerTitle")}
          </h2>
          {isOpen ? (
            <button
              type="button"
              onClick={close}
              aria-label={t("closeDrawer")}
              className="grid size-9 place-items-center rounded-sm text-ink hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          ) : null}
        </div>
        {errorKey ? (
          <p role="alert" className="text-sm text-danger">
            {t(errorKey)}
          </p>
        ) : null}
        {content}
      </aside>
    </div>
  );
};

export default CartDrawer;
