import redis, { isRedisReady } from "../../config/redis.js";
import { env } from "../../config/env.js";
import { logger } from "../../utils/logger/index.js";
import { closeAttendanceQueue } from "./queue.js";
import { startAttendanceScheduler, stopAttendanceScheduler } from "./scheduler.js";
import { startAttendanceWorker, stopAttendanceWorker } from "./worker.js";
export { processAttendanceDate } from "./processor.js";
export { enqueueAttendanceDate } from "./queue.js";
let readyListenerAttached = false;
const startAutomationComponents = () => {
    startAttendanceWorker();
    if (env.ATTENDANCE_AUTO_ENABLED) {
        startAttendanceScheduler();
    }
    else {
        logger.info("Attendance scheduler disabled by configuration");
    }
};
export const startAttendanceAutomation = () => {
    if (!readyListenerAttached) {
        readyListenerAttached = true;
        redis.on("ready", () => {
            logger.info("Redis ready; ensuring attendance automation is running");
            startAutomationComponents();
        });
    }
    if (!isRedisReady()) {
        logger.warn("Attendance automation will start when Redis becomes available");
        return;
    }
    startAutomationComponents();
};
export const stopAttendanceAutomation = async () => {
    await stopAttendanceScheduler();
    await stopAttendanceWorker();
    await closeAttendanceQueue();
};
//# sourceMappingURL=index.js.map