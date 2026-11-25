"use client";

import { useCallback, useRef } from "react";
import { useCartToken } from "@/hooks/useCartToken";
import { clearCartToken } from "@/lib/cartToken";
import { resolveCartMergeErrorKey } from "@/lib/cartError";
import { readCustomerToken } from "@/lib/customerSession";
import { useMergeCartMutation } from "@/store/cartApi";

export type TMergeCartStatus = "skipped" | "merged" | "notActive" | "error";

export interface IMergeCartOutcome {
  status: TMergeCartStatus;
  errorKey: string | null;
}

const CONSUMED_GUEST_TOKENS = new Set<string>();

export const useCartMerge = () => {
  const guestToken = useCartToken();
  const [mergeRequest, { isLoading }] = useMergeCartMutation();
  const inFlight = useRef(false);

  const merge = useCallback(async (): Promise<IMergeCartOutcome> => {
    if (inFlight.current) return { status: "skipped", errorKey: null };

    const customerToken = readCustomerToken();
    if (!guestToken || !customerToken || CONSUMED_GUEST_TOKENS.has(guestToken)) {
      return { status: "skipped", errorKey: null };
    }

    inFlight.current = true;
    try {
      const result = await mergeRequest({ guestToken }).unwrap();
      CONSUMED_GUEST_TOKENS.add(guestToken);
      clearCartToken();
      return result.mergedCartId
        ? { status: "merged", errorKey: null }
        : { status: "notActive", errorKey: null };
    } catch (error) {
      return { status: "error", errorKey: resolveCartMergeErrorKey(error) };
    } finally {
      inFlight.current = false;
    }
  }, [guestToken, mergeRequest]);

  return { merge, isMerging: isLoading };
};
