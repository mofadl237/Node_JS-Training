import { useTranslations } from "next-intl";
import { toSafeExternalUrl } from "@/lib/links";
import { SOCIAL_ICONS } from "@/components/shared/SocialIcon";
import { SOCIAL_LINKS, type TSocialPlatform } from "@/lib/siteContact";

const PLATFORM_ORDER: TSocialPlatform[] = [
  "instagram",
  "facebook",
  "tiktok",
  "youtube",
  "x",
  "snapchat",
  "pinterest",
  "threads",
  "linkedin",
  "telegram",
];

export const FooterSocial = () => {
  // 1- state
  const t = useTranslations("footer");
  const tA11y = useTranslations("a11y");
  const items = PLATFORM_ORDER.map((key) => ({ key, href: toSafeExternalUrl(SOCIAL_LINKS[key]) })).filter(
    (item): item is { key: TSocialPlatform; href: string } => item.href !== null,
  );

  // 3- render
  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg text-ink">{t("socialTitle")}</h2>
      <ul className="flex flex-wrap gap-3">
        {items.map((item) => {
          const Icon = SOCIAL_ICONS[item.key];
          return (
            <li key={item.key}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t(`social.${item.key}`)} (${tA11y("opensInNewTab")})`}
                className="group inline-flex size-11 items-center justify-center rounded-full border border-ink/10 bg-paper text-ink-soft shadow-rest transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <Icon size={20} />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
