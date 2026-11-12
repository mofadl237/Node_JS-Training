import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { DashboardScreen } from "@/src/components/Dashboard/DashboardScreen";
import { ALL_ROLES } from "@/src/components/layout/navigation";
import { RoleGuard } from "@/src/components/shared/RoleGuard/RoleGuard";
import { isAppLocale } from "@/src/i18n/config";
import { messagesByLocale } from "@/src/i18n/messages";

interface IDashboardPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: IDashboardPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) return {};

  return {
    title: messagesByLocale[locale].Dashboard.metadata.title,
  };
}

export default async function DashboardPage({
  params,
}: IDashboardPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <RoleGuard roles={ALL_ROLES}>
      <DashboardScreen />
    </RoleGuard>
  );
}
