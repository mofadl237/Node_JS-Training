"use client";

import { useEffect } from "react";
import { isStaleCartError } from "@/lib/cartError";
import { clearCartToken } from "@/lib/cartToken";

export const useStaleCartRecovery = (error: unknown, token: string | undefined): void => {
  useEffect(() => {
    if (token && isStaleCartError(error)) clearCartToken();
  }, [error, token]);
};
