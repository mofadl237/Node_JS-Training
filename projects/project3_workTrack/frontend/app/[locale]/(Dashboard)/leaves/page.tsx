import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LeavesScreen } from "@/src/components/Leaves/LeavesScreen";
import { ALL_ROLES } from "@/src/components/layout/navigation";
import { RoleGuard } from "@/src/components/shared/RoleGuard/RoleGuard";
import { isAppLocale } from "@/src/i18n/config";
import { messagesByLocale } from "@/src/i18n/messages";

interface ILeavesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ILeavesPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) return {};

  return {
    title: messagesByLocale[locale].Leaves.metadata.title,
  };
}

export default async function LeavesPage({ params }: ILeavesPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <RoleGuard roles={ALL_ROLES}>
      <LeavesScreen />
    </RoleGuard>
  );
}
