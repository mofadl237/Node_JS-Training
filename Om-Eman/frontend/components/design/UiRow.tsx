"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { FadeIn } from "@/components/Animation/FadeIn";
import { Stagger } from "@/components/Animation/Stagger";
import { StaggerItem } from "@/components/Animation/StaggerItem";
import { CountUp } from "@/components/Animation/CountUp";
import { useTranslations } from "next-intl";

export const UiRow = () => {
  // 1- state
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const t = useTranslations("design");
  const tCommon = useTranslations("common");

  // 2- handlers
  const onToggleLoading = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const onChangeInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, []);

  // 3- render
  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl text-ink">{t("ui")}</h2>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onToggleLoading} isLoading={isLoading}>
          {t("themeDefault")}
        </Button>
        <Button variant="soft">{t("badgeNew")}</Button>
        <Button variant="ghost" size="sm">
          {t("badgeSale")}
        </Button>
        <Badge variant="primary">{t("badgeNew")}</Badge>
        <Badge variant="accent">{t("badgeSale")}</Badge>
      </div>

      <Input
        value={inputValue}
        onChange={onChangeInput}
        placeholder={t("inputPlaceholder")}
        className="max-w-sm"
      />

      <div className="max-w-sm space-y-2 rounded-lg bg-surface p-4 shadow-rest">
        <Skeleton className="h-24 w-full rounded-md" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <FadeIn>
          <p className="text-ink">
            {t("discountNumber", { percent: 25 })} — <CountUp value={120} suffix={` ${tCommon("currencyEgp")}`} />
          </p>
        </FadeIn>
        <Stagger className="flex gap-2">
          {[0, 1, 2].map((index) => (
            <StaggerItem key={index}>
              <span className="grid size-10 place-items-center rounded-sm bg-card-1 text-ink">
                {index + 1}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
};
