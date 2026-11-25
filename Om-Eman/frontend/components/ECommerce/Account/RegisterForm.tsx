"use client";

import { memo, useCallback, useRef, useState } from "react";
import type { BaseSyntheticEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import AccountFormCard from "@/components/ECommerce/Account/AccountFormCard";
import RegisterFields from "@/components/ECommerce/Account/RegisterFields";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { registerCustomerSchema, type TRegisterCustomerForm } from "@/validation/customerAuth";

const defaultValues: TRegisterCustomerForm = { email: "", password: "" };

const parseToken = (link: string): string | null =>
  new URLSearchParams(link.split("?")[1] ?? "").get("token");

const RegisterForm = () => {
  const t = useTranslations("account");
  const tRoot = useTranslations();
  const { register: registerCustomer, isRegistering } = useCustomerAuth();
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);
  const inFlight = useRef(false);

  const form = useForm<TRegisterCustomerForm>({
    resolver: zodResolver(registerCustomerSchema),
    defaultValues,
    mode: "onChange",
  });
  const busy = form.formState.isSubmitting || isRegistering;

  const onInvalid = useCallback(() => {
    inFlight.current = false;
    setErrorKey("account.errors.validation");
  }, []);

  const submit = useCallback(
    (event?: BaseSyntheticEvent) => {
      if (inFlight.current) return;
      inFlight.current = true;

      void form.handleSubmit(async (values) => {
        setErrorKey(null);
        try {
          const result = await registerCustomer(values);
          if (result.errorKey) {
            setErrorKey(result.errorKey);
            toast.error(tRoot(result.errorKey));
            return;
          }
          setDevToken(result.devVerificationLink ? parseToken(result.devVerificationLink) : null);
          toast.success(t("status.verificationSent"));
          form.reset(defaultValues);
        } finally {
          inFlight.current = false;
        }
      }, onInvalid)(event);
    },
    [form, onInvalid, registerCustomer, t, tRoot],
  );

  return (
    <AccountFormCard title={t("register.title")}>
      <RegisterFields
        form={form}
        busy={busy}
        errorKey={errorKey}
        devToken={devToken}
        onSubmit={submit}
      />
    </AccountFormCard>
  );
};

export default memo(RegisterForm);
