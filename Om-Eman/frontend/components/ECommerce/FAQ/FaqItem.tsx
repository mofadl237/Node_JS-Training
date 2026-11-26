import { ChevronDown } from "lucide-react";

interface IProps {
  question: string;
  answer: string;
}

export const FaqItem = ({ question, answer }: IProps) => (
  <details className="group rounded-xl border border-ink/10 bg-surface/60 px-4 py-3 transition-[border-color,background-color,box-shadow] duration-200 ease-out motion-safe:hover:bg-surface motion-safe:hover:shadow-rest motion-safe:group-open:border-primary/20 motion-reduce:transition-none">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-sm font-semibold text-ink transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
      <span>{question}</span>
      <ChevronDown
        aria-hidden="true"
        className="size-4 shrink-0 text-primary motion-safe:transition-transform motion-safe:duration-200 group-open:rotate-180 motion-reduce:transition-none"
      />
    </summary>
    <p className="mt-3 text-sm leading-relaxed text-ink-soft">{answer}</p>
  </details>
);
