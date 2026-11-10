"use client";

import {
  BarChart3,
  CalendarCheck2,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { BrandMark } from "@/src/components/ui/BrandMark/BrandMark";
import { LoginFeatureCard } from "../LoginFeatureCard/LoginFeatureCard";
import styles from "./LoginHero.module.scss";

export function LoginHero() {
  const t = useTranslations("Login");
  const common = useTranslations("Common");

  return (
    <section className={styles.hero}>
      <div className={styles.top}>
        <BrandMark
          name={common("brandName")}
          tagline={common("brandTagline")}
          tone="light"
        />
      </div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          {t("hero.eyebrow")}
        </p>

        <h1 className={styles.title}>{t("hero.title")}</h1>
        <p className={styles.description}>{t("hero.description")}</p>
      </div>

      <div className={styles.features}>
        <LoginFeatureCard
          icon={<CalendarCheck2 size={19} />}
          title={t("features.attendance.title")}
          description={t("features.attendance.description")}
          accent="brand"
          delay={120}
        />
        <LoginFeatureCard
          icon={<UsersRound size={19} />}
          title={t("features.people.title")}
          description={t("features.people.description")}
          accent="amber"
          delay={200}
        />
        <LoginFeatureCard
          icon={<BarChart3 size={19} />}
          title={t("features.insights.title")}
          description={t("features.insights.description")}
          accent="clay"
          delay={280}
        />
      </div>

      <p className={styles.footer}>
        <ShieldCheck size={15} aria-hidden="true" />
        {t("footer")}
      </p>
    </section>
  );
}
