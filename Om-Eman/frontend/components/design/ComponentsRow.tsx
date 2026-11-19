"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PriceTag } from "@/components/shared/PriceTag";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ProductCardRow } from "./ProductCardRow";

interface IProps {
  className?: string;
}

// Shared-components row (D2): labeled demo fixtures/cards, badges, prices,
// empty/error states, and WhatsApp button. Demo data is isolated to design.
export const ComponentsRow = ({ className }: IProps) => {
  const t = useTranslations("design");
  const tErrors = useTranslations("errors");

  return (
    <section className={className}>
      <SectionHeading title={t("componentsTitle")} subtitle={t("componentsSubtitle")} />
      <div className="mt-6 space-y-6">
        <ProductCardRow />
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="primary">{t("badgeNew")}</Badge>
          <Badge variant="accent">{t("badgeSale")}</Badge>
          <Badge variant="bundle">{t("badgeBundle")}</Badge>
          <Badge variant="soldOut">{t("badgeSoldOut")}</Badge>
        </div>
        <div className="space-y-1">
          <PriceTag price="45.0000" compareAt="60.0000" />
          <PriceTag price="120.0000" />
          <p className="text-xs text-ink-soft">{t("priceDemoNote")}</p>
        </div>
        <Button variant="whatsapp">{t("trustWhatsapp")}</Button>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-surface p-2 shadow-rest">
            <EmptyState title={t("emptyTitle")} body={t("emptyBody")} />
          </div>
          <div className="rounded-lg bg-surface p-2 shadow-rest">
            <ErrorState title={t("errorTitle")} body={t("errorBody")} action={<Button variant="soft">{tErrors("retry")}</Button>} />
          </div>
        </div>
      </div>
    </section>
  );
};
