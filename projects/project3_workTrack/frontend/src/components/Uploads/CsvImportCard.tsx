"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { FileUp, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCsvImport, type TCsvImportKind } from "@/src/hooks/useCsvImport";
import { Alert } from "@/src/components/ui/Alert/Alert";
import { Button } from "@/src/components/ui/Button/Button";
import { CsvImportResult } from "./CsvImportResult";
import styles from "./Uploads.module.scss";

interface ICsvImportCardProps {
  kind: TCsvImportKind;
  title: string;
  description: string;
  columns: string;
  icon: ReactNode;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const formatFileSize = (bytes: number): string =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export function CsvImportCard({
  kind,
  title,
  description,
  columns,
  icon,
}: ICsvImportCardProps) {
  const t = useTranslations("Uploads");
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const { upload, reset, result, error, isUploading } = useCsvImport(kind);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;

    setClientError(null);
    reset();

    if (!nextFile) {
      setFile(null);
      return;
    }

    if (!nextFile.name.toLowerCase().endsWith(".csv")) {
      event.target.value = "";
      setFile(null);
      setClientError(t("invalidFileType"));
      return;
    }

    if (nextFile.size > MAX_FILE_SIZE) {
      event.target.value = "";
      setFile(null);
      setClientError(t("fileTooLarge"));
      return;
    }

    setFile(nextFile);
  };

  const clearFile = () => {
    setFile(null);
    setClientError(null);
    reset();

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = () => {
    if (!file) return;

    void upload(file);
  };

  return (
    <section className={styles.card}>
      <header className={styles.cardHeader}>
        <span className={styles.cardIcon} aria-hidden="true">
          {icon}
        </span>
        <div className={styles.cardHeading}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardDescription}>{description}</p>
        </div>
      </header>

      <div className={styles.columns}>
        <span className={styles.columnsLabel}>{t("columnsLabel")}</span>
        <code className={styles.columnsValue}>{columns}</code>
      </div>

      <label
        className={[styles.dropzone, file ? styles.dropzoneActive : null]
          .filter(Boolean)
          .join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className={styles.fileInput}
          disabled={isUploading}
          onChange={handleFileChange}
        />
        <span className={styles.dropIcon} aria-hidden="true">
          <FileUp size={22} />
        </span>
        <span className={styles.dropTitle}>
          {file ? t("selectedFile") : t("chooseFile")}
        </span>
        <span className={styles.dropHint}>
          {file
            ? `${file.name} · ${formatFileSize(file.size)}`
            : t("fileHint")}
        </span>
      </label>

      {file && (
        <button
          type="button"
          className={styles.removeFile}
          onClick={clearFile}
          disabled={isUploading}
        >
          <X size={14} aria-hidden="true" />
          {t("removeFile")}
        </button>
      )}

      {clientError && <Alert title={t("fileErrorTitle")}>{clientError}</Alert>}
      {error && <Alert title={t("errorTitle")}>{error}</Alert>}

      <div className={styles.actions}>
        <Button
          leadingIcon={<Upload size={18} />}
          isLoading={isUploading}
          disabled={!file}
          onClick={handleUpload}
        >
          {isUploading ? t("uploading") : t("upload")}
        </Button>
      </div>

      {result && <CsvImportResult result={result} />}
    </section>
  );
}
