import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  navigationIcons,
  type TNavigationKey,
} from "@/src/components/layout/navigation";
import type { TRole } from "@/src/lib/api/types";
import { ModulePlaceholder } from "../ModulePlaceholder/ModulePlaceholder";
import { RoleGuard } from "../RoleGuard/RoleGuard";

interface IModulePageProps {
  locale: string;
  moduleKey: TNavigationKey;
  roles?: readonly TRole[];
}

export async function ModulePage({
  locale,
  moduleKey,
  roles,
}: IModulePageProps) {
  setRequestLocale(locale);

  const t = await getTranslations("Shell");
  const Icon = navigationIcons[moduleKey];
  const content = (
    <ModulePlaceholder
      eyebrow={t("moduleEyebrow")}
      title={t(`nav.${moduleKey}`)}
      description={t(`moduleDescriptions.${moduleKey}`)}
      notice={t("moduleNotice")}
      icon={<Icon size={22} strokeWidth={2} />}
    />
  );

  if (!roles) return content;

  return <RoleGuard roles={roles}>{content}</RoleGuard>;
}
