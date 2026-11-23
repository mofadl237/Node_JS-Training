"use client";

import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import CheckoutFocusSection from "@/components/ECommerce/Checkout/CheckoutFocusSection";
import { PriceTag } from "@/components/shared/PriceTag";
import { StoreImage } from "@/components/shared/StoreImage";
import { Badge } from "@/components/ui/Badge";
import { productHref } from "@/lib/routes";
import type { IStoreCartLine } from "@/store/cartApi";

interface IProps {
  lines: IStoreCartLine[];
}

const CheckoutItems = ({ lines }: IProps) => {
  const t = useTranslations();
  const tCart = useTranslations("cart");
  const locale = useLocale();

  return (
    <CheckoutFocusSection id="checkout-items" className="space-y-3">
      <h2 className="font-display text-xl text-ink">
        {t("checkout.itemsTitle")}
      </h2>
      <ul className="space-y-3">
        {lines.map((line) => {
          const item = line.package;

          if (!item) {
            return (
              <li key={line.id} className="rounded-md bg-paper p-3">
                <Badge variant="soldOut">{tCart("unavailable")}</Badge>
              </li>
            );
          }

          const name =
            locale === "ar"
              ? item.nameAr ?? item.productNameAr
              : item.productNameEn ?? item.productNameAr;
          const size = [item.sizeValue, item.sizeUnit].filter(Boolean).join(" ");

          return (
            <li key={line.id} className="flex gap-3 rounded-md bg-paper p-3">
              <Link
                href={productHref(item.productSlug)}
                aria-label={name}
                className="relative size-16 shrink-0 overflow-hidden rounded-md bg-surface-2 sm:size-20"
              >
                <StoreImage
                  src={item.imageUrl}
                  alt={name}
                  sizes="80px"
                  className="object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="min-w-0 space-y-1">
                  <Link
                    href={productHref(item.productSlug)}
                    className="font-semibold text-ink hover:text-primary"
                  >
                    {name}
                  </Link>
                  {size ? <p className="text-sm text-ink-soft">{size}</p> : null}
                </div>
                <PriceTag
                  price={line.priceAtAdd ?? item.sellingPrice}
                  compareAt={item.compareAtPrice}
                />
                <p className="text-sm text-ink-soft">
                  {t("checkout.quantityValue", { count: line.quantity })}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </CheckoutFocusSection>
  );
};

export default memo(CheckoutItems);
