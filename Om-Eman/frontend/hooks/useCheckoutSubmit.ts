"use client";

import { useCallback, useRef, useState } from "react";
import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ICheckoutResult } from "@/interface";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { cartApi, type IStoreCart } from "@/store/cartApi";
import { isApiError } from "@/lib/cartError";
import { clearCartToken, readCartToken } from "@/lib/cartToken";
import { resolveCheckoutSubmitErrorKey } from "@/lib/checkoutError";
import { cartLinesToCheckoutItems, toCheckoutPayload } from "@/lib/checkoutForm";
import { saveOrderReceipt } from "@/lib/orderReceipt";
import { usePlaceOrderMutation } from "@/store/checkoutApi";
import type { TCheckoutForm } from "@/validation/checkout";

interface IProps {
  form: UseFormReturn<TCheckoutForm>;
  cart: IStoreCart;
  couponCode?: string;
  hasInvalidItems: boolean;
  onSuccess: (result: ICheckoutResult) => void;
}

export const useCheckoutSubmit = ({
  form,
  cart,
  couponCode,
  hasInvalidItems,
  onSuccess,
}: IProps) => {
  const dispatch = useAppDispatch();
  const [placeOrder, { isLoading }] = usePlaceOrderMutation();
  const inFlight = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [errorKey, setErrorKey] = useState<string | undefined>(undefined);
  const [receiptErrorKey, setReceiptErrorKey] = useState<string | undefined>(
    undefined,
  );

  const release = useCallback(() => {
    inFlight.current = false;
    setIsLocked(false);
    setIsPending(false);
  }, []);

  const submit = useCallback(
    (event?: BaseSyntheticEvent) => {
      if (inFlight.current) return;

      inFlight.current = true;
      setIsLocked(true);
      setIsPending(true);
      setErrorKey(undefined);
      setReceiptErrorKey(undefined);

      void form.handleSubmit(
        async (values) => {
          if (hasInvalidItems || cart.lines.length === 0) {
            setErrorKey("checkout.errors.invalidQuantity");
            release();
            return;
          }

          try {
            const items = cartLinesToCheckoutItems(cart.lines);
            const payload = toCheckoutPayload(
              { ...values, couponCode, items },
              readCartToken(),
            );
            const checkoutResult = await placeOrder(payload).unwrap();
            clearCartToken();
            dispatch(cartApi.util.resetApiState());

            try {
              saveOrderReceipt(checkoutResult);
            } catch {
              setReceiptErrorKey("checkout.errors.receiptStorageFailed");
              setIsPending(false);
              return;
            }

            onSuccess(checkoutResult);
          } catch (error) {
            setErrorKey(resolveCheckoutSubmitErrorKey(error));
            if (isApiError(error) && error.status === 0) {
              setIsPending(false);
              return;
            }
            release();
          }
        },
        () => {
          setErrorKey("checkout.errors.validation");
          release();
        },
      )(event);
    },
    [cart, couponCode, dispatch, form, hasInvalidItems, onSuccess, placeOrder, release],
  );

  return {
    submit,
    isSubmitting: isPending || isLoading,
    isLocked,
    errorKey,
    receiptErrorKey,
  };
};
