import { MANAGEMENT_ROLES } from "@/src/components/layout/navigation";
import { ModulePage } from "@/src/components/shared/ModulePage/ModulePage";

interface IHrKpiPageProps {
  params: Promise<{ locale: string }>;
}

export default async function HrKpiPage({ params }: IHrKpiPageProps) {
  const { locale } = await params;

  return (
    <ModulePage
      locale={locale}
      moduleKey="hrKpi"
      roles={MANAGEMENT_ROLES}
    />
  );
}
