import { JsonLd } from "@/components/shared/JsonLd";
import { Link } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/config";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";

interface IBreadcrumbItem {
  name: string;
  path: string;
}

interface IProps {
  locale: string;
  ariaLabel: string;
  items: IBreadcrumbItem[];
}

export const StoreBreadcrumb = ({ locale, ariaLabel, items }: IProps) => (
  <div className="space-y-3">
    <JsonLd data={buildBreadcrumbJsonLd({ siteUrl: SITE_URL, locale, items })} />
    <nav aria-label={ariaLabel} className="text-sm text-ink-soft">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.path}-${item.name}`} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="text-ink">{item.name}</span>
              ) : (
                <Link
                  href={item.path || "/"}
                  className="rounded-sm transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {item.name}
                </Link>
              )}
              {isLast ? null : <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  </div>
);
