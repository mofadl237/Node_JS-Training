import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { AuthGuard } from "@/src/components/auth/guards/AuthGuard";
import { AppShell } from "@/src/components/layout/AppShell/AppShell";

interface IDashboardLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: IDashboardLayoutProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
