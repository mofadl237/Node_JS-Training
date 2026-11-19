"use client";

import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CartBounce } from "@/components/Animation/CartBounce";
import { CART_HREF } from "@/lib/routes";

export const CartLink = () => {
  // 1- state
  const t = useTranslations("header");

  // 3- render
  return (
    <Link
      href={CART_HREF}
      aria-label={t("cart")}
      className="grid size-10 place-items-center rounded-sm bg-surface text-ink shadow-rest transition-transform duration-150 hover:scale-105"
    >
      <CartBounce>
        <ShoppingCart aria-hidden="true" className="size-5" />
      </CartBounce>
    </Link>
  );
};
