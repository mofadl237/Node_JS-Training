"use client";

import type { ChangeEvent } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/Button/Button";
import { TextField } from "@/src/components/ui/TextField/TextField";
import styles from "./AuditLogsToolbar.module.scss";

interface IAuditLogsToolbarProps {
  search: string;
  action: string;
  entity: string;
  from: string;
  to: string;
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onEntityChange: (value: string) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onClearFilters: () => void;
}

export function AuditLogsToolbar({
  search,
  action,
  entity,
  from,
  to,
  hasFilters,
  onSearchChange,
  onActionChange,
  onEntityChange,
  onFromChange,
  onToChange,
  onClearFilters,
}: IAuditLogsToolbarProps) {
  const t = useTranslations("AuditLogs.filters");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleActionChange = (event: ChangeEvent<HTMLInputElement>) => {
    onActionChange(event.target.value);
  };

  const handleEntityChange = (event: ChangeEvent<HTMLInputElement>) => {
    onEntityChange(event.target.value);
  };

  const handleFromChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFromChange(event.target.value);
  };

  const handleToChange = (event: ChangeEvent<HTMLInputElement>) => {
    onToChange(event.target.value);
  };

  return (
    <div className={styles.toolbar}>
      <TextField
        label={t("searchLabel")}
        placeholder={t("searchPlaceholder")}
        value={search}
        maxLength={100}
        autoComplete="off"
        leadingIcon={<Search size={16} />}
        onChange={handleSearchChange}
        containerClassName={styles.search}
      />

      <TextField
        label={t("actionLabel")}
        placeholder={t("actionPlaceholder")}
        value={action}
        maxLength={50}
        autoComplete="off"
        onChange={handleActionChange}
        containerClassName={styles.field}
      />

      <TextField
        label={t("entityLabel")}
        placeholder={t("entityPlaceholder")}
        value={entity}
        maxLength={100}
        autoComplete="off"
        onChange={handleEntityChange}
        containerClassName={styles.field}
      />

      <TextField
        label={t("fromLabel")}
        type="date"
        value={from}
        max={to || undefined}
        onChange={handleFromChange}
        containerClassName={styles.date}
      />

      <TextField
        label={t("toLabel")}
        type="date"
        value={to}
        min={from || undefined}
        onChange={handleToChange}
        containerClassName={styles.date}
      />

      {hasFilters && (
        <Button
          variant="ghost"
          className={styles.clear}
          onClick={onClearFilters}
        >
          {t("clear")}
        </Button>
      )}
    </div>
  );
}
