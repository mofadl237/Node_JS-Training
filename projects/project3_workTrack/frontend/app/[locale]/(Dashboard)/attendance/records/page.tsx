import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AttendanceRecordsScreen } from "@/src/components/AttendanceRecords/AttendanceRecordsScreen";
import { ALL_ROLES } from "@/src/components/layout/navigation";
import { RoleGuard } from "@/src/components/shared/RoleGuard/RoleGuard";
import { isAppLocale } from "@/src/i18n/config";
import { messagesByLocale } from "@/src/i18n/messages";

interface IAttendanceRecordsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: IAttendanceRecordsPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) return {};

  return {
    title: messagesByLocale[locale].AttendanceRecords.metadata.title,
  };
}

export default async function AttendanceRecordsPage({
  params,
}: IAttendanceRecordsPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <RoleGuard roles={ALL_ROLES}>
      <AttendanceRecordsScreen />
    </RoleGuard>
  );
}
