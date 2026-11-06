import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);
dayjs.extend(timezone);
const minutesBetween = (from, to) => Math.max(0, Math.round(to.diff(from, "minute", true)));
export const calculateWorkingMinutes = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) {
        return 0;
    }
    return minutesBetween(dayjs(checkIn), dayjs(checkOut));
};
export const calculateLateMinutes = (checkIn, shiftStart, graceMinutes) => {
    if (!checkIn) {
        return 0;
    }
    return Math.max(0, minutesBetween(dayjs(shiftStart), dayjs(checkIn)) - Math.max(0, graceMinutes));
};
export const calculateEarlyLeaveMinutes = (checkOut, shiftEnd) => {
    if (!checkOut) {
        return 0;
    }
    return minutesBetween(dayjs(checkOut), dayjs(shiftEnd));
};
export const calculateOvertimeMinutes = (checkOut, shiftEnd, overtimeAfterMinutes) => {
    if (!checkOut) {
        return 0;
    }
    return Math.max(0, minutesBetween(dayjs(shiftEnd), dayjs(checkOut)) -
        Math.max(0, overtimeAfterMinutes));
};
export const calculateAttendanceStatus = (input, workingMinutes, lateMinutes) => {
    const hasCheckIn = Boolean(input.checkIn);
    const hasCheckOut = Boolean(input.checkOut);
    if (!hasCheckIn && !hasCheckOut) {
        return "ABSENT";
    }
    if (!hasCheckIn || !hasCheckOut) {
        return lateMinutes > 0 ? "LATE" : "PRESENT";
    }
    const expectedMinutes = Math.max(0, Math.round(input.expectedHours * 60));
    if (expectedMinutes > 0 && workingMinutes < expectedMinutes / 2) {
        return "HALF_DAY";
    }
    return lateMinutes > 0 ? "LATE" : "PRESENT";
};
export const calculateAttendance = (input) => {
    const workingMinutes = calculateWorkingMinutes(input.checkIn, input.checkOut);
    const lateMinutes = calculateLateMinutes(input.checkIn, input.shiftStart, input.graceMinutes);
    const earlyLeaveMinutes = calculateEarlyLeaveMinutes(input.checkOut, input.shiftEnd);
    const overtimeMinutes = calculateOvertimeMinutes(input.checkOut, input.shiftEnd, input.overtimeAfterMinutes);
    return {
        workingMinutes,
        lateMinutes,
        earlyLeaveMinutes,
        overtimeMinutes,
        status: calculateAttendanceStatus(input, workingMinutes, lateMinutes),
    };
};
export const buildShiftWindow = (date, startTime, endTime, timezoneName) => {
    const start = dayjs.tz(`${date} ${startTime}`, "YYYY-MM-DD HH:mm", timezoneName);
    let end = dayjs.tz(`${date} ${endTime}`, "YYYY-MM-DD HH:mm", timezoneName);
    if (!start.isValid() || !end.isValid()) {
        throw new Error(`Invalid shift time window for ${date} ${startTime}-${endTime}`);
    }
    if (!end.isAfter(start)) {
        end = end.add(1, "day");
    }
    return {
        start: start.toDate(),
        end: end.toDate(),
    };
};
//# sourceMappingURL=calculations.js.map