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
    <Link href={CHECKOUT_HREF} className={cn(buttonVariants({ size: "sm" }), "w-full")}>
      {t("cta")}
    </Link>
  );
};

export default memo(CartCheckoutLink);
