"use client";

import { useEffect } from "react";
import { tokenStorage } from "@/src/lib/auth/token-storage";
import { hydrate } from "./auth-slice";
import { useAppDispatch } from "./hooks";

export function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const syncSession = () => {
      dispatch(hydrate(tokenStorage.read()));
    };

    syncSession();
    window.addEventListener("storage", syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
    };
  }, [dispatch]);

  return null;
}
