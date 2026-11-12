import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { UploadsScreen } from "@/src/components/Uploads/UploadsScreen";
import { MANAGEMENT_ROLES } from "@/src/components/layout/navigation";
import { RoleGuard } from "@/src/components/shared/RoleGuard/RoleGuard";
import { isAppLocale } from "@/src/i18n/config";
import { messagesByLocale } from "@/src/i18n/messages";

interface IUploadsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: IUploadsPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) return {};

  return {
    title: messagesByLocale[locale].Uploads.metadata.title,
  };
}

export default async function UploadsPage({ params }: IUploadsPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <RoleGuard roles={MANAGEMENT_ROLES}>
      <UploadsScreen />
    </RoleGuard>
  );
}
