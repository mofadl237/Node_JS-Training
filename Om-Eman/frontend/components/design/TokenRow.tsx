import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

interface ITokenSwatch {
  name: string;
  className: string;
}

const TOKENS: readonly ITokenSwatch[] = [
  { name: "paper", className: "bg-paper border border-ink/10" },
  { name: "surface", className: "bg-surface border border-ink/10" },
  { name: "surface-2", className: "bg-surface-2 border border-ink/10" },
  { name: "ink", className: "bg-ink" },
  { name: "ink-soft", className: "bg-ink-soft" },
  { name: "primary", className: "bg-primary" },
  { name: "on-primary", className: "bg-on-primary border border-ink/10" },
  { name: "accent", className: "bg-accent" },
  { name: "glow", className: "bg-glow" },
  { name: "success", className: "bg-success" },
  { name: "danger", className: "bg-danger" },
  { name: "card-1", className: "bg-card-1 border border-ink/10" },
  { name: "card-2", className: "bg-card-2 border border-ink/10" },
  { name: "card-3", className: "bg-card-3 border border-ink/10" },
  { name: "card-4", className: "bg-card-4 border border-ink/10" },
];

export const TokenRow = async () => {
  const t = await getTranslations("design");

  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl text-ink">{t("tokens")}</h2>
      <ul className="grid grid-cols-5 gap-4">
        {TOKENS.map((token) => (
          <li key={token.name} className="flex flex-col items-center gap-2">
            <span className={cn("size-12 rounded-full shadow-rest", token.className)} />
            <span className="text-xs text-ink-soft">{token.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
