"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { TextField } from "@/src/components/ui/TextField/TextField";
import { useEmployeeSearch } from "@/src/hooks/useEmployeeSearch";
import type { IEmployee } from "@/src/lib/api/types";
import { AttendanceEmployeeOptions } from "./AttendanceEmployeeOptions";
import styles from "./AttendanceEmployeeFilter.module.scss";

export interface IAttendanceEmployeeFilterLabels {
  label?: string;
  placeholder?: string;
  clear?: string;
  loading?: string;
  empty?: string;
  error?: string;
  noJobTitle?: string;
}

interface IAttendanceEmployeeFilterProps {
  employee: IEmployee | null;
  labels?: IAttendanceEmployeeFilterLabels;
  onChange: (employee: IEmployee | null) => void;
}

export function AttendanceEmployeeFilter({
  employee,
  labels,
  onChange,
}: IAttendanceEmployeeFilterProps) {
  // 1- state
  const t = useTranslations("AttendanceLogs");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const optionsId = useId();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const { employees, isLoading, isFetching, isError } = useEmployeeSearch(search);
  const inputValue = employee
    ? `${employee.firstName} ${employee.lastName}`
    : search;
  const activeIndex = Math.min(
    highlightedIndex,
    Math.max(employees.length - 1, 0),
  );
  const activeOption = employees[activeIndex];

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  // 2- handlers
  const selectEmployee = (value: IEmployee) => {
    onChange(value);
    setSearch("");
    setIsOpen(false);
  };

  const clearEmployee = () => {
    onChange(null);
    setSearch("");
    setIsOpen(false);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (employee) onChange(null);
    setSearch(event.target.value);
    setHighlightedIndex(0);
    setIsOpen(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setHighlightedIndex(
        employees.length === 0 ? 0 : (activeIndex + 1) % employees.length,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex(
        employees.length === 0
          ? 0
          : (activeIndex - 1 + employees.length) % employees.length,
      );
      return;
    }

    if (event.key === "Enter" && isOpen && activeOption) {
      event.preventDefault();
      selectEmployee(activeOption);
    }
  };

  // 3- render
  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <TextField
        label={labels?.label ?? t("employeeLabel")}
        placeholder={labels?.placeholder ?? t("employeePlaceholder")}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        type="search"
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={optionsId}
        aria-autocomplete="list"
        aria-activedescendant={
          isOpen && activeOption
            ? `${optionsId}-${activeOption.id}`
            : undefined
        }
        containerClassName={styles.field}
        trailingSlot={
          employee || search ? (
            <button
              type="button"
              className={styles.clear}
              onClick={clearEmployee}
              aria-label={labels?.clear ?? t("clearEmployee")}
            >
              <X size={14} />
            </button>
          ) : undefined
        }
      />

      {isOpen && (
        <AttendanceEmployeeOptions
          optionsId={optionsId}
          employees={employees}
          highlightedIndex={activeIndex}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          labels={{
            loading: labels?.loading,
            empty: labels?.empty,
            error: labels?.error,
            noJobTitle: labels?.noJobTitle,
          }}
          onHighlight={setHighlightedIndex}
          onSelect={selectEmployee}
        />
      )}
    </div>
  );
}
