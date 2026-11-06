import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import { schedule, validate, type ScheduledTask } from "node-cron";
import { env } from "../../config/env.js";
import { logger } from "../../utils/logger/index.js";
import { enqueueAttendanceDate } from "./queue.js";

dayjs.extend(utc);
dayjs.extend(timezone);

let attendanceTask: ScheduledTask | null = null;
let isEnqueuing = false;

const enqueueLookbackDates = async (): Promise<void> => {
  if (isEnqueuing) {
    logger.warn("Attendance scheduler skipped; previous run is still enqueuing");
    return;
  }

  isEnqueuing = true;

  try {
    const today = dayjs().tz(env.ATTENDANCE_TIMEZONE).startOf("day");
    const lookbackDays = Math.max(1, Math.trunc(env.ATTENDANCE_LOOKBACK_DAYS));

    for (let offset = lookbackDays; offset >= 1; offset -= 1) {
      const date = today.subtract(offset, "day").format("YYYY-MM-DD");

      await enqueueAttendanceDate({
        date,
        reason: "scheduled",
      });
    }
  } catch (error: unknown) {
    logger.error("Attendance scheduler failed to enqueue jobs", {
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    isEnqueuing = false;
  }
};

export const startAttendanceScheduler = (): void => {
  if (attendanceTask) {
    return;
  }

  if (!validate(env.ATTENDANCE_CRON)) {
    logger.error("Attendance scheduler not started; invalid cron expression", {
      cron: env.ATTENDANCE_CRON,
    });
    return;
  }

  attendanceTask = schedule(
    env.ATTENDANCE_CRON,
    () => {
      void enqueueLookbackDates();
    },
    {
      timezone: env.ATTENDANCE_TIMEZONE,
      noOverlap: true,
      unref: true,
      name: "attendance-auto-processing",
    },
  );

  attendanceTask.on("execution:failed", (context) => {
    logger.error("Attendance scheduler execution failed", {
      error: context.error?.message,
    });
  });

  logger.info("Attendance scheduler started", {
    cron: env.ATTENDANCE_CRON,
    timezone: env.ATTENDANCE_TIMEZONE,
    lookbackDays: env.ATTENDANCE_LOOKBACK_DAYS,
    nextRun: attendanceTask.getNextRun()?.toISOString() ?? null,
  });
};

export const stopAttendanceScheduler = async (): Promise<void> => {
  if (!attendanceTask) {
    return;
  }

  await attendanceTask.stop();
  await attendanceTask.destroy();
  attendanceTask = null;
  logger.info("Attendance scheduler stopped");
};
