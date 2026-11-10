"use client";

import { useCallback, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { LogIn, Mail } from "lucide-react";
import { useRouter } from "@/src/i18n/navigation";
import { useLoginMutation } from "@/src/lib/api/auth-api";
import {
  normalizeApiError,
  type INormalizedApiError,
} from "@/src/lib/api/error";
import { tokenStorage } from "@/src/lib/auth/token-storage";
import {
  createLoginSchema,
  type ILoginFormValues,
} from "@/src/lib/validation/login-schema";
import { useAppDispatch } from "@/src/Store/hooks";
import { setSession } from "@/src/Store/auth-slice";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import { LanguageToggle } from "@/src/components/ui/LanguageToggle/LanguageToggle";
import { PasswordField } from "@/src/components/ui/PasswordField/PasswordField";
import { TextField } from "@/src/components/ui/TextField/TextField";
import { ThemeToggle } from "@/src/components/ui/ThemeToggle/ThemeToggle";
import styles from "./LoginForm.module.scss";

export function LoginForm() {
  const t = useTranslations("Login");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [loginError, setLoginError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createLoginSchema({
        emailRequired: t("validation.emailRequired"),
        emailInvalid: t("validation.emailInvalid"),
        passwordRequired: t("validation.passwordRequired"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const localizeError = useCallback(
    (error: INormalizedApiError): string => {
      if (error.code === "NETWORK_ERROR") return t("errors.network");
      if (error.code === "TIMEOUT_ERROR") return t("errors.timeout");
      if (error.status === 429 || error.code === "RATE_LIMITED") {
        return t("errors.rateLimited", {
          seconds: error.details?.retryAfter ?? 60,
        });
      }
      if (error.status === 401 || error.code === "INVALID_CREDENTIALS") {
        return t("errors.invalidCredentials");
      }
      if (error.status === 400 || error.code === "VALIDATION_ERROR") {
        return t("errors.validation");
      }

      return error.message || t("errors.unexpected");
    },
    [t],
  );

  const onSubmit = useCallback(
    async (values: ILoginFormValues) => {
      setLoginError(null);

      try {
        const result = await login(values).unwrap();
        const session = {
          user: result.user,
          token: result.token,
          refreshToken: result.refreshToken,
        };

        tokenStorage.write(session);
        dispatch(setSession(session));

        toast.success(t("successTitle"), {
          description: t("successMessage", { name: result.user.name }),
        });

        router.replace("/dashboard");
      } catch (error) {
        const message = localizeError(normalizeApiError(error));

        setLoginError(message);
        toast.error(t("errorTitle"), { description: message });
      }
    },
    [dispatch, localizeError, login, router, t],
  );

  const isBusy = isSubmitting || isLoading;

  return (
    <section className={styles.panel}>
      <div className={styles.panelTop}>
        <p className={styles.eyebrow}>{t("eyebrow")}</p>
        <div className={styles.controls}>
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>

      <div className={styles.heading}>
        <h2 className={styles.title}>{t("title")}</h2>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </div>

      {loginError && <Alert title={t("errorTitle")}>{loginError}</Alert>}

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register("email")}
          label={t("emailLabel")}
          placeholder={t("emailPlaceholder")}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          dir="ltr"
          autoFocus
          leadingIcon={<Mail size={18} />}
          error={errors.email?.message}
        />

        <PasswordField
          {...register("password")}
          label={t("passwordLabel")}
          placeholder={t("passwordPlaceholder")}
          autoComplete="current-password"
          showLabel={t("showPassword")}
          hideLabel={t("hidePassword")}
          error={errors.password?.message}
        />

        <Button
          type="submit"
          size="lg"
          fullWidth
          isLoading={isBusy}
          trailingIcon={<LogIn size={18} />}
        >
          {isBusy ? t("submitting") : t("submit")}
        </Button>
      </form>

      <p className={styles.support}>{t("support")}</p>
      <p className={styles.legal}>{t("footer")}</p>
    </section>
  );
}
