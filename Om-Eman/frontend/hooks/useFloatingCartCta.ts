"use client";

import { usePathname } from "@/i18n/navigation";
import { useCartBadge } from "@/hooks/useCartBadge";
import { CART_HREF, CHECKOUT_HREF } from "@/lib/routes";

export interface IUseFloatingCartCtaResult {
  isVisible: boolean;
  itemsCount: number;
}

export const useFloatingCartCta = (): IUseFloatingCartCtaResult => {
  // 1- state
  const pathname = usePathname();
  const { itemsCount, isReady, hasError } = useCartBadge();
  const isCartPage = pathname === CART_HREF || pathname.endsWith(`${CART_HREF}/`);
  const isCheckoutFlow = pathname === CHECKOUT_HREF || pathname.startsWith(`${CHECKOUT_HREF}/`);

  // 2- result
  return {
    isVisible: isReady && !hasError && itemsCount > 0 && !isCartPage && !isCheckoutFlow,
    itemsCount,
  };
};
