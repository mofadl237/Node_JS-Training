import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { EmployeesScreen } from "@/src/components/Employees/EmployeesScreen";
import { ALL_ROLES } from "@/src/components/layout/navigation";
import { RoleGuard } from "@/src/components/shared/RoleGuard/RoleGuard";
import { isAppLocale } from "@/src/i18n/config";
import { messagesByLocale } from "@/src/i18n/messages";

interface IEmployeesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: IEmployeesPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) return {};

  return {
    title: messagesByLocale[locale].Employees.metadata.title,
  };
}

export default async function EmployeesPage({
  params,
}: IEmployeesPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <RoleGuard roles={ALL_ROLES}>
      <EmployeesScreen />
    </RoleGuard>
  );
}
