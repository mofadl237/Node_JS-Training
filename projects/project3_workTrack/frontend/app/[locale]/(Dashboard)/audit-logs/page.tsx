import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AuditLogsScreen } from "@/src/components/AuditLogs/AuditLogsScreen";
import { MANAGEMENT_ROLES } from "@/src/components/layout/navigation";
import { RoleGuard } from "@/src/components/shared/RoleGuard/RoleGuard";
import { isAppLocale } from "@/src/i18n/config";
import { messagesByLocale } from "@/src/i18n/messages";

interface IAuditLogsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: IAuditLogsPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) return {};

  return {
    title: messagesByLocale[locale].AuditLogs.metadata.title,
  };
}

export default async function AuditLogsPage({
  params,
}: IAuditLogsPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <RoleGuard roles={MANAGEMENT_ROLES}>
      <AuditLogsScreen />
    </RoleGuard>
  );
}
