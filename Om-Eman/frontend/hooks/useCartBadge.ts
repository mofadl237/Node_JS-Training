"use client";

import { useGetCartByTokenQuery } from "@/store/cartApi";
import { useCartToken } from "./useCartToken";

interface IUseCartBadgeResult {
  itemsCount: number;
  isEmpty: boolean;
  isReady: boolean;
  hasError: boolean;
}

export const useCartBadge = (): IUseCartBadgeResult => {
  const token = useCartToken();
  const { data, isError } = useGetCartByTokenQuery(token ?? "", {
    skip: token === undefined,
  });
  const itemsCount = data?.itemsCount ?? 0;

  return {
    itemsCount,
    isEmpty: data?.itemsCount === 0,
    isReady: data !== undefined,
    hasError: isError,
  };
};
