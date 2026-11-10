"use client";

import { useEffect, type ReactNode } from "react";
import { PageLoader } from "@/src/components/ui/PageLoader/PageLoader";
import { useRouter } from "@/src/i18n/navigation";
import type { TRole } from "@/src/lib/api/types";
import { selectCurrentUser } from "@/src/Store/auth-slice";
import { useAppSelector } from "@/src/Store/hooks";

interface IRoleGuardProps {
  roles: readonly TRole[];
  children: ReactNode;
}

export function RoleGuard({ roles, children }: IRoleGuardProps) {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const isAllowed = user ? roles.includes(user.role) : false;

  useEffect(() => {
    if (user && !isAllowed) {
      router.replace("/dashboard");
    }
  }, [isAllowed, router, user]);

  if (!user || !isAllowed) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
