import { Suspense } from "react";
import { connection } from "next/server";
import { setRequestLocale } from "next-intl/server";
import { EmployeeDetailsScreen } from "@/src/components/Employees/EmployeeDetailsScreen";
import { ALL_ROLES } from "@/src/components/layout/navigation";
import { RoleGuard } from "@/src/components/shared/RoleGuard/RoleGuard";

interface IEmployeeDetailsPageProps {
  params: Promise<{ locale: string; id: string }>;
}

async function ConnectionMarker() {
  await connection();
  return null;
}

async function DynamicMarker() {
  return (
    <Suspense>
      <ConnectionMarker />
    </Suspense>
  );
}

export default async function EmployeeDetailsPage({
  params,
}: IEmployeeDetailsPageProps) {
  const { locale, id } = await params;

  setRequestLocale(locale);

  return (
    <>
      <DynamicMarker />
      <RoleGuard roles={ALL_ROLES}>
        <EmployeeDetailsScreen employeeId={id} />
      </RoleGuard>
    </>
  );
}
