import "server-only";
import { cookies } from "next/headers";
import { adminTokenSchema } from "@/validation/adminLogin";

export const ADMIN_SESSION_COOKIE = "oe.admin.session";
export const ADMIN_SESSION_MAX_AGE = 7 * 24 * 60 * 60;

export const readAdminSessionToken = async (): Promise<string | null> => {
  const value = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!value) return null;

  const parsed = adminTokenSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
};

export const writeAdminSession = async (token: string): Promise<void> => {
  const parsed = adminTokenSchema.safeParse(token);
  if (!parsed.success) throw new Error("ADMIN_TOKEN_INVALID");

  (await cookies()).set(ADMIN_SESSION_COOKIE, parsed.data, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
};

export const clearAdminSession = async (): Promise<void> => {
  (await cookies()).delete(ADMIN_SESSION_COOKIE);
};
