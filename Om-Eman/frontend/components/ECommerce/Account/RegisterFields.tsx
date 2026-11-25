"use client";

import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import AccountFieldError from "@/components/ECommerce/Account/AccountFieldError";
import AccountFormError from "@/components/ECommerce/Account/AccountFormError";
import AccountFormField from "@/components/ECommerce/Account/AccountFormField";
import { Link } from "@/i18n/navigation";
import { accountDescribedBy } from "@/lib/accountFormA11y";
import { ACCOUNT_LOGIN_HREF, ACCOUNT_VERIFY_EMAIL_HREF } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { TRegisterCustomerForm } from "@/validation/customerAuth";

interface IProps {
  form: UseFormReturn<TRegisterCustomerForm>;
  busy: boolean;
  errorKey: string | null;
  devToken: string | null;
  onSubmit: (event?: BaseSyntheticEvent) => void;
}

const optional = (value: unknown) => {
  const text = typeof value === "string" ? value.trim() : "";
  return text ? text : undefined;
};

const RegisterFields = ({ form, busy, errorKey, devToken, onSubmit }: IProps) => {
  const t = useTranslations("account");
  const tRoot = useTranslations();
  const { errors, isSubmitted, isValid, touchedFields } = form.formState;
  const fieldMessage = tRoot("account.errors.validation");
  const showFieldError = (field: keyof TRegisterCustomerForm): boolean =>
    Boolean((touchedFields[field] || isSubmitted) && errors[field]);
  const describedBy = (field: keyof TRegisterCustomerForm, id: string): string | undefined =>
    accountDescribedBy(errorKey ? "register-error" : null, showFieldError(field) ? id : null);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <AccountFormError errorKey={errorKey} id="register-error" />
      <div className="grid gap-4 sm:grid-cols-2">
        <AccountFormField htmlFor="register-first-name" label={t("fields.firstName")}>
          <Input
            id="register-first-name"
            autoComplete="given-name"
            hasError={showFieldError("firstName")}
            aria-invalid={showFieldError("firstName")}
            aria-describedby={describedBy("firstName", "register-first-name-error")}
            disabled={busy}
            {...form.register("firstName", { setValueAs: optional })}
          />
          <AccountFieldError id="register-first-name-error" message={showFieldError("firstName") ? fieldMessage : undefined} />
        </AccountFormField>
        <AccountFormField htmlFor="register-last-name" label={t("fields.lastName")}>
          <Input
            id="register-last-name"
            autoComplete="family-name"
            hasError={showFieldError("lastName")}
            aria-invalid={showFieldError("lastName")}
            aria-describedby={describedBy("lastName", "register-last-name-error")}
            disabled={busy}
            {...form.register("lastName", { setValueAs: optional })}
          />
          <AccountFieldError id="register-last-name-error" message={showFieldError("lastName") ? fieldMessage : undefined} />
        </AccountFormField>
      </div>
      <AccountFormField htmlFor="register-email" label={t("fields.email")}>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          hasError={showFieldError("email")}
          aria-invalid={showFieldError("email")}
          aria-describedby={describedBy("email", "register-email-error")}
          disabled={busy}
          {...form.register("email")}
        />
        <AccountFieldError id="register-email-error" message={showFieldError("email") ? fieldMessage : undefined} />
      </AccountFormField>
      <AccountFormField htmlFor="register-phone" label={t("fields.phone")}>
        <Input
          id="register-phone"
          type="tel"
          autoComplete="tel"
          hasError={showFieldError("phone")}
          aria-invalid={showFieldError("phone")}
          aria-describedby={describedBy("phone", "register-phone-error")}
          disabled={busy}
          {...form.register("phone", { setValueAs: optional })}
        />
        <AccountFieldError id="register-phone-error" message={showFieldError("phone") ? fieldMessage : undefined} />
      </AccountFormField>
      <AccountFormField htmlFor="register-password" label={t("fields.password")}>
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          hasError={showFieldError("password")}
          aria-invalid={showFieldError("password")}
          aria-describedby={describedBy("password", "register-password-error")}
          disabled={busy}
          {...form.register("password")}
        />
        <AccountFieldError id="register-password-error" message={showFieldError("password") ? fieldMessage : undefined} />
      </AccountFormField>
      <Button type="submit" isLoading={busy} disabled={!isValid} className="w-full transition-all duration-200 hover:shadow-hover">
        {t("register.submit")}
      </Button>
      {devToken ? (
        <Link
          href={{ pathname: ACCOUNT_VERIFY_EMAIL_HREF, query: { token: devToken } }}
          className="animate-fade-up block break-all text-sm text-primary hover:underline"
        >
          {t("status.devVerificationLink")}
        </Link>
      ) : null}
      <p className="text-sm text-ink-soft">
        {t("register.hasAccount")}{" "}
        <Link href={ACCOUNT_LOGIN_HREF} className="font-semibold text-primary hover:underline">
          {t("register.loginLink")}
        </Link>
      </p>
    </form>
  );
};

export default RegisterFields;
