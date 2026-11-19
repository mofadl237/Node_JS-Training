type TInternalLink = { kind: "internal"; href: string };
type TExternalLink = { kind: "external"; href: string };

export const toSafeExternalUrl = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 2048) return null;
  if (!/^https?:\/\//i.test(trimmed)) return null;
  return trimmed;
};

export const resolveBannerLink = (
  linkUrl: string | null | undefined,
): TInternalLink | TExternalLink | null => {
  if (linkUrl === null || linkUrl === undefined) return null;
  const trimmed = linkUrl.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.startsWith("//")) return null;
  if (/^(javascript|data):/i.test(trimmed)) return null;

  const external = toSafeExternalUrl(trimmed);
  if (external) return { kind: "external", href: external };

  if (!trimmed.startsWith("/")) return null;

  const localized = trimmed.match(/^\/(ar|en)(?=\/|$|\?|#)(.*)$/);
  if (localized) {
    const rest = localized[2] || "/";
    const href = rest === "/" ? "/" : rest.startsWith("/") ? rest : `/${rest}`;
    return { kind: "internal", href };
  }

  return { kind: "internal", href: trimmed };
};
