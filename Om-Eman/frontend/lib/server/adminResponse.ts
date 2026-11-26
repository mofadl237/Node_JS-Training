import { NextResponse } from "next/server";
import type { IPaginationMeta } from "@/interface";

export const normalizeAdminStatus = (status: number): number => {
  if (status >= 400 && status <= 599) return status;
  return status === 0 ? 503 : 500;
};

export const adminErrorResponse = (status: number, code: string): NextResponse =>
  NextResponse.json(
    { success: false, message: "", code },
    { status: normalizeAdminStatus(status) },
  );

export const adminSuccessResponse = <T>(
  data: T,
  meta?: IPaginationMeta,
): NextResponse =>
  NextResponse.json({
    success: true,
    message: "",
    data,
    ...(meta ? { meta } : {}),
  });
