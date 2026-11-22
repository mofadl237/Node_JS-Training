"use client";

import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CartBounce } from "@/components/Animation/CartBounce";
import { RollingNumber } from "@/components/Animation/RollingNumber";
import { Badge } from "@/components/ui/Badge";
import { useCartBadge } from "@/hooks/useCartBadge";
import { CART_HREF } from "@/lib/routes";

export const CartLink = () => {
  // 1- state
  const t = useTranslations("header");
  const { itemsCount, isReady, hasError } = useCartBadge();
  const showBadge = isReady && !hasError && itemsCount > 0;

  // 3- render
  return (
    <Link
      href={CART_HREF}
      aria-label={t("cart")}
      className="relative grid size-10 place-items-center rounded-sm bg-surface text-ink shadow-rest transition-transform duration-150 hover:scale-105"
    >
      <CartBounce pulseKey={itemsCount}>
        <ShoppingCart aria-hidden="true" className="size-5" />
      </CartBounce>
      {showBadge ? (
        <Badge
          variant="primary"
          role="status"
          aria-label={t("cartItems", { count: itemsCount })}
          className="pointer-events-none absolute -top-1.5 -end-1.5 grid size-7 place-items-center rounded-full px-0 py-0 text-[11px] font-bold leading-none shadow-rest ring-2 ring-paper select-none"
        >
          <RollingNumber value={itemsCount} suffix={itemsCount > 99 ? "+" : undefined} />
        </Badge>
      ) : null}
    </Link>
  );
};
