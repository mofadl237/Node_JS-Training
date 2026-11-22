import { Suspense } from "react";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { CartLink } from "./CartLink";
import { HeaderBrand } from "./HeaderBrand";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { SearchForm } from "./SearchForm";

export const StoreHeader = () => (
  <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur">
    <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-2 px-4 py-2 sm:h-16 sm:flex-nowrap sm:py-0">
      <HeaderBrand />
      <div className="order-2 w-full min-w-0 sm:order-none sm:mx-auto sm:w-full sm:max-w-lg">
        <SearchForm />
      </div>
      <div className="order-1 ms-auto flex items-center gap-2 sm:order-none sm:ms-0">
        <Suspense fallback={<div className="h-10 w-16 rounded-sm bg-surface" aria-hidden="true" />}>
          <LocaleSwitcher />
        </Suspense>
        <ThemeSwitcher />
        <CartLink />
      </div>
    </div>
  </header>
);
