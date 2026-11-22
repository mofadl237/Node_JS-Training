"use client";

import { AnimatePresence, m } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RollingNumber } from "@/components/Animation/RollingNumber";
import { Badge } from "@/components/ui/Badge";
import { useFloatingCartCta } from "@/hooks/useFloatingCartCta";
import { CART_HREF } from "@/lib/routes";
import { SPRING_CARD } from "@/lib/motion";

export const FloatingCartCta = () => {
  // 1- state
  const t = useTranslations("cart");
  const { isVisible, itemsCount } = useFloatingCartCta();

  // 3- render
  return (
    <AnimatePresence>
      {isVisible ? (
        <m.div
          key="floating-cart-cta"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={SPRING_CARD}
          className="pointer-events-none fixed bottom-24 end-6 z-50 flex justify-end"
        >
          <Link
            href={CART_HREF}
            aria-label={t("floatingAria", { count: itemsCount })}
            className="cart-cta pointer-events-auto inline-flex items-center gap-3 rounded-full bg-primary px-4 py-3 text-on-primary shadow-floating ring-1 ring-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-primary"
          >
            <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-on-primary/10">
              <ShoppingCart aria-hidden="true" className="size-5" />
              <Badge
                variant="accent"
                className="absolute -top-1 -end-1 grid size-6 place-items-center px-0 py-0 text-[10px] leading-none"
              >
                <RollingNumber value={itemsCount} suffix={itemsCount > 99 ? "+" : undefined} />
              </Badge>
            </span>
            <span className="text-start">
              <span className="block text-sm font-semibold">{t("floatingTitle")}</span>
              <span className="block text-xs text-on-primary/80">{t("floatingBody", { count: itemsCount })}</span>
            </span>
          </Link>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
};
