"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useLocale } from "next-intl";
import { getLocaleDirection, isLocale } from "@/lib/locale";
import { routing } from "@/i18n/routing";

interface IProps {
  position?: "top-center" | "bottom-center";
}

export const Toaster = ({ position = "bottom-center" }: IProps) => {
  const locale = useLocale();
  const dir = getLocaleDirection(isLocale(locale) ? locale : routing.defaultLocale);

  return (
    <SonnerToaster
      position={position}
      dir={dir}
      className="font-body"
      toastOptions={{
        classNames: {
          toast: "bg-surface text-ink border border-ink/15 rounded-md shadow-floating",
          title: "text-ink",
          description: "text-ink-soft",
          actionButton: "bg-primary text-on-primary",
          cancelButton: "bg-surface-2 text-ink",
          success: "border-success/40",
          error: "border-danger/40",
        },
      }}
    />
  );
};
