import { MANAGEMENT_ROLES } from "@/src/components/layout/navigation";
import { ModulePage } from "@/src/components/shared/ModulePage/ModulePage";

interface IAuditLogsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AuditLogsPage({
  params,
}: IAuditLogsPageProps) {
  const { locale } = await params;

  return (
    <ModulePage
      locale={locale}
      moduleKey="auditLogs"
      roles={MANAGEMENT_ROLES}
    />
  );
}
