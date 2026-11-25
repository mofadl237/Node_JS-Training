import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { OmEmanJarIcon } from "@/components/Brand/OmEmanJarIcon";
import { cn } from "@/lib/utils";

interface IProps {
  className?: string;
}

export const HeaderBrand = async ({ className }: IProps) => {
  const [tBrand, tHeader] = await Promise.all([
    getTranslations("brand"),
    getTranslations("header"),
  ]);

  return (
    <Link
      href="/"
      className={cn(
        "group flex min-w-0 animate-fade-up items-center gap-2.5 rounded-lg text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
        className,
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface/80 shadow-rest ring-1 ring-ink/10 transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:shadow-hover">
        <OmEmanJarIcon size={32} decorative animated className="h-8 w-auto text-primary" />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-display text-lg font-bold tracking-tight sm:text-xl">
          {tBrand("name")}
        </span>
        <span className="hidden truncate text-[10px] font-medium uppercase tracking-[0.18em] text-ink-soft lg:block">
          {tHeader("brandTagline")}
        </span>
      </span>
    </Link>
  );
};
