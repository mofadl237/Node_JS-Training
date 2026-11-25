"use client";

import { memo, useCallback, useRef, useState } from "react";
import type { BaseSyntheticEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import AccountFormCard from "@/components/ECommerce/Account/AccountFormCard";
import AuthDivider from "@/components/ECommerce/Account/AuthDivider";
import GoogleSignInButton from "@/components/ECommerce/Account/GoogleSignInButton";
import LoginFields from "@/components/ECommerce/Account/LoginFields";
import { useRouter } from "@/i18n/navigation";
import { useCartMerge } from "@/hooks/useCartMerge";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { ACCOUNT_HREF } from "@/lib/routes";
import { customerLoginSchema, type TCustomerLoginForm } from "@/validation/customerAuth";

const defaultValues: TCustomerLoginForm = { email: "", password: "" };

const LoginForm = () => {
  const t = useTranslations("account");
  const tRoot = useTranslations();
  const router = useRouter();
  const { login, isLoggingIn } = useCustomerAuth();
  const { merge, isMerging } = useCartMerge();
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const inFlight = useRef(false);

  const form = useForm<TCustomerLoginForm>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues,
    mode: "onChange",
  });
  const busy = form.formState.isSubmitting || isLoggingIn || isMerging;

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
          const result = await login(values);
          if (result) {
            setErrorKey(result);
            toast.error(tRoot(result));
            return;
          }
          toast.success(t("status.signedIn"));
          const mergeOutcome = await merge();
          if (mergeOutcome.status === "merged") {
            toast.success(tRoot("cart.merge.success"));
          } else if (mergeOutcome.status === "notActive") {
            toast(tRoot("cart.merge.notActive"));
          } else if (mergeOutcome.errorKey) {
            toast.error(tRoot(mergeOutcome.errorKey));
          }
          form.reset(defaultValues);
          router.push(ACCOUNT_HREF);
        } finally {
          inFlight.current = false;
        }
      }, onInvalid)(event);
    },
    [form, login, merge, onInvalid, router, t, tRoot],
  );

  return (
    <AccountFormCard title={t("login.title")}>
      <div className="space-y-4">
        <GoogleSignInButton />
        <AuthDivider />
        <LoginFields form={form} busy={busy} errorKey={errorKey} onSubmit={submit} />
      </div>
    </AccountFormCard>
  );
};

export default memo(LoginForm);
