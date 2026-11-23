"use client";

import { memo, type ReactNode } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";

interface IProps {
  kind: "empty" | "error" | "network";
  title: string;
  body: string;
  action?: ReactNode;
}

const CheckoutState = ({ kind, title, body, action }: IProps) =>
  kind === "empty" ? (
    <EmptyState title={title} body={body} action={action} />
  ) : (
    <ErrorState title={title} body={body} action={action} />
  );

export default memo(CheckoutState);
