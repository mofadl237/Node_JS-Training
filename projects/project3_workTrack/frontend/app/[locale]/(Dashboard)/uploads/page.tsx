import { MANAGEMENT_ROLES } from "@/src/components/layout/navigation";
import { ModulePage } from "@/src/components/shared/ModulePage/ModulePage";

interface IUploadsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function UploadsPage({ params }: IUploadsPageProps) {
  const { locale } = await params;

  return (
    <ModulePage
      locale={locale}
      moduleKey="uploads"
      roles={MANAGEMENT_ROLES}
    />
  );
}
