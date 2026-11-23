"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import type { IStoreCartLine } from "@/store/cartApi";
import {
  checkoutFormSchema,
  checkoutItemSchema,
  type TCheckoutForm,
} from "@/validation/checkout";

interface IProps {
  lines: IStoreCartLine[];
}

export const useCheckoutForm = ({ lines }: IProps) => {
  const { items, hasInvalidItems } = useMemo(() => {
    const parsed = lines.map((line) =>
      checkoutItemSchema.safeParse({
        productPackageId: line.package?.id,
        quantity: Number(line.quantity),
      }),
    );

    return {
      items: parsed.flatMap((result) => (result.success ? [result.data] : [])),
      hasInvalidItems: parsed.some((result) => !result.success),
    };
  }, [lines]);

  const form = useForm<TCheckoutForm>({
    resolver: zodResolver(checkoutFormSchema),
    mode: "onBlur",
    defaultValues: {
      phone: "",
      recipientName: "",
      address: { governorate: "", city: "", street: "" },
      items,
    },
  });

  const governorate =
    useWatch({ control: form.control, name: "address.governorate" }) ?? "";
  const city = useWatch({ control: form.control, name: "address.city" }) ?? "";

  return { form, items, hasInvalidItems, governorate, city };
};
