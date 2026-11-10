import { MANAGEMENT_ROLES } from "@/src/components/layout/navigation";
import { ModulePage } from "@/src/components/shared/ModulePage/ModulePage";

interface IShiftsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ShiftsPage({ params }: IShiftsPageProps) {
  const { locale } = await params;

  return (
    <ModulePage
      locale={locale}
      moduleKey="shifts"
      roles={MANAGEMENT_ROLES}
    />
  );
}
