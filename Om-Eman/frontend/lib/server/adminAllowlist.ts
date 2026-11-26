import type { IAdminProxyTarget } from "@/interface";
import { adminProductQuerySchema } from "@/validation/adminProduct";

interface IAdminProxyRoute {
  method: "GET";
  segments: readonly string[];
  parseQuery: (params: URLSearchParams) => URLSearchParams | null;
}

const parseEmptyQuery = (params: URLSearchParams): URLSearchParams | null =>
  params.size === 0 ? new URLSearchParams() : null;

const parseProductQuery = (params: URLSearchParams): URLSearchParams | null => {
  const parsed = adminProductQuerySchema.safeParse(Object.fromEntries(params.entries()));
  if (!parsed.success) return null;

  const allowed = new URLSearchParams();
  for (const [key, value] of Object.entries(parsed.data)) {
    if (value !== undefined) allowed.set(key, String(value));
  }
  return allowed;
};

const routes: readonly IAdminProxyRoute[] = [
  { method: "GET", segments: ["auth", "me"], parseQuery: parseEmptyQuery },
  { method: "GET", segments: ["products"], parseQuery: parseProductQuery },
];

const matchesSegments = (segments: string[], expected: readonly string[]): boolean =>
  segments.length === expected.length && segments.every((part, index) => part === expected[index]);

export const resolveAdminProxyTarget = (
  method: string,
  segments: string[],
  params: URLSearchParams,
): IAdminProxyTarget | null => {
  const route = routes.find(
    (candidate) => candidate.method === method && matchesSegments(segments, candidate.segments),
  );
  if (!route) return null;

  const query = route.parseQuery(params);
  if (!query) return null;

  const suffix = query.toString();
  return { path: `/${route.segments.join("/")}${suffix ? `?${suffix}` : ""}` };
};
