export const formatAuditValue = (value: string): string =>
  value
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());

export const formatAuditDetails = (details: unknown): string | null => {
  if (details === null || details === undefined) return null;

  try {
    return JSON.stringify(details, null, 2) ?? null;
  } catch {
    return String(details);
  }
};
