import { adminErrorResponse, adminSuccessResponse } from "@/lib/server/adminResponse";
import { adminFetch, adminLoginRequest } from "@/lib/server/adminFetch";
import { clearAdminSession, writeAdminSession } from "@/lib/server/adminSession";
import { adminEmployeeSchema, adminLoginSchema } from "@/validation/adminLogin";

export const POST = async (request: Request): Promise<Response> => {
  const body: unknown = await request.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) return adminErrorResponse(400, "VALIDATION_ERROR");

  const result = await adminLoginRequest(parsed.data);
  if (!result.ok) return adminErrorResponse(result.status, result.code);

  await writeAdminSession(result.data.token);
  return adminSuccessResponse({ employee: result.data.employee });
};

export const GET = async (): Promise<Response> => {
  const result = await adminFetch("/auth/me", adminEmployeeSchema);
  if (!result.ok) {
    if (result.unauthenticated || result.status === 401) await clearAdminSession();
    return adminErrorResponse(result.status, result.code);
  }
  return adminSuccessResponse(result.data);
};

export const DELETE = async (): Promise<Response> => {
  await clearAdminSession();
  return adminSuccessResponse(null);
};
