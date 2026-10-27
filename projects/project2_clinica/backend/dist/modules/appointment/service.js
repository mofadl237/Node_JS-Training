import { prisma } from "../../config/prisma.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
const selectAppt = {
    id: true,
    patientId: true,
    doctorId: true,
    doctorServiceId: true,
    startsAt: true,
    endsAt: true,
    status: true,
    priceAtBooking: true,
    durationMinutesAtBooking: true,
    serviceNameSnapshot: true,
    doctorDisplayNameSnapshot: true,
    notes: true,
    reminderSent: true,
    createdAt: true,
    updatedAt: true,
};
const selectApptDetail = {
    ...selectAppt,
    patient: { select: { id: true, name: true, email: true, phone: true } },
    doctor: {
        select: {
            id: true,
            userId: true,
            user: { select: { id: true, name: true, email: true } },
            specialization: { select: { id: true, name: true, slug: true } },
        },
    },
    doctorService: {
        select: {
            id: true,
            durationMinutes: true,
            isActive: true,
            clinicService: { select: { id: true, name: true, slug: true } },
        },
    },
};
function startOfDay(dateStr) {
    return new Date(`${dateStr}T00:00:00`);
}
function endOfDay(dateStr) {
    return new Date(`${dateStr}T23:59:59.999`);
}
export class AppointmentService {
    async getAvailability(query) {
        const dayStart = startOfDay(query.date);
        const dayEnd = endOfDay(query.date);
        if (isNaN(dayStart.getTime()) || isNaN(dayEnd.getTime())) {
            throw new BadRequestError("Invalid date", "BAD_REQUEST");
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dayStart.getTime() < today.getTime()) {
            throw new BadRequestError("Date cannot be in the past", "BAD_REQUEST");
        }
        const ds = await prisma.doctorService.findUnique({
            where: { id: query.doctorServiceId },
            select: {
                id: true,
                doctorId: true,
                durationMinutes: true,
                isActive: true,
                doctor: { select: { id: true, user: { select: { name: true } } } },
            },
        });
        if (!ds || !ds.isActive) {
            throw new NotFoundError("Doctor service not found or inactive", "DOCTOR_SERVICE_NOT_FOUND");
        }
        const availabilities = await prisma.doctorAvailability.findMany({
            where: {
                doctorId: ds.doctorId,
                isActive: true,
                startsAt: { lte: dayEnd },
                endsAt: { gte: dayStart },
            },
            orderBy: { startsAt: "asc" },
        });
        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId: ds.doctorId,
                status: { not: "CANCELED" },
                startsAt: { lte: dayEnd },
                endsAt: { gte: dayStart },
            },
            select: { startsAt: true, endsAt: true },
            orderBy: { startsAt: "asc" },
        });
        const durationMs = ds.durationMinutes * 60000;
        const now = new Date();
        const isToday = dayStart.getTime() === today.getTime();
        const slots = [];
        for (const availability of availabilities) {
            let cursor = new Date(Math.max(availability.startsAt.getTime(), dayStart.getTime()));
            const limit = new Date(Math.min(availability.endsAt.getTime(), dayEnd.getTime()));
            if (isToday && cursor.getTime() < now.getTime()) {
                cursor = new Date(now.getTime() + 1000);
            }
            while (cursor.getTime() + durationMs <= limit.getTime()) {
                const slotEnd = new Date(cursor.getTime() + durationMs);
                if (isToday && slotEnd.getTime() <= now.getTime()) {
                    cursor = new Date(cursor.getTime() + durationMs);
                    continue;
                }
                const isBusy = appointments.some((a) => cursor.getTime() < a.endsAt.getTime() && slotEnd.getTime() > a.startsAt.getTime());
                if (!isBusy) {
                    slots.push({ startsAt: cursor.toISOString(), endsAt: slotEnd.toISOString() });
                }
                cursor = new Date(cursor.getTime() + durationMs);
            }
        }
        return {
            date: query.date,
            doctorServiceId: ds.id,
            doctorId: ds.doctorId,
            doctorName: ds.doctor?.user?.name ?? null,
            durationMinutes: ds.durationMinutes,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            slots,
        };
    }
    async create(dto, auth) {
        const startsAt = new Date(dto.startsAt);
        const now = new Date();
        if (startsAt.getTime() <= now.getTime()) {
            throw new BadRequestError("Appointment start time must be in the future", "APPOINTMENT_IN_PAST");
        }
        const ds = await prisma.doctorService.findUnique({
            where: { id: dto.doctorServiceId },
            select: {
                id: true,
                doctorId: true,
                price: true,
                durationMinutes: true,
                isActive: true,
                clinicService: { select: { name: true, isActive: true } },
                doctor: { select: { user: { select: { name: true } } } },
            },
        });
        if (!ds || !ds.isActive || !ds.clinicService?.isActive) {
            throw new NotFoundError("Doctor service not found or inactive", "DOCTOR_SERVICE_NOT_FOUND");
        }
        const endsAt = new Date(startsAt.getTime() + ds.durationMinutes * 60000);
        const appointment = await prisma.$transaction(async (tx) => {
            await tx.$queryRaw `SELECT id FROM "Doctor" WHERE id = ${ds.doctorId} FOR UPDATE`;
            const availability = await tx.doctorAvailability.findFirst({
                where: {
                    doctorId: ds.doctorId,
                    isActive: true,
                    startsAt: { lte: startsAt },
                    endsAt: { gte: endsAt },
                },
                select: { id: true },
            });
            if (!availability) {
                throw new BadRequestError("Selected time is not fully within the doctor's active availability", "AVAILABILITY_NOT_COVERED");
            }
            return tx.appointment.create({
                data: {
                    patientId: auth.userId,
                    doctorId: ds.doctorId,
                    doctorServiceId: ds.id,
                    startsAt,
                    endsAt,
                    status: "BOOKED",
                    priceAtBooking: ds.price,
                    durationMinutesAtBooking: ds.durationMinutes,
                    serviceNameSnapshot: ds.clinicService?.name ?? null,
                    doctorDisplayNameSnapshot: ds.doctor?.user?.name ?? null,
                    notes: dto.notes?.trim() || null,
                },
                select: selectAppt,
            });
        });
        return appointment;
    }
    async list(query, auth) {
        const where = await this.buildScopedWhere(query, auth);
        if (query.status)
            where.status = query.status;
        if (query.doctorServiceId)
            where.doctorServiceId = query.doctorServiceId;
        if (query.from && query.to) {
            where.startsAt = { lte: new Date(query.to) };
            where.endsAt = { gte: new Date(query.from) };
        }
        else if (query.from) {
            where.startsAt = { gte: new Date(query.from) };
        }
        else if (query.to) {
            where.startsAt = { lte: new Date(query.to) };
        }
        const pagination = resolvePagination(query.page, query.limit);
        const orderBy = { [query.sortBy]: query.sortOrder };
        const [items, total] = await prisma.$transaction([
            prisma.appointment.findMany({
                where,
                select: selectApptDetail,
                orderBy,
                skip: pagination.skip,
                take: pagination.take,
            }),
            prisma.appointment.count({ where }),
        ]);
        return toPaginatedResult(items, total, pagination.page, pagination.limit);
    }
    async getById(id, auth) {
        const appointment = await prisma.appointment.findUnique({
            where: { id },
            select: selectApptDetail,
        });
        if (!appointment) {
            throw new NotFoundError("Appointment not found", "NOT_FOUND");
        }
        this.assertCanAccess(appointment, auth);
        return appointment;
    }
    async cancel(id, auth) {
        const appointment = await prisma.appointment.findUnique({
            where: { id },
            select: { id: true, patientId: true, status: true },
        });
        if (!appointment) {
            throw new NotFoundError("Appointment not found", "NOT_FOUND");
        }
        if (auth.role !== "ADMIN" && appointment.patientId !== auth.userId) {
            throw new ForbiddenError("You cannot cancel this appointment", "FORBIDDEN");
        }
        if (appointment.status === "CANCELED") {
            throw new BadRequestError("Appointment is already canceled", "APPOINTMENT_ALREADY_CANCELED");
        }
        return prisma.appointment.update({
            where: { id },
            data: { status: "CANCELED" },
            select: selectAppt,
        });
    }
    assertCanAccess(appointment, auth) {
        if (auth.role === "ADMIN")
            return;
        if (auth.role === "PATIENT" && appointment.patientId === auth.userId)
            return;
        if (auth.role === "DOCTOR" && appointment.doctor.userId === auth.userId)
            return;
        throw new ForbiddenError("You do not have permission to access this appointment", "FORBIDDEN");
    }
    async buildScopedWhere(query, auth) {
        const where = {};
        if (auth.role === "PATIENT") {
            if (query.patientId && query.patientId !== auth.userId) {
                throw new ForbiddenError("You can only view your own appointments", "FORBIDDEN");
            }
            where.patientId = auth.userId;
        }
        else if (auth.role === "DOCTOR") {
            const doctor = await prisma.doctor.findUnique({
                where: { userId: auth.userId },
                select: { id: true },
            });
            if (!doctor) {
                throw new ForbiddenError("Doctor profile not found", "FORBIDDEN");
            }
            if (query.doctorId && query.doctorId !== doctor.id) {
                throw new ForbiddenError("You can only view your own appointments", "FORBIDDEN");
            }
            where.doctorId = doctor.id;
        }
        else if (auth.role === "ADMIN") {
            if (query.doctorId)
                where.doctorId = query.doctorId;
            if (query.patientId)
                where.patientId = query.patientId;
        }
        else {
            throw new ForbiddenError("You do not have permission to access this resource", "FORBIDDEN");
        }
        return where;
    }
}
//# sourceMappingURL=service.js.map