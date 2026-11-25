export const accountDescribedBy = (
  ...ids: Array<string | false | null | undefined>
): string | undefined => {
  const value = ids.filter((id): id is string => Boolean(id)).join(" ");
  return value || undefined;
};
