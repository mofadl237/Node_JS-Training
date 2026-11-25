import HeaderActions from "./HeaderActions";
import HeaderNavLinks from "./HeaderNavLinks";
import { HeaderBrand } from "./HeaderBrand";
import { SearchForm } from "./SearchForm";
import { headerShellClass } from "./headerStyles";

export const StoreHeader = () => (
  <header className={headerShellClass}>
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
    />
    <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-4 py-2 sm:flex sm:h-[4.5rem] sm:gap-6 sm:py-0">
      <HeaderBrand className="col-start-1 row-start-1 min-w-0 sm:order-1" />
      <HeaderNavLinks className="hidden sm:order-2 sm:flex" />
      <div className="col-span-2 row-start-2 min-w-0 sm:order-3 sm:flex-1">
        <SearchForm />
      </div>
      <HeaderActions className="col-start-2 row-start-1 sm:order-4" />
    </div>
  </header>
);
