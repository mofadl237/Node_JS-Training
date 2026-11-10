"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "@/src/i18n/navigation";
import { PageLoader } from "@/src/components/ui/PageLoader/PageLoader";
import {
  selectIsAuthenticated,
  selectIsHydrated,
} from "@/src/Store/auth-slice";
import { useAppSelector } from "@/src/Store/hooks";

interface IGuestGuardProps {
  children: ReactNode;
}

export function GuestGuard({ children }: IGuestGuardProps) {
  const router = useRouter();
  const isHydrated = useAppSelector(selectIsHydrated);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || isAuthenticated) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
