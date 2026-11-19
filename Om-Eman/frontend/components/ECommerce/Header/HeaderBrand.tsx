import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BRAND_ASSETS } from "@/lib/brandAssets";

export const HeaderBrand = async () => {
  // 1- state
  const t = await getTranslations("brand");

  // 3- render
  return (
    <Link href="/" className="flex min-w-0 items-center gap-2 text-ink">
      <img
        src={BRAND_ASSETS.jarMark}
        alt=""
        aria-hidden="true"
        width={32}
        height={32}
        className="size-8 shrink-0 object-contain"
        decoding="async"
        loading="eager"
      />
      <span className="truncate font-display text-lg font-bold tracking-tight sm:text-xl">{t("name")}</span>
    </Link>
  );
};
