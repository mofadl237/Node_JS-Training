import { ModulePage } from "@/src/components/shared/ModulePage/ModulePage";

interface ILeavesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LeavesPage({ params }: ILeavesPageProps) {
  const { locale } = await params;

  return <ModulePage locale={locale} moduleKey="leaves" />;
}
