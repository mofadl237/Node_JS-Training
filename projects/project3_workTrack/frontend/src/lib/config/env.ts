const fallbackApiUrl = "http://localhost:3000";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? fallbackApiUrl
).replace(/\/$/, "");
