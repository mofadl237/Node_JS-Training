import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { OmEmanJarIcon } from "@/components/Brand/OmEmanJarIcon";

export const HeaderBrand = async () => {
  // 1- state
  const t = await getTranslations("brand");

  // 3- render
  return (
    <Link href="/" className="flex min-w-0 items-center gap-2 text-ink">
      <OmEmanJarIcon
        size={40}
        decorative
        className="h-9 w-auto shrink-0 text-primary sm:h-10"
      />
      <span className="truncate font-display text-lg font-bold tracking-tight sm:text-xl">{t("name")}</span>
    </Link>
  );
};
