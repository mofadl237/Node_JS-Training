import { ModulePage } from "@/src/components/shared/ModulePage/ModulePage";

interface IDashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({
  params,
}: IDashboardPageProps) {
  const { locale } = await params;

  return <ModulePage locale={locale} moduleKey="dashboard" />;
}
