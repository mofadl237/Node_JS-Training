"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Shake } from "@/components/Animation/Shake";

interface IProps {
  errorKey: string | null;
  id: string;
}

const AccountFormError = ({ errorKey, id }: IProps) => {
  const tRoot = useTranslations();

  if (!errorKey) return null;

  return (
    <Shake isShaking={Boolean(errorKey)}>
      <p id={id} role="alert" className="rounded-md bg-danger/10 p-3 text-sm text-danger">
        {tRoot(errorKey)}
      </p>
    </Shake>
  );
};

export default memo(AccountFormError);
