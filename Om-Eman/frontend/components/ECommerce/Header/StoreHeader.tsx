import { Suspense } from "react";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { CartLink } from "./CartLink";
import { HeaderBrand } from "./HeaderBrand";
import { LocaleSwitcher } from "./LocaleSwitcher";

export const StoreHeader = () => (
  <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
      <HeaderBrand />
      <div className="flex items-center gap-2">
        <Suspense fallback={<div className="h-10 w-16 rounded-sm bg-surface" aria-hidden="true" />}>
          <LocaleSwitcher />
        </Suspense>
        <ThemeSwitcher />
        <CartLink />
      </div>
    </div>
  </header>
);
