"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { CHECKOUT_HREF } from "@/lib/routes";
import { cn } from "@/lib/utils";

const CartCheckoutLink = () => {
  const t = useTranslations("cart.checkout");

  return (
    <Link
      href={CHECKOUT_HREF}
      className={cn(
        buttonVariants({ size: "sm" }),
        "w-full motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none",
      )}
    >
      {t("cta")}
    </Link>
  );
};

export default memo(CartCheckoutLink);
