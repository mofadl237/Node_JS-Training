"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface IStep {
  labelKey: string;
  target: string;
}

const STEPS: readonly IStep[] = [
  { labelKey: "checkout.stepAddress", target: "checkout-address" },
  { labelKey: "checkout.stepShipping", target: "checkout-shipping" },
  { labelKey: "checkout.stepReview", target: "checkout-summary" },
];

interface IProps {
  activeStep: number;
}

const CheckoutStepper = ({ activeStep }: IProps) => {
  const t = useTranslations();
  const progressStep = Math.min(Math.max(activeStep, 0), STEPS.length - 1);

  const focusStep = (target: string) => {
    const section = document.getElementById(target);
    section?.focus();
    section?.scrollIntoView({ block: "start" });
  };

  return (
    <nav aria-label={t("checkout.stepsLabel")} data-progress={progressStep}>
      <ol className="grid gap-2 sm:grid-cols-3">
        {STEPS.map((step, index) => {
          const isActive = index === activeStep;
          const isDone = index < activeStep;

          return (
            <li key={step.target}>
              <button
                type="button"
                onClick={() => focusStep(step.target)}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "checkout-step-button flex w-full items-center gap-2 rounded-md border px-3 py-2 text-start transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary motion-reduce:transition-none",
                  isActive
                    ? "border-primary bg-primary/10 text-ink"
                    : "border-ink/10 bg-surface text-ink-soft",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full text-sm font-semibold",
                    isActive
                      ? "bg-primary text-on-primary"
                      : isDone
                        ? "bg-success text-ink"
                        : "bg-surface-2 text-ink",
                  )}
                >
                  {index + 1}
                </span>
                <span
                  key={isActive ? activeStep : undefined}
                  className={cn("text-sm font-semibold", isActive && "checkout-step-label")}
                >
                  {t(step.labelKey)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <div aria-hidden="true" className="checkout-stepper-track">
        <span className="checkout-stepper-fill" />
      </div>
    </nav>
  );
};

export default memo(CheckoutStepper);
