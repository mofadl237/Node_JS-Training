"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useFlyToCart } from "@/hooks/useFlyToCart";
import { bounceCartTarget } from "@/lib/cartFeedback";
import { readCartToken, writeCartToken } from "@/lib/cartToken";
import { useAddCartItemMutation, useLazyGetOrCreateCartQuery } from "@/store/cartApi";

interface IOptions {
  productPackageId: string | null;
  sourceRef: RefObject<HTMLElement | null>;
  canAdd: boolean;
}

interface IResult {
  addToCart: () => Promise<void>;
  isAdding: boolean;
  isAdded: boolean;
  hasError: boolean;
}

const ADDED_FEEDBACK_MS = 1800;

export const useAddToCart = ({ productPackageId, sourceRef, canAdd }: IOptions): IResult => {
  const t = useTranslations("product");
  const flyToCart = useFlyToCart();
  const [getOrCreateCart] = useLazyGetOrCreateCartQuery();
  const [addCartItem] = useAddCartItemMutation();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inFlight = useRef(false);
  const addedTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (addedTimer.current !== null) window.clearTimeout(addedTimer.current);
    },
    [],
  );

  const addToCart = useCallback(async () => {
    if (!canAdd || !productPackageId || inFlight.current) return;
    inFlight.current = true;
    setIsAdding(true);
    setHasError(false);

    try {
      const token = readCartToken();
      const cart = await getOrCreateCart(token).unwrap();
      if (cart.guestToken) writeCartToken(cart.guestToken);
      await addCartItem({
        guestToken: cart.guestToken,
        productPackageId,
        quantity: 1,
      }).unwrap();

      setIsAdded(true);
      if (addedTimer.current !== null) window.clearTimeout(addedTimer.current);
      addedTimer.current = window.setTimeout(() => setIsAdded(false), ADDED_FEEDBACK_MS);

      const source = sourceRef.current;
      if (source) flyToCart({ source, onArrive: bounceCartTarget });
      else bounceCartTarget();
      toast.success(t("addedToCart"));
    } catch {
      setHasError(true);
      toast.error(t("addToCartError"));
    } finally {
      inFlight.current = false;
      setIsAdding(false);
    }
  }, [addCartItem, canAdd, flyToCart, getOrCreateCart, productPackageId, sourceRef, t]);

  return { addToCart, isAdding, isAdded, hasError };
};
