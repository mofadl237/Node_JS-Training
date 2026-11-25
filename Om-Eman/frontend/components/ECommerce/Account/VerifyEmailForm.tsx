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
import { verifyEmailSchema, type TVerifyEmailForm } from "@/validation/customerAuth";

const VerifyEmailForm = () => {
  const t = useTranslations("account");
  const tRoot = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, isVerifying } = useCustomerAuth();
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const inFlight = useRef(false);
  const token = searchParams.get("token") ?? "";

  const form = useForm<TVerifyEmailForm>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { token },
    mode: "onChange",
  });
  const { errors, isSubmitting, isSubmitted, isValid, touchedFields } = form.formState;
  const busy = isSubmitting || isVerifying;
  const showTokenError = Boolean((touchedFields.token || isSubmitted) && errors.token);

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
          const result = await verifyEmail(values);
          if (result) {
            setErrorKey(result);
            toast.error(tRoot(result));
            return;
          }
          toast.success(t("status.emailVerified"));
          form.reset({ token: "" });
          router.push(ACCOUNT_LOGIN_HREF);
        } finally {
          inFlight.current = false;
        }
      }, onInvalid)(event);
    },
    [form, onInvalid, router, t, tRoot, verifyEmail],
  );

  return (
    <AccountFormCard title={t("verifyEmail.title")} subtitle={t("verifyEmail.subtitle")}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <AccountFormError errorKey={errorKey} id="verify-email-error" />
        <AccountFormField htmlFor="verify-token" label={t("fields.token")}>
          <Input
            id="verify-token"
            autoComplete="one-time-code"
            hasError={showTokenError}
            aria-invalid={showTokenError}
            aria-describedby={accountDescribedBy(
              errorKey ? "verify-email-error" : null,
              showTokenError ? "verify-token-error" : null,
            )}
            disabled={busy}
            {...form.register("token")}
          />
          <AccountFieldError
            id="verify-token-error"
            message={showTokenError ? tRoot("account.errors.validation") : undefined}
          />
        </AccountFormField>
        <Button
          type="submit"
          isLoading={busy}
          disabled={!isValid}
          className="w-full transition-all duration-200 hover:shadow-hover"
        >
          {t("verifyEmail.submit")}
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

export default memo(VerifyEmailForm);
