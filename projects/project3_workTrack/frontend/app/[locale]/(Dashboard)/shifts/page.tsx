import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ShiftsScreen } from "@/src/components/Shifts/ShiftsScreen";
import { MANAGEMENT_ROLES } from "@/src/components/layout/navigation";
import { RoleGuard } from "@/src/components/shared/RoleGuard/RoleGuard";
import { isAppLocale } from "@/src/i18n/config";
import { messagesByLocale } from "@/src/i18n/messages";

interface IShiftsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: IShiftsPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) return {};

  return {
    title: messagesByLocale[locale].Shifts.metadata.title,
  };
}

export default async function ShiftsPage({ params }: IShiftsPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <RoleGuard roles={MANAGEMENT_ROLES}>
      <ShiftsScreen />
    </RoleGuard>
  );
}
