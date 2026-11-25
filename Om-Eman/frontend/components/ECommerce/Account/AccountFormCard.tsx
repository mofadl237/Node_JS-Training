import type { ReactNode } from "react";
import { GlowCard } from "@/components/shared/GlowCard";
import { ACCOUNT_GLOW_CARD_CLASS } from "@/components/ECommerce/Account/accountStyles";

interface IProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const AccountFormCard = ({ title, subtitle, children }: IProps) => (
  <GlowCard accent="card-2" className={ACCOUNT_GLOW_CARD_CLASS}>
    <section className="relative z-10">
      <div className="animate-fade-up space-y-1">
        <h1 className="font-display text-2xl text-ink">{title}</h1>
        {subtitle ? <p className="text-sm text-ink-soft">{subtitle}</p> : null}
      </div>
      <div className="animate-fade-up [animation-delay:120ms] mt-6">{children}</div>
    </section>
  </GlowCard>
);

export default AccountFormCard;
