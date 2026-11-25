"use client";

import { memo } from "react";

interface IProps {
  id: string;
  message?: string;
}

const AccountFieldError = ({ id, message }: IProps) => {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="animate-fade-up text-xs text-danger">
      {message}
    </p>
  );
};

export default memo(AccountFieldError);
