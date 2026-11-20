"use client";

import { useTranslations } from "next-intl";
import type { TStoreSizeUnit } from "@/interface";

interface IProps {
  sizeValue: string;
  sizeUnit: TStoreSizeUnit;
}

export const PackageSize = ({ sizeValue, sizeUnit }: IProps) => {
  const t = useTranslations("productDetail");

  return (
    <p className="text-sm text-ink-soft">
      {t("size", { value: sizeValue, unit: t(`unit.${sizeUnit}`) })}
    </p>
  );
};
