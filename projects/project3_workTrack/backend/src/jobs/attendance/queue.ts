import { Queue } from "bullmq";
import { env } from "../../config/env.js";
import { logger } from "../../utils/logger/index.js";
import type { IAttendanceProcessJobData } from "./types.js";

export const ATTENDANCE_QUEUE_NAME = "attendance-processing";

export const attendanceConnection = {
  url: env.REDIS_URL,
  maxRetriesPerRequest: null,
} as const;

export const attendanceJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 5000,
  },
  removeOnComplete: {
    age: 24 * 60 * 60,
    count: 100,
  },
  removeOnFail: {
    age: 7 * 24 * 60 * 60,
    count: 500,
  },
} as const;

let attendanceQueue: Queue<IAttendanceProcessJobData> | null = null;

export const getAttendanceQueue = (): Queue<IAttendanceProcessJobData> => {
  if (!attendanceQueue) {
    attendanceQueue = new Queue<IAttendanceProcessJobData>(
      ATTENDANCE_QUEUE_NAME,
      {
        connection: attendanceConnection,
        defaultJobOptions: attendanceJobOptions,
      },
    );

    attendanceQueue.on("error", (error: Error) => {
      logger.error("Attendance queue error", { error: error.message });
    });
  }

  return attendanceQueue;
};

export const enqueueAttendanceDate = async (
  data: IAttendanceProcessJobData,
): Promise<string> => {
  const queue = getAttendanceQueue();
  const job = await queue.add("process-date", data);

  logger.info("Attendance job enqueued", {
    jobId: job.id,
    date: data.date,
    reason: data.reason ?? "manual",
    employeeCount: data.employeeIds?.length ?? 0,
  });

  return String(job.id);
};

export const closeAttendanceQueue = async (): Promise<void> => {
  if (!attendanceQueue) {
    return;
  }

  await attendanceQueue.close();
  attendanceQueue = null;
};
