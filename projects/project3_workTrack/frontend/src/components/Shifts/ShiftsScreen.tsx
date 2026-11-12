"use client";

import { useState } from "react";
import { CalendarDays, UserRoundCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/src/components/shared/PageHeader/PageHeader";
import { AssignmentsPanel } from "./AssignmentsPanel";
import { ShiftsPanel } from "./ShiftsPanel";
import styles from "./ShiftsScreen.module.scss";

type TShiftsTab = "shifts" | "assignments";

export function ShiftsScreen() {
  const t = useTranslations("Shifts");
  const [activeTab, setActiveTab] = useState<TShiftsTab>("shifts");

  return (
    <div className={styles.screen}>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("subtitle")}
      />

      <div className={styles.tabs} role="tablist" aria-label={t("tabs.label")}>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "shifts"}
          className={[
            styles.tab,
            activeTab === "shifts" ? styles.activeTab : null,
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setActiveTab("shifts")}
        >
          <CalendarDays size={17} aria-hidden="true" />
          {t("tabs.shifts")}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "assignments"}
          className={[
            styles.tab,
            activeTab === "assignments" ? styles.activeTab : null,
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setActiveTab("assignments")}
        >
          <UserRoundCheck size={17} aria-hidden="true" />
          {t("tabs.assignments")}
        </button>
      </div>

      {activeTab === "shifts" ? <ShiftsPanel /> : <AssignmentsPanel />}
    </div>
  );
}
