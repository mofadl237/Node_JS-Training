import "server-only";
import { getLocale } from "next-intl/server";
import type { IEmployee } from "@/interface";
import { redirect } from "@/i18n/navigation";
import { adminEmployeeSchema } from "@/validation/adminLogin";
import { adminFetch } from "./adminFetch";

export const requireEmployee = async (): Promise<IEmployee> => {
  const result = await adminFetch("/auth/me", adminEmployeeSchema);
  if (result.ok) return result.data;

  const locale = await getLocale();
  redirect({ href: "/dashboard/login", locale });
  throw new Error("DASHBOARD_REDIRECT_FAILED");
};
