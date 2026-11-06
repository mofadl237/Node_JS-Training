import { Worker } from "bullmq";
import { env } from "../../config/env.js";
import { logger } from "../../utils/logger/index.js";
import { processAttendanceDate } from "./processor.js";
import { ATTENDANCE_QUEUE_NAME, attendanceConnection } from "./queue.js";
let attendanceWorker = null;
const handleJob = async (job) => {
    logger.info("Attendance job started", {
        jobId: job.id,
        date: job.data.date,
        reason: job.data.reason ?? "manual",
        employeeCount: job.data.employeeIds?.length ?? 0,
    });
    const result = await processAttendanceDate(job.data.date, job.data.employeeIds);
    logger.info("Attendance job completed", {
        jobId: job.id,
        ...result,
    });
    return result;
};
export const startAttendanceWorker = () => {
    if (attendanceWorker) {
        return attendanceWorker;
    }
    attendanceWorker = new Worker(ATTENDANCE_QUEUE_NAME, handleJob, {
        connection: attendanceConnection,
        concurrency: env.ATTENDANCE_WORKER_CONCURRENCY,
        lockDuration: 120000,
    });
    attendanceWorker.on("failed", (job, error) => {
        logger.error("Attendance job failed", {
            jobId: job?.id,
            date: job?.data.date,
            attemptsMade: job?.attemptsMade,
            error: error.message,
        });
    });
    attendanceWorker.on("error", (error) => {
        logger.error("Attendance worker error", { error: error.message });
    });
    logger.info("Attendance worker started", {
        queue: ATTENDANCE_QUEUE_NAME,
        concurrency: env.ATTENDANCE_WORKER_CONCURRENCY,
    });
    return attendanceWorker;
};
export const stopAttendanceWorker = async () => {
    if (!attendanceWorker) {
        return;
    }
    await attendanceWorker.close();
    attendanceWorker = null;
    logger.info("Attendance worker stopped");
};
//# sourceMappingURL=worker.js.map