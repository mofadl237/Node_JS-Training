"use client";

import { memo } from "react";
import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { TAdminLoginForm } from "@/validation/adminLogin";

interface IProps {
  form: UseFormReturn<TAdminLoginForm>;
  busy: boolean;
  errorKey: string | null;
  onSubmit: (event?: BaseSyntheticEvent) => void;
}

const describedBy = (...ids: Array<string | null>): string | undefined => {
  const values = ids.filter((id): id is string => Boolean(id));
  return values.length > 0 ? values.join(" ") : undefined;
};

const LoginFields = ({ form, busy, errorKey, onSubmit }: IProps) => {
  const t = useTranslations("dashboard.login");
  const tRoot = useTranslations();
  const { errors, isSubmitted, isValid, touchedFields } = form.formState;
  const fieldMessage = tRoot("dashboard.errors.validation");
  const showEmailError = Boolean((touchedFields.email || isSubmitted) && errors.email);
  const showPasswordError = Boolean((touchedFields.password || isSubmitted) && errors.password);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {errorKey ? (
        <p id="admin-login-error" role="alert" className="rounded-md bg-danger/10 p-3 text-sm text-danger">
          {tRoot(errorKey)}
        </p>
      ) : null}
      <div className="space-y-1.5">
        <label htmlFor="admin-login-email" className="block text-sm font-semibold text-ink">
          {t("fields.email")}
        </label>
        <Input
          id="admin-login-email"
          type="email"
          autoComplete="email"
          hasError={showEmailError}
          aria-invalid={showEmailError}
          aria-describedby={describedBy(
            errorKey ? "admin-login-error" : null,
            showEmailError ? "admin-login-email-error" : null,
          )}
          disabled={busy}
          {...form.register("email")}
        />
        {showEmailError ? (
          <p id="admin-login-email-error" role="alert" className="animate-fade-up text-xs text-danger">
            {fieldMessage}
          </p>
        ) : null}
      </div>
      <div className="space-y-1.5">
        <label htmlFor="admin-login-password" className="block text-sm font-semibold text-ink">
          {t("fields.password")}
        </label>
        <Input
          id="admin-login-password"
          type="password"
          autoComplete="current-password"
          hasError={showPasswordError}
          aria-invalid={showPasswordError}
          aria-describedby={describedBy(
            errorKey ? "admin-login-error" : null,
            showPasswordError ? "admin-login-password-error" : null,
          )}
          disabled={busy}
          {...form.register("password")}
        />
        {showPasswordError ? (
          <p id="admin-login-password-error" role="alert" className="animate-fade-up text-xs text-danger">
            {fieldMessage}
          </p>
        ) : null}
      </div>
      <Button type="submit" isLoading={busy} disabled={!isValid || busy} className="w-full">
        {t("submit")}
      </Button>
    </form>
  );
};

export default memo(LoginFields);
