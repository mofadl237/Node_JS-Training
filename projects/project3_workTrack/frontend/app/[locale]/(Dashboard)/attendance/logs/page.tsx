import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AttendanceLogsScreen } from "@/src/components/AttendanceLogs/AttendanceLogsScreen";
import { ALL_ROLES } from "@/src/components/layout/navigation";
import { RoleGuard } from "@/src/components/shared/RoleGuard/RoleGuard";
import { isAppLocale } from "@/src/i18n/config";
import { messagesByLocale } from "@/src/i18n/messages";

interface IAttendanceLogsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: IAttendanceLogsPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) return {};

  return {
    title: messagesByLocale[locale].AttendanceLogs.metadata.title,
  };
}

export default async function AttendanceLogsPage({
  params,
}: IAttendanceLogsPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <RoleGuard roles={ALL_ROLES}>
      <AttendanceLogsScreen />
    </RoleGuard>
  );
}
