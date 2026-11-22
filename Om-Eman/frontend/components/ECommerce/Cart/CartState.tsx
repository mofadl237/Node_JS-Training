import type { ReactNode } from "react";
import { memo } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";

interface IProps {
  kind: "empty" | "error";
  title: string;
  body: string;
  action?: ReactNode;
}

const CartState = ({ kind, title, body, action }: IProps) =>
  kind === "error" ? (
    <ErrorState title={title} body={body} action={action} />
  ) : (
    <EmptyState title={title} body={body} action={action} />
  );

export default memo(CartState);
