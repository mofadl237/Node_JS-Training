import cron from "node-cron";
import { env } from "../config/env.js";
import { isEmailConfigured } from "../config/email.js";
import { AppointmentNotificationService } from "../modules/appointment/notification.service.js";
import { logger } from "../utils/logger/index.js";
const notifications = new AppointmentNotificationService();
let isRunning = false;
export async function runAppointmentReminders(now = new Date()) {
    if (isRunning) {
        logger.warn("Appointment reminder run skipped: previous run is still in progress");
        return null;
    }
    isRunning = true;
    try {
        return await notifications.sendDueReminders(now);
    }
    catch (error) {
        logger.error("Appointment reminder run failed", {
            error: error?.message || "Unknown reminder error",
        });
        return null;
    }
    finally {
        isRunning = false;
    }
}
export function startAppointmentReminderJob() {
    if (!isEmailConfigured) {
        logger.warn("Appointment reminder job not started: email is not configured");
        return null;
    }
    if (!cron.validate(env.REMINDER_CRON)) {
        logger.error("Appointment reminder job not started: invalid cron expression", {
            expression: env.REMINDER_CRON,
        });
        return null;
    }
    let task;
    try {
        task = cron.schedule(env.REMINDER_CRON, async () => {
            await runAppointmentReminders();
        }, {
            name: "appointment-reminders",
            timezone: env.REMINDER_TIMEZONE,
            noOverlap: true,
            unref: true,
        });
    }
    catch (error) {
        logger.error("Appointment reminder job not started", {
            error: error?.message || "Unknown cron scheduling error",
        });
        return null;
    }
    logger.info("Appointment reminder job scheduled", {
        expression: env.REMINDER_CRON,
        timezone: env.REMINDER_TIMEZONE,
    });
    return task;
}
export async function stopAppointmentReminderJob(task) {
    if (!task)
        return;
    await task.stop();
    logger.info("Appointment reminder job stopped");
}
//# sourceMappingURL=appointmentReminder.job.js.map