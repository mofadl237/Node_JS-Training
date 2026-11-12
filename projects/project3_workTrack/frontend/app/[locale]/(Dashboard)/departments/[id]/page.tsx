import { Suspense } from "react";
import { connection } from "next/server";
import { setRequestLocale } from "next-intl/server";
import { DepartmentDetailsScreen } from "@/src/components/Departments/DepartmentDetailsScreen";
import { ALL_ROLES } from "@/src/components/layout/navigation";
import { RoleGuard } from "@/src/components/shared/RoleGuard/RoleGuard";

interface IDepartmentDetailsPageProps {
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

export default async function DepartmentDetailsPage({
  params,
}: IDepartmentDetailsPageProps) {
  const { locale, id } = await params;

  setRequestLocale(locale);

  return (
    <>
      <DynamicMarker />
      <RoleGuard roles={ALL_ROLES}>
        <DepartmentDetailsScreen departmentId={id} />
      </RoleGuard>
    </>
  );
}
