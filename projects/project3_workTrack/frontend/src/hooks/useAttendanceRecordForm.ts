"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAttendanceRecordsError } from "@/src/hooks/useAttendanceRecordsError";
import {
  useCreateAttendanceRecordMutation,
  useUpdateAttendanceRecordMutation,
} from "@/src/lib/api/attendance-api";
import type {
  IAttendanceRecord,
  ICreateAttendanceRecordPayload,
  IUpdateAttendanceRecordPayload,
} from "@/src/lib/api/types";
import {
  combineDateAndTime,
  toIsoDateValue,
} from "@/src/lib/format/date-input";
import type { IAttendanceRecordFormValues } from "@/src/lib/validation/attendance-record-schema";

interface IUseAttendanceRecordFormArgs {
  record: IAttendanceRecord | null;
  onSuccess: () => void;
}

const toMinutes = (value: string): number | undefined =>
  value.trim() === "" ? undefined : Number(value);

const buildPayload = (
  values: IAttendanceRecordFormValues,
): ICreateAttendanceRecordPayload => {
  const workingMinutes = toMinutes(values.workingMinutes);
  const payload: ICreateAttendanceRecordPayload = {
    employeeId: values.employeeId,
    shiftId: values.shiftId || null,
    date: toIsoDateValue(values.date),
    status: values.status,
    checkIn: combineDateAndTime(values.date, values.checkIn),
    checkOut: combineDateAndTime(values.date, values.checkOut),
    lateMinutes: toMinutes(values.lateMinutes) ?? 0,
    earlyLeaveMinutes: toMinutes(values.earlyLeaveMinutes) ?? 0,
    overtimeMinutes: toMinutes(values.overtimeMinutes) ?? 0,
    notes: values.notes.trim() || null,
  };

  if (workingMinutes !== undefined) payload.workingMinutes = workingMinutes;

  return payload;
};

export const useAttendanceRecordForm = ({
  record,
  onSuccess,
}: IUseAttendanceRecordFormArgs) => {
  const t = useTranslations("AttendanceRecords.form");
  const localizeError = useAttendanceRecordsError();
  const [createRecord, createState] = useCreateAttendanceRecordMutation();
  const [updateRecord, updateState] = useUpdateAttendanceRecordMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = useCallback(
    async (values: IAttendanceRecordFormValues) => {
      setSubmitError(null);

      try {
        if (record) {
          const body: IUpdateAttendanceRecordPayload = buildPayload(values);

          await updateRecord({ id: record.id, body }).unwrap();
          toast.success(t("updateSuccess"));
        } else {
          await createRecord(buildPayload(values)).unwrap();
          toast.success(t("createSuccess"));
        }

        onSuccess();
      } catch (error) {
        const message = localizeError(error);

        setSubmitError(message);
        toast.error(t("errorTitle"), { description: message });
      }
    },
    [createRecord, localizeError, onSuccess, record, t, updateRecord],
  );

  return {
    submit,
    submitError,
    isSaving: createState.isLoading || updateState.isLoading,
  };
};
