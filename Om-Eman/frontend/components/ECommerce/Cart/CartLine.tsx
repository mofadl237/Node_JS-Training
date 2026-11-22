"use client";

import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PriceTag } from "@/components/shared/PriceTag";
import { StoreImage } from "@/components/shared/StoreImage";
import { productHref } from "@/lib/routes";
import type { IStoreCartLine } from "@/store/cartApi";
import CartQuantityControl from "./CartQuantityControl";

interface IProps {
  line: IStoreCartLine;
  isBusy: boolean;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

const CartLine = ({ line, isBusy, onQuantityChange, onRemove }: IProps) => {
  const t = useTranslations("cart");
  const locale = useLocale();
  const item = line.package;
  const rawQuantity = Number(line.quantity);
  const hasValidQuantity =
    Number.isInteger(rawQuantity) && rawQuantity >= 1 && rawQuantity <= 1000;
  const quantity = hasValidQuantity ? rawQuantity : 1;

  if (!item) {
    return (
      <li className="flex items-center justify-between gap-3 rounded-md bg-paper p-3">
        <p className="font-semibold text-ink">{t("unavailable")}</p>
        <Button variant="ghost" size="sm" disabled={isBusy} onClick={() => onRemove(line.id)}>
          {t("remove", { name: t("unavailable") })}
        </Button>
      </li>
    );
  }

  const name =
    locale === "ar"
      ? item.nameAr ?? item.productNameAr
      : item.productNameEn ?? item.productNameAr;
  const size = [item.sizeValue, item.sizeUnit].filter(Boolean).join(" ");
  const disabled = isBusy || !item.isAvailable || !hasValidQuantity;

  return (
    <li className="flex gap-3 rounded-md bg-paper p-3">
      <Link
        href={productHref(item.productSlug)}
        aria-label={name}
        className="relative size-20 shrink-0 overflow-hidden rounded-md bg-surface-2"
      >
        <StoreImage src={item.imageUrl} alt={name} sizes="80px" className="object-cover" />
      </Link>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <Link href={productHref(item.productSlug)} className="font-semibold text-ink hover:text-primary">
              {name}
            </Link>
            <p className="text-sm text-ink-soft">{size}</p>
          </div>
          {item.isAvailable ? null : <Badge variant="soldOut">{t("unavailable")}</Badge>}
        </div>
        <PriceTag price={line.priceAtAdd ?? item.sellingPrice} compareAt={item.compareAtPrice} />
        <div className="flex flex-wrap items-center gap-2">
          <CartQuantityControl
            quantity={quantity}
            name={name}
            disabled={disabled}
            onChange={(nextQuantity) => onQuantityChange(line.id, nextQuantity)}
          />
          <Button variant="ghost" size="sm" disabled={isBusy} onClick={() => onRemove(line.id)}>
            {t("remove", { name })}
          </Button>
        </div>
      </div>
    </li>
  );
};

export default memo(CartLine);
