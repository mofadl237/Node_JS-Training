export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is missing — add it to .env.local");
}

if (!SITE_URL) {
  throw new Error("NEXT_PUBLIC_SITE_URL is missing — add it to .env.local");
}
