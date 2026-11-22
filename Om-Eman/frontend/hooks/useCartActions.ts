"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { resolveCartErrorKey } from "@/lib/cartError";
import { useRemoveCartItemMutation, useUpdateCartItemMutation } from "@/store/cartApi";

interface IResult {
  isMutating: boolean;
  errorKey: string | null;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}

export const useCartActions = (token: string | undefined): IResult => {
  const t = useTranslations("cart");
  const [updateCartItem, updateState] = useUpdateCartItemMutation();
  const [removeCartItem, removeState] = useRemoveCartItemMutation();
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const isMutating = updateState.isLoading || removeState.isLoading;

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!token || isMutating || !Number.isInteger(quantity) || quantity < 1 || quantity > 1000) return;
      setErrorKey(null);
      try {
        await updateCartItem({ guestToken: token, itemId, quantity }).unwrap();
        toast.success(t("updateSuccess"));
      } catch (error: unknown) {
        const key = resolveCartErrorKey(error, "updateFailed");
        setErrorKey(key);
        toast.error(t(key));
      }
    },
    [isMutating, t, token, updateCartItem],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!token || isMutating) return;
      setErrorKey(null);
      try {
        await removeCartItem({ guestToken: token, itemId }).unwrap();
        toast.success(t("removeSuccess"));
      } catch (error: unknown) {
        const key = resolveCartErrorKey(error, "removeFailed");
        setErrorKey(key);
        toast.error(t(key));
      }
    },
    [isMutating, removeCartItem, t, token],
  );

  return { isMutating, errorKey, updateQuantity, removeItem };
};
