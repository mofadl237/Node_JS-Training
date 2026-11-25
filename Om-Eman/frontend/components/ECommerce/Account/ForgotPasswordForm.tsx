"use client";

import { memo, useCallback, useRef, useState } from "react";
import type { BaseSyntheticEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import AccountFieldError from "@/components/ECommerce/Account/AccountFieldError";
import AccountFormCard from "@/components/ECommerce/Account/AccountFormCard";
import AccountFormError from "@/components/ECommerce/Account/AccountFormError";
import AccountFormField from "@/components/ECommerce/Account/AccountFormField";
import { Link } from "@/i18n/navigation";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { accountDescribedBy } from "@/lib/accountFormA11y";
import { ACCOUNT_LOGIN_HREF } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { forgotPasswordSchema, type TForgotPasswordForm } from "@/validation/customerAuth";

const defaultValues: TForgotPasswordForm = { email: "" };

const ForgotPasswordForm = () => {
  const t = useTranslations("account");
  const tRoot = useTranslations();
  const { forgotPassword, isRequestingReset } = useCustomerAuth();
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const inFlight = useRef(false);

  const form = useForm<TForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues,
    mode: "onChange",
  });
  const { errors, isSubmitting, isSubmitted, isValid, touchedFields } = form.formState;
  const busy = isSubmitting || isRequestingReset;
  const showEmailError = Boolean((touchedFields.email || isSubmitted) && errors.email);

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
          const result = await forgotPassword(values);
          if (result) {
            setErrorKey(result);
            toast.error(tRoot(result));
            return;
          }
          toast.success(t("status.resetLinkSent"));
          form.reset(defaultValues);
        } finally {
          inFlight.current = false;
        }
      }, onInvalid)(event);
    },
    [forgotPassword, form, onInvalid, t, tRoot],
  );

  return (
    <AccountFormCard title={t("forgotPassword.title")} subtitle={t("forgotPassword.subtitle")}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <AccountFormError errorKey={errorKey} id="forgot-password-error" />
        <AccountFormField htmlFor="forgot-email" label={t("fields.email")}>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            hasError={showEmailError}
            aria-invalid={showEmailError}
            aria-describedby={accountDescribedBy(
              errorKey ? "forgot-password-error" : null,
              showEmailError ? "forgot-email-error" : null,
            )}
            disabled={busy}
            {...form.register("email")}
          />
          <AccountFieldError
            id="forgot-email-error"
            message={showEmailError ? tRoot("account.errors.validation") : undefined}
          />
        </AccountFormField>
        <Button
          type="submit"
          isLoading={busy}
          disabled={!isValid}
          className="w-full transition-all duration-200 hover:shadow-hover"
        >
          {t("forgotPassword.submit")}
        </Button>
        <Link href={ACCOUNT_LOGIN_HREF} className="block text-sm text-primary hover:underline">
          {t("register.loginLink")}
        </Link>
      </form>
    </AccountFormCard>
  );
};

export default memo(ForgotPasswordForm);
