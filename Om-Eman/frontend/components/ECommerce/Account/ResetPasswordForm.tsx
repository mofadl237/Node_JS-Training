"use client";

import { memo, useCallback, useRef, useState } from "react";
import type { BaseSyntheticEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import AccountFieldError from "@/components/ECommerce/Account/AccountFieldError";
import AccountFormCard from "@/components/ECommerce/Account/AccountFormCard";
import AccountFormError from "@/components/ECommerce/Account/AccountFormError";
import AccountFormField from "@/components/ECommerce/Account/AccountFormField";
import { Link, useRouter } from "@/i18n/navigation";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { accountDescribedBy } from "@/lib/accountFormA11y";
import { ACCOUNT_LOGIN_HREF } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { resetPasswordSchema, type TResetPasswordForm } from "@/validation/customerAuth";

const ResetPasswordForm = () => {
  const t = useTranslations("account");
  const tRoot = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, isResetting } = useCustomerAuth();
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const inFlight = useRef(false);
  const token = searchParams.get("token") ?? "";

  const form = useForm<TResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "" },
    mode: "onChange",
  });
  const { errors, isSubmitting, isSubmitted, isValid, touchedFields } = form.formState;
  const busy = isSubmitting || isResetting;
  const fieldMessage = tRoot("account.errors.validation");
  const showTokenError = Boolean((touchedFields.token || isSubmitted) && errors.token);
  const showPasswordError = Boolean((touchedFields.password || isSubmitted) && errors.password);

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
          const result = await resetPassword(values);
          if (result) {
            setErrorKey(result);
            toast.error(tRoot(result));
            return;
          }
          toast.success(t("status.passwordReset"));
          form.reset({ token: "", password: "" });
          router.push(ACCOUNT_LOGIN_HREF);
        } finally {
          inFlight.current = false;
        }
      }, onInvalid)(event);
    },
    [form, onInvalid, resetPassword, router, t, tRoot],
  );

  return (
    <AccountFormCard title={t("resetPassword.title")} subtitle={t("resetPassword.subtitle")}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <AccountFormError errorKey={errorKey} id="reset-password-error" />
        <AccountFormField htmlFor="reset-token" label={t("fields.token")}>
          <Input
            id="reset-token"
            autoComplete="one-time-code"
            hasError={showTokenError}
            aria-invalid={showTokenError}
            aria-describedby={accountDescribedBy(
              errorKey ? "reset-password-error" : null,
              showTokenError ? "reset-token-error" : null,
            )}
            disabled={busy}
            {...form.register("token")}
          />
          <AccountFieldError
            id="reset-token-error"
            message={showTokenError ? fieldMessage : undefined}
          />
        </AccountFormField>
        <AccountFormField htmlFor="reset-password" label={t("fields.newPassword")}>
          <Input
            id="reset-password"
            type="password"
            autoComplete="new-password"
            hasError={showPasswordError}
            aria-invalid={showPasswordError}
            aria-describedby={accountDescribedBy(
              errorKey ? "reset-password-error" : null,
              showPasswordError ? "reset-password-field-error" : null,
            )}
            disabled={busy}
            {...form.register("password")}
          />
          <AccountFieldError
            id="reset-password-field-error"
            message={showPasswordError ? fieldMessage : undefined}
          />
        </AccountFormField>
        <Button
          type="submit"
          isLoading={busy}
          disabled={!isValid}
          className="w-full transition-all duration-200 hover:shadow-hover"
        >
          {t("resetPassword.submit")}
        </Button>
        <Link
          href={ACCOUNT_LOGIN_HREF}
          className="block rounded-sm text-center text-sm font-semibold text-primary transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("actions.backToLogin")}
        </Link>
      </form>
    </AccountFormCard>
  );
};

export default memo(ResetPasswordForm);
