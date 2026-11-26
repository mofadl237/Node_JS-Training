"use client";

import { memo, useCallback, useRef } from "react";
import type { BaseSyntheticEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Shake } from "@/components/Animation/Shake";
import LoginFields from "@/components/Dashboard/Auth/LoginFields";
import type { IUseAdminLoginResult } from "@/hooks/useAdminLogin";
import { adminLoginSchema, type TAdminLoginForm } from "@/validation/adminLogin";

interface IProps {
  auth: IUseAdminLoginResult;
}

const defaultValues: TAdminLoginForm = { email: "", password: "" };

const LoginForm = ({ auth }: IProps) => {
  const form = useForm<TAdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues,
    mode: "onChange",
  });
  const inFlight = useRef(false);
  const busy = form.formState.isSubmitting || auth.isBusy;

  const submit = useCallback(
    (event?: BaseSyntheticEvent) => {
      if (inFlight.current) return;
      inFlight.current = true;

      void form.handleSubmit(async (values) => {
        try {
          const result = await auth.login(values);
          if (!result) form.reset(defaultValues);
        } finally {
          inFlight.current = false;
        }
      }, auth.handleInvalid)(event);
    },
    [auth, form],
  );

  return (
    <Shake isShaking={auth.isShaking}>
      <LoginFields
        form={form}
        busy={busy}
        errorKey={auth.errorKey}
        onSubmit={submit}
      />
    </Shake>
  );
};

export default memo(LoginForm);
