"use client";

import { memo } from "react";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { RollingNumber } from "@/components/Animation/RollingNumber";

interface IProps {
  quantity: number;
  name: string;
  disabled: boolean;
  onChange: (quantity: number) => void;
}

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 1000;

const CartQuantityControl = ({ quantity, name, disabled, onChange }: IProps) => {
  const t = useTranslations("cart");
  const canDecrease = !disabled && quantity > MIN_QUANTITY;
  const canIncrease = !disabled && quantity < MAX_QUANTITY;

  return (
    <div className="inline-flex items-center rounded-md border border-ink/10 bg-paper">
      <button
        type="button"
        disabled={!canDecrease}
        aria-label={t("decrease", { name })}
        onClick={() => onChange(quantity - 1)}
        className="grid size-9 place-items-center text-ink transition-colors duration-150 hover:bg-surface-2 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <Minus aria-hidden="true" className="size-4" />
      </button>
      <output aria-label={t("quantity")} className="grid w-10 place-items-center text-sm font-semibold text-ink">
        <RollingNumber value={quantity} />
      </output>
      <button
        type="button"
        disabled={!canIncrease}
        aria-label={t("increase", { name })}
        onClick={() => onChange(quantity + 1)}
        className="grid size-9 place-items-center text-ink transition-colors duration-150 hover:bg-surface-2 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <Plus aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
};

export default memo(CartQuantityControl);
