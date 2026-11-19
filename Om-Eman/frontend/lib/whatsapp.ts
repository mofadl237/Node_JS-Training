export const normalizeWhatsAppNumber = (raw: string | null | undefined): string | null => {
  if (raw === null || raw === undefined) return null;
  const stripped = raw.replace(/[\s\-()]/g, "").replace(/^(?:\+|00)/, "");
  if (stripped.length === 0) return null;

  if (/^[1-9]\d{7,14}$/.test(stripped)) return stripped;

  // M-8 (manager modification): normalize valid Egyptian local numbers to E.164 (+20)
  // when country is known; do not hide valid local Egyptian numbers for lacking prefix.
  if (/^01[0125]\d{8}$/.test(stripped)) {
    const normalized = `20${stripped.slice(1)}`;
    if (/^[1-9]\d{7,14}$/.test(normalized)) return normalized;
  }

  return null;
};

export const buildWhatsAppUrl = (number: string, text?: string): string => {
  const base = `https://wa.me/${number}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
};
