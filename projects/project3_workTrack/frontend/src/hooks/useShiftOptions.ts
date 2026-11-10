"use client";

import { useGetShiftsQuery } from "@/src/lib/api/shifts-api";

const SHIFT_OPTIONS_LIMIT = 100;

export const useShiftOptions = () => {
  const query = useGetShiftsQuery({
    page: 1,
    limit: SHIFT_OPTIONS_LIMIT,
    sortBy: "name",
    sortOrder: "asc",
  });

  return {
    shifts: query.data?.items ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
