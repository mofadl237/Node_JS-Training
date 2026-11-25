"use client";

import { memo, useState } from "react";
import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TRACK_FOCUS_RING_CLASS } from "@/components/ECommerce/Track/trackStyles";
import { cn } from "@/lib/utils";

interface IProps {
  onLookup: (value: string) => boolean;
  onUseReceipt: () => void;
  hasReceipt: boolean;
  isUsingReceipt: boolean;
  isLoading: boolean;
  showValidation: boolean;
}

const TrackLookupForm = ({
  onLookup,
  onUseReceipt,
  hasReceipt,
  isUsingReceipt,
  isLoading,
  showValidation,
}: IProps) => {
  const t = useTranslations("track");
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const accepted = onLookup(value);
    if (accepted) setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <label htmlFor="tracking-token" className="block text-sm font-semibold text-ink">
        {t("lookup.label")}
      </label>
      <div
        className={cn(
          TRACK_FOCUS_RING_CLASS,
          "flex flex-col gap-3 p-1 sm:flex-row",
        )}
      >
        <Input
          id="tracking-token"
          name="trackingToken"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={t("lookup.placeholder")}
          disabled={isLoading}
          autoComplete="off"
          spellCheck={false}
          hasError={showValidation}
          aria-invalid={showValidation || undefined}
          aria-describedby={showValidation ? "tracking-token-error" : undefined}
          className="min-w-0"
        />
        <Button type="submit" isLoading={isLoading} className="w-full sm:w-36">
          {t("lookup.submit")}
        </Button>
        {hasReceipt && !isUsingReceipt ? (
          <Button type="button" variant="soft" onClick={onUseReceipt} className="w-full sm:w-auto">
            {t("lookup.fromReceipt")}
          </Button>
        ) : null}
      </div>
      {showValidation ? (
        <p id="tracking-token-error" role="alert" className="animate-fade-up text-sm text-danger">
          {t("lookup.invalid")}
        </p>
      ) : null}
    </form>
  );
};

export default memo(TrackLookupForm);
