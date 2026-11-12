import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { HrKpiScreen } from "@/src/components/HrKpi/HrKpiScreen";
import { MANAGEMENT_ROLES } from "@/src/components/layout/navigation";
import { RoleGuard } from "@/src/components/shared/RoleGuard/RoleGuard";
import { isAppLocale } from "@/src/i18n/config";
import { messagesByLocale } from "@/src/i18n/messages";

interface IHrKpiPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: IHrKpiPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) return {};

  return {
    title: messagesByLocale[locale].HrKpi.metadata.title,
  };
}

export default async function HrKpiPage({ params }: IHrKpiPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <RoleGuard roles={MANAGEMENT_ROLES}>
      <HrKpiScreen />
    </RoleGuard>
  );
}
