"use client";

import { useSyncExternalStore } from "react";
import { getServerCartToken, readCartToken, subscribeCartToken } from "@/lib/cartToken";

const CART_TOKEN_PATTERN = /^[A-Za-z0-9_-]{20,64}$/;

export const useCartToken = (): string | undefined => {
  const token = useSyncExternalStore(subscribeCartToken, readCartToken, getServerCartToken);
  return token && CART_TOKEN_PATTERN.test(token) ? token : undefined;
};
