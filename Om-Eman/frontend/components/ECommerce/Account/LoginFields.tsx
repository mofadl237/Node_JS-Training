"use client";

import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import AccountFieldError from "@/components/ECommerce/Account/AccountFieldError";
import AccountFormError from "@/components/ECommerce/Account/AccountFormError";
import AccountFormField from "@/components/ECommerce/Account/AccountFormField";
import { accountDescribedBy } from "@/lib/accountFormA11y";
import { Link } from "@/i18n/navigation";
import { ACCOUNT_FORGOT_PASSWORD_HREF, ACCOUNT_REGISTER_HREF } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { TCustomerLoginForm } from "@/validation/customerAuth";

interface IProps {
  form: UseFormReturn<TCustomerLoginForm>;
  busy: boolean;
  errorKey: string | null;
  onSubmit: (event?: BaseSyntheticEvent) => void;
}

const linkClass = "rounded-sm font-semibold text-primary transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const LoginFields = ({ form, busy, errorKey, onSubmit }: IProps) => {
  const t = useTranslations("account");
  const tRoot = useTranslations();
  const { errors, isSubmitted, isValid, touchedFields } = form.formState;
  const fieldMessage = tRoot("account.errors.validation");
  const showEmailError = Boolean((touchedFields.email || isSubmitted) && errors.email);
  const showPasswordError = Boolean((touchedFields.password || isSubmitted) && errors.password);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <AccountFormError errorKey={errorKey} id="login-error" />
      <AccountFormField htmlFor="login-email" label={t("fields.email")}>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          hasError={showEmailError}
          aria-invalid={showEmailError}
          aria-describedby={accountDescribedBy(
            errorKey ? "login-error" : null,
            showEmailError ? "login-email-error" : null,
          )}
          disabled={busy}
          {...form.register("email")}
        />
        <AccountFieldError id="login-email-error" message={showEmailError ? fieldMessage : undefined} />
      </AccountFormField>
      <AccountFormField htmlFor="login-password" label={t("fields.password")}>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          hasError={showPasswordError}
          aria-invalid={showPasswordError}
          aria-describedby={accountDescribedBy(
            errorKey ? "login-error" : null,
            showPasswordError ? "login-password-error" : null,
          )}
          disabled={busy}
          {...form.register("password")}
        />
        <AccountFieldError id="login-password-error" message={showPasswordError ? fieldMessage : undefined} />
      </AccountFormField>
      <Button type="submit" isLoading={busy} disabled={!isValid} className="w-full transition-all duration-200 hover:shadow-hover">
        {t("login.submit")}
      </Button>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-soft">
        <span>
          {t("login.noAccount")}{" "}
          <Link href={ACCOUNT_REGISTER_HREF} className={linkClass}>
            {t("login.registerLink")}
          </Link>
        </span>
        <Link href={ACCOUNT_FORGOT_PASSWORD_HREF} className={linkClass}>
          {t("forgotPassword.title")}
        </Link>
      </div>
    </form>
  );
};

export default LoginFields;
