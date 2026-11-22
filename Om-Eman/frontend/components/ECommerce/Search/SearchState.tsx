import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";

interface IProps {
  kind: "empty" | "error";
  title: string;
  body: string;
}

export const SearchState = ({ kind, title, body }: IProps) =>
  kind === "error" ? <ErrorState title={title} body={body} /> : <EmptyState title={title} body={body} />;
