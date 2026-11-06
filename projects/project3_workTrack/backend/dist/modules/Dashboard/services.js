import { EEmployeeStatus, ERole } from "@prisma/client";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import { env } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";
import { ForbiddenError } from "../../shared/errors.js";
import { LeaveService } from "../Leaves/services.js";
dayjs.extend(utc);
dayjs.extend(timezone);
const createStats = () => ({
    totalRecords: 0,
    present: 0,
    late: 0,
    absent: 0,
    halfDay: 0,
    onLeave: 0,
    totalWorkingMinutes: 0,
    totalOvertimeMinutes: 0,
    totalLateMinutes: 0,
    totalEarlyLeaveMinutes: 0,
});
const addGroupToStats = (stats, group) => {
    const count = group._count._all;
    stats.totalRecords += count;
    stats.totalWorkingMinutes += group._sum.workingMinutes ?? 0;
    stats.totalOvertimeMinutes += group._sum.overtimeMinutes ?? 0;
    stats.totalLateMinutes += group._sum.lateMinutes ?? 0;
    stats.totalEarlyLeaveMinutes += group._sum.earlyLeaveMinutes ?? 0;
    switch (group.status) {
        case "PRESENT":
            stats.present += count;
            break;
        case "LATE":
            stats.late += count;
            break;
        case "ABSENT":
            stats.absent += count;
            break;
        case "HALF_DAY":
            stats.halfDay += count;
            break;
        case "ON_LEAVE":
            stats.onLeave += count;
            break;
    }
};
const percentage = (value, total) => {
    if (total === 0) {
        return 0;
    }
    return Number(((value / total) * 100).toFixed(2));
};
const finalizeStats = (stats) => {
    const attended = stats.present + stats.late + stats.halfDay;
    return {
        totalRecords: stats.totalRecords,
        present: stats.present,
        late: stats.late,
        absent: stats.absent,
        halfDay: stats.halfDay,
        onLeave: stats.onLeave,
        attendanceRate: percentage(attended, stats.totalRecords),
        absenceRate: percentage(stats.absent, stats.totalRecords),
        lateRate: percentage(stats.late, stats.totalRecords),
        averageWorkingMinutes: attended > 0 ? Math.round(stats.totalWorkingMinutes / attended) : 0,
        totalWorkingMinutes: stats.totalWorkingMinutes,
        totalOvertimeMinutes: stats.totalOvertimeMinutes,
        totalLateMinutes: stats.totalLateMinutes,
        totalEarlyLeaveMinutes: stats.totalEarlyLeaveMinutes,
    };
};
const startOfUtcDay = (date) => dayjs.utc(date).startOf("day").toDate();
const addUtcDays = (date, days) => dayjs.utc(date).add(days, "day").toDate();
const formatDate = (date) => dayjs.utc(date).format("YYYY-MM-DD");
const getBusinessToday = () => {
    const today = dayjs().tz(env.APP_TIMEZONE).format("YYYY-MM-DD");
    return dayjs.utc(today).startOf("day").toDate();
};
const resolvePeriod = (query) => {
    const today = getBusinessToday();
    const anchor = query.to ? startOfUtcDay(query.to) : today;
    const from = query.from
        ? startOfUtcDay(query.from)
        : dayjs.utc(anchor).startOf("month").toDate();
    const to = query.to ? startOfUtcDay(query.to) : today;
    return { from, to };
};
const buildEmployeeWhere = (query) => {
    const where = {};
    if (query.departmentId) {
        where.departmentId = query.departmentId;
    }
    if (query.employeeId) {
        where.id = query.employeeId;
    }
    return where;
};
const buildAttendanceWhere = (query, from, to) => {
    const where = {
        date: { gte: from, lte: to },
    };
    if (query.employeeId) {
        where.employeeId = query.employeeId;
    }
    if (query.departmentId) {
        where.employee = { is: { departmentId: query.departmentId } };
    }
    return where;
};
const buildTrend = (from, to, groups) => {
    const counts = new Map();
    for (const group of groups) {
        const key = formatDate(group.date);
        const current = counts.get(key) ?? {
            totalRecords: 0,
            present: 0,
            late: 0,
            absent: 0,
            halfDay: 0,
            onLeave: 0,
        };
        current.totalRecords += group._count._all;
        switch (group.status) {
            case "PRESENT":
                current.present += group._count._all;
                break;
            case "LATE":
                current.late += group._count._all;
                break;
            case "ABSENT":
                current.absent += group._count._all;
                break;
            case "HALF_DAY":
                current.halfDay += group._count._all;
                break;
            case "ON_LEAVE":
                current.onLeave += group._count._all;
                break;
        }
        counts.set(key, current);
    }
    const points = [];
    for (let cursor = from; cursor.getTime() <= to.getTime(); cursor = addUtcDays(cursor, 1)) {
        const key = formatDate(cursor);
        const current = counts.get(key) ?? {
            totalRecords: 0,
            present: 0,
            late: 0,
            absent: 0,
            halfDay: 0,
            onLeave: 0,
        };
        const attended = current.present + current.late + current.halfDay;
        points.push({
            date: key,
            ...current,
            attendanceRate: percentage(attended, current.totalRecords),
        });
    }
    return points;
};
const buildLeaveScope = (query) => {
    const conditions = [{ scope: "ALL" }];
    if (query.departmentId) {
        conditions.push({ scope: "DEPARTMENT", departmentId: query.departmentId });
    }
    if (query.employeeId) {
        conditions.push({ scope: "EMPLOYEE", employeeId: query.employeeId });
    }
    return conditions;
};
const scopeQueryForActor = (query, actor) => {
    if (!actor || actor.role !== ERole.MANAGER) {
        return query;
    }
    if (!actor.departmentId) {
        throw new ForbiddenError("Manager is not assigned to a department", "MANAGER_DEPARTMENT_REQUIRED");
    }
    return { ...query, departmentId: actor.departmentId };
};
export class DashboardService {
    leaveService = new LeaveService();
    async getAttendanceStats(where) {
        const groups = await prisma.attendanceRecord.groupBy({
            by: ["status"],
            where,
            _count: { _all: true },
            _sum: {
                workingMinutes: true,
                lateMinutes: true,
                earlyLeaveMinutes: true,
                overtimeMinutes: true,
            },
        });
        const stats = createStats();
        for (const group of groups) {
            addGroupToStats(stats, group);
        }
        return finalizeStats(stats);
    }
    async getWorkforce(employeeWhere, query) {
        const [groups, totalDepartments, totalShifts] = await Promise.all([
            prisma.employee.groupBy({
                by: ["status"],
                where: employeeWhere,
                _count: { _all: true },
            }),
            prisma.department.count({
                where: query.departmentId
                    ? { id: query.departmentId }
                    : query.employeeId
                        ? { employees: { some: { id: query.employeeId } } }
                        : {},
            }),
            prisma.shift.count(),
        ]);
        let totalEmployees = 0;
        let activeEmployees = 0;
        let inactiveEmployees = 0;
        for (const group of groups) {
            totalEmployees += group._count._all;
            if (group.status === EEmployeeStatus.ACTIVE) {
                activeEmployees += group._count._all;
            }
            else {
                inactiveEmployees += group._count._all;
            }
        }
        return {
            totalEmployees,
            activeEmployees,
            inactiveEmployees,
            totalDepartments,
            totalShifts,
        };
    }
    async getRecentAuditLogs(actor) {
        const where = {};
        if (actor?.role === ERole.MANAGER) {
            if (!actor.departmentId) {
                return [];
            }
            where.user = { is: { departmentId: actor.departmentId } };
        }
        return prisma.auditLog.findMany({
            where,
            take: 5,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                action: true,
                entity: true,
                entityId: true,
                details: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async getActiveLeaves(query) {
        const scopeConditions = buildLeaveScope(query);
        const hasScopeFilter = Boolean(query.departmentId || query.employeeId);
        return prisma.leave.count({
            where: {
                isActive: true,
                ...(hasScopeFilter ? { AND: [{ OR: scopeConditions }] } : {}),
            },
        });
    }
    async getLeaveSummary(query, today) {
        const [activeLeaves, calendar] = await Promise.all([
            this.getActiveLeaves(query),
            this.leaveService.calendar({
                from: today,
                to: today,
                ...(query.employeeId ? { employeeId: query.employeeId } : {}),
                ...(query.departmentId ? { departmentId: query.departmentId } : {}),
            }),
        ]);
        return {
            activeLeaves,
            todayLeaves: calendar.days.length,
        };
    }
    async getSummary(query, actor) {
        const scopedQuery = scopeQueryForActor(query, actor);
        const { from, to } = resolvePeriod(scopedQuery);
        const today = getBusinessToday();
        const employeeWhere = buildEmployeeWhere(scopedQuery);
        const attendanceWhere = buildAttendanceWhere(scopedQuery, from, to);
        const todayWhere = buildAttendanceWhere(scopedQuery, today, today);
        const [workforce, attendance, todayStats, trendGroups, leaves, recentAuditLogs,] = await Promise.all([
            this.getWorkforce(employeeWhere, scopedQuery),
            this.getAttendanceStats(attendanceWhere),
            this.getAttendanceStats(todayWhere),
            prisma.attendanceRecord.groupBy({
                by: ["date", "status"],
                where: attendanceWhere,
                _count: { _all: true },
            }),
            this.getLeaveSummary(scopedQuery, today),
            this.getRecentAuditLogs(actor),
        ]);
        return {
            generatedAt: new Date().toISOString(),
            period: { from: formatDate(from), to: formatDate(to) },
            filters: {
                departmentId: scopedQuery.departmentId ?? null,
                employeeId: scopedQuery.employeeId ?? null,
            },
            workforce,
            attendance,
            today: {
                date: formatDate(today),
                ...todayStats,
            },
            leaves,
            trend: buildTrend(from, to, trendGroups),
            recentAuditLogs,
        };
    }
    async getHrKpiReport(query, actor) {
        const scopedQuery = scopeQueryForActor(query, actor);
        const { from, to } = resolvePeriod(scopedQuery);
        const employeeWhere = buildEmployeeWhere(scopedQuery);
        const attendanceWhere = buildAttendanceWhere(scopedQuery, from, to);
        const [employeeStatusGroups, employeeCountGroups, trendGroups, workforce, activeLeaves,] = await Promise.all([
            prisma.attendanceRecord.groupBy({
                by: ["employeeId", "status"],
                where: attendanceWhere,
                _count: { _all: true },
                _sum: {
                    workingMinutes: true,
                    lateMinutes: true,
                    earlyLeaveMinutes: true,
                    overtimeMinutes: true,
                },
            }),
            prisma.employee.groupBy({
                by: ["departmentId"],
                where: employeeWhere,
                _count: { _all: true },
            }),
            prisma.attendanceRecord.groupBy({
                by: ["date", "status"],
                where: attendanceWhere,
                _count: { _all: true },
            }),
            this.getWorkforce(employeeWhere, scopedQuery),
            this.getActiveLeaves(scopedQuery),
        ]);
        const employeeIds = [
            ...new Set(employeeStatusGroups.map((group) => group.employeeId)),
        ];
        const departmentIds = new Set(employeeCountGroups.map((group) => group.departmentId));
        if (scopedQuery.departmentId) {
            departmentIds.add(scopedQuery.departmentId);
        }
        const [employees, departments] = await Promise.all([
            prisma.employee.findMany({
                where: { id: { in: employeeIds } },
                select: {
                    id: true,
                    employeeCode: true,
                    firstName: true,
                    lastName: true,
                    departmentId: true,
                    department: { select: { id: true, name: true } },
                },
            }),
            prisma.department.findMany({
                where: { id: { in: [...departmentIds] } },
                select: { id: true, name: true },
            }),
        ]);
        const employeeMap = new Map(employees.map((employee) => [employee.id, employee]));
        const departmentMap = new Map(departments.map((department) => [department.id, department]));
        const departmentStats = new Map();
        for (const department of departments) {
            departmentStats.set(department.id, {
                ...createStats(),
                employees: 0,
            });
        }
        for (const group of employeeCountGroups) {
            const entry = departmentStats.get(group.departmentId);
            if (entry) {
                entry.employees = group._count._all;
            }
        }
        const totalsStats = createStats();
        const employeeStats = new Map();
        for (const group of employeeStatusGroups) {
            addGroupToStats(totalsStats, group);
            const employee = employeeMap.get(group.employeeId);
            const employeeEntry = employeeStats.get(group.employeeId) ?? createStats();
            addGroupToStats(employeeEntry, group);
            employeeStats.set(group.employeeId, employeeEntry);
            if (employee) {
                const departmentEntry = departmentStats.get(employee.departmentId);
                if (departmentEntry) {
                    addGroupToStats(departmentEntry, group);
                }
            }
        }
        const byDepartment = [...departmentStats.entries()]
            .map(([departmentId, stats]) => ({
            departmentId,
            departmentName: departmentMap.get(departmentId)?.name ?? "Unknown",
            employees: stats.employees,
            ...finalizeStats(stats),
        }))
            .sort((left, right) => left.departmentName.localeCompare(right.departmentName));
        const topLateEmployees = [...employeeStats.entries()]
            .filter(([, stats]) => stats.late > 0)
            .map(([employeeId, stats]) => {
            const employee = employeeMap.get(employeeId);
            return {
                employeeId,
                employeeCode: employee?.employeeCode ?? "Unknown",
                employeeName: employee
                    ? `${employee.firstName} ${employee.lastName}`.trim()
                    : "Unknown",
                departmentId: employee?.departmentId ?? "",
                departmentName: employee?.department.name ?? "Unknown",
                lateDays: stats.late,
                lateMinutes: stats.totalLateMinutes,
                absentDays: stats.absent,
            };
        })
            .sort((left, right) => right.lateMinutes - left.lateMinutes ||
            right.lateDays - left.lateDays ||
            left.employeeName.localeCompare(right.employeeName))
            .slice(0, 10);
        return {
            generatedAt: new Date().toISOString(),
            period: { from: formatDate(from), to: formatDate(to) },
            filters: {
                departmentId: scopedQuery.departmentId ?? null,
                employeeId: scopedQuery.employeeId ?? null,
            },
            workforce,
            totals: finalizeStats(totalsStats),
            byDepartment,
            topLateEmployees,
            trend: buildTrend(from, to, trendGroups),
            leaves: { activeLeaves },
        };
    }
}
//# sourceMappingURL=services.js.map