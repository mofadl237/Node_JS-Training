"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "@/i18n/navigation";
import { SEARCH_PATH, searchHref } from "@/lib/routes";
import { searchTextSchema } from "@/validation";

export const SearchForm = () => {
  const [value, setValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("search");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = searchTextSchema.safeParse(value);
    if (!parsed.success) {
      setHasError(true);
      return;
    }
    setHasError(false);
    router.push(searchHref(parsed.data));
  };

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    if (hasError) setHasError(false);
  };

  return (
    <form
      role="search"
      method="get"
      action={`/${locale}${SEARCH_PATH}`}
      aria-label={t("label")}
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="flex items-center gap-2">
        <label htmlFor="store-search-input" className="sr-only">
          {t("label")}
        </label>
        <Input
          id="store-search-input"
          name="q"
          type="search"
          value={value}
          placeholder={t("placeholder")}
          maxLength={200}
          enterKeyHint="search"
          hasError={hasError}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? "store-search-error" : undefined}
          onChange={(event) => handleChange(event.target.value)}
          className="h-10 min-w-0 flex-1"
        />
        <Button type="submit" size="sm" aria-label={t("submit")} className="h-10 shrink-0 px-3">
          <Search aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">{t("submit")}</span>
        </Button>
      </div>
      {hasError ? (
        <p id="store-search-error" role="alert" className="mt-1 text-xs text-danger">
          {t("invalidBody")}
        </p>
      ) : null}
    </form>
  );
};
