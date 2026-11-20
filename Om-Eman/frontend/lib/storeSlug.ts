export const isStoreProductSlug = (value: string): boolean =>
  value.length > 0 && value.length <= 200 && /^[a-z0-9-]+$/.test(value);
