import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AttendanceProcessScreen } from "@/src/components/AttendanceProcess/AttendanceProcessScreen";
import { MANAGEMENT_ROLES } from "@/src/components/layout/navigation";
import { RoleGuard } from "@/src/components/shared/RoleGuard/RoleGuard";
import { isAppLocale } from "@/src/i18n/config";
import { messagesByLocale } from "@/src/i18n/messages";

interface IAttendanceProcessPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: IAttendanceProcessPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) return {};

  return {
    title: messagesByLocale[locale].AttendanceProcess.metadata.title,
  };
}

export default async function AttendanceProcessPage({
  params,
}: IAttendanceProcessPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <RoleGuard roles={MANAGEMENT_ROLES}>
      <AttendanceProcessScreen />
    </RoleGuard>
  );
}
