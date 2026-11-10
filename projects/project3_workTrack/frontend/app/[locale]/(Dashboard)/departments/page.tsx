import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { DepartmentsScreen } from "@/src/components/Departments/DepartmentsScreen";
import { ALL_ROLES } from "@/src/components/layout/navigation";
import { RoleGuard } from "@/src/components/shared/RoleGuard/RoleGuard";
import { isAppLocale } from "@/src/i18n/config";
import { messagesByLocale } from "@/src/i18n/messages";

interface IDepartmentsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: IDepartmentsPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) return {};

  return {
    title: messagesByLocale[locale].Departments.metadata.title,
  };
}

export default async function DepartmentsPage({
  params,
}: IDepartmentsPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <RoleGuard roles={ALL_ROLES}>
      <DepartmentsScreen />
    </RoleGuard>
  );
}
