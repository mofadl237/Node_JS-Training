import type { NextRequest } from "next/server";
import { resolveAdminProxyTarget } from "@/lib/server/adminAllowlist";
import { adminFetch } from "@/lib/server/adminFetch";
import { adminErrorResponse, adminSuccessResponse } from "@/lib/server/adminResponse";
import { clearAdminSession } from "@/lib/server/adminSession";
import { adminEmployeeSchema } from "@/validation/adminLogin";
import {
  adminPaginationMetaSchema,
  adminProductListSchema,
} from "@/validation/adminProduct";

interface IContext {
  params: Promise<{ path: string[] }>;
}

export const GET = async (request: NextRequest, context: IContext): Promise<Response> => {
  const { path } = await context.params;
  const target = resolveAdminProxyTarget("GET", path, request.nextUrl.searchParams);
  if (!target) return adminErrorResponse(404, "ROUTE_NOT_ALLOWED");

  const result = target.path.startsWith("/products")
    ? await adminFetch(target.path, adminProductListSchema, adminPaginationMetaSchema)
    : await adminFetch(target.path, adminEmployeeSchema);

  if (!result.ok) {
    if (result.unauthenticated || result.status === 401) await clearAdminSession();
    return adminErrorResponse(result.status, result.code);
  }

  return adminSuccessResponse(result.data, result.meta);
};
