import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";
import { isEmailConfigured, sendEmail, type IEmailMessage } from "../../config/email.js";
import { logger } from "../../utils/logger/index.js";

const selectNotification = {
  id: true,
  startsAt: true,
  endsAt: true,
  status: true,
  notes: true,
  priceAtBooking: true,
  durationMinutesAtBooking: true,
  serviceNameSnapshot: true,
  doctorDisplayNameSnapshot: true,
  patient: { select: { name: true, email: true } },
  doctor: { select: { user: { select: { name: true } } } },
  doctorService: { select: { clinicService: { select: { name: true } } } },
} as const;

type AppointmentNotificationRecord = {
  id: string;
  startsAt: Date;
  endsAt: Date;
  status: string;
  notes: string | null;
  priceAtBooking: unknown;
  durationMinutesAtBooking: number;
  serviceNameSnapshot: string | null;
  doctorDisplayNameSnapshot: string | null;
  patient: { name: string; email: string };
  doctor: { user: { name: string } };
  doctorService: { clinicService: { name: string } };
};

export interface IReminderRunResult {
  windowStart: string;
  windowEnd: string;
  matched: number;
  sent: number;
  failed: number;
  skipped: boolean;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: env.APP_TIMEZONE,
    timeZoneName: "short",
  }).format(date);
}

function statusLabel(status: string): string {
  if (status === "BOOKED") return "Confirmed";
  if (status === "COMPLETED") return "Completed";
  if (status === "CANCELED") return "Cancelled";
  return status;
}

function appointmentDetails(appointment: AppointmentNotificationRecord) {
  const service = appointment.serviceNameSnapshot ?? appointment.doctorService.clinicService.name;
  const doctor = appointment.doctorDisplayNameSnapshot ?? appointment.doctor.user.name;

  return {
    service,
    doctor,
    startsAt: formatDateTime(appointment.startsAt),
    endsAt: formatDateTime(appointment.endsAt),
    duration: `${appointment.durationMinutesAtBooking} minutes`,
    status: statusLabel(appointment.status),
    price: String(appointment.priceAtBooking),
    id: appointment.id,
    notes: appointment.notes,
    timezone: env.APP_TIMEZONE,
  };
}

function buildDetailsHtml(appointment: AppointmentNotificationRecord): string {
  const details = appointmentDetails(appointment);
  const rows = [
    ["Service", details.service],
    ["Doctor", details.doctor],
    ["Date & time", details.startsAt],
    ["Ends at", details.endsAt],
    ["Duration", details.duration],
    ["Status", details.status],
    ["Price", details.price],
    ["Appointment ID", details.id],
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;color:#64748b;font-size:14px;border-bottom:1px solid #e2e8f0;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;color:#0f172a;font-size:14px;font-weight:600;border-bottom:1px solid #e2e8f0;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  const notesHtml = details.notes
    ? `<p style="margin:20px 0 0;color:#475569;font-size:14px;"><strong>Notes:</strong> ${escapeHtml(details.notes)}</p>`
    : "";

  return `
    <table role="presentation" style="width:100%;border-collapse:collapse;margin-top:20px;">
      ${tableRows}
    </table>
    ${notesHtml}
    <p style="margin:20px 0 0;color:#64748b;font-size:12px;">All times are shown in ${escapeHtml(details.timezone)}.</p>`;
}

function buildText(appointment: AppointmentNotificationRecord, heading: string): string {
  const details = appointmentDetails(appointment);
  const lines = [
    `${env.APP_NAME} - ${heading}`,
    "",
    `Hello ${appointment.patient.name},`,
    "",
    `Service: ${details.service}`,
    `Doctor: ${details.doctor}`,
    `Date & time: ${details.startsAt}`,
    `Ends at: ${details.endsAt}`,
    `Duration: ${details.duration}`,
    `Status: ${details.status}`,
    `Price: ${details.price}`,
    `Appointment ID: ${details.id}`,
  ];

  if (details.notes) lines.push(`Notes: ${details.notes}`);
  lines.push("", `All times are shown in ${details.timezone}.`);
  return lines.join("\n");
}

function buildHtml(appointment: AppointmentNotificationRecord, heading: string, intro: string): string {
  return `
    <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:#0f766e;padding:24px;color:#ffffff;">
          <h1 style="margin:0;font-size:22px;">${escapeHtml(env.APP_NAME)}</h1>
          <p style="margin:8px 0 0;font-size:15px;">${escapeHtml(heading)}</p>
        </div>
        <div style="padding:24px;">
          <p style="margin:0;color:#0f172a;font-size:16px;">Hello ${escapeHtml(appointment.patient.name)},</p>
          <p style="margin:12px 0 0;color:#475569;font-size:14px;line-height:1.6;">${escapeHtml(intro)}</p>
          ${buildDetailsHtml(appointment)}
          <p style="margin:24px 0 0;color:#64748b;font-size:12px;">If you cannot attend, please cancel your appointment as soon as possible.</p>
        </div>
      </div>
    </div>`;
}

export class AppointmentNotificationService {
  constructor(
    private readonly db: typeof prisma = prisma,
    private readonly mailer: (message: IEmailMessage) => Promise<boolean> = sendEmail,
    private readonly emailConfigured: boolean = isEmailConfigured,
  ) {}

  async sendBookingConfirmation(appointmentId: string): Promise<boolean> {
    try {
      const appointment = await this.db.appointment.findUnique({
        where: { id: appointmentId },
        select: selectNotification,
      });

      if (!appointment) {
        logger.warn("Booking confirmation skipped: appointment not found", { appointmentId });
        return false;
      }

      const heading = "Appointment confirmed";
      const intro = "Your appointment has been booked successfully. Here are your appointment details:";
      const sent = await this.mailer({
        to: appointment.patient.email,
        subject: `${env.APP_NAME} - ${heading}`,
        text: buildText(appointment, heading),
        html: buildHtml(appointment, heading, intro),
      });

      if (sent) {
        logger.info("Booking confirmation sent", { appointmentId });
      }
      return sent;
    } catch (error: any) {
      logger.error("Booking confirmation failed", {
        appointmentId,
        error: error?.message || "Unknown notification error",
      });
      return false;
    }
  }

  async sendDueReminders(now = new Date()): Promise<IReminderRunResult> {
    const windowEnd = new Date(now);
    windowEnd.setDate(windowEnd.getDate() + 1);
    windowEnd.setHours(23, 59, 59, 999);

    const result: IReminderRunResult = {
      windowStart: now.toISOString(),
      windowEnd: windowEnd.toISOString(),
      matched: 0,
      sent: 0,
      failed: 0,
      skipped: !this.emailConfigured,
    };

    if (result.skipped) {
      logger.warn("Appointment reminders skipped: email is not configured");
      return result;
    }

    const appointments = await this.db.appointment.findMany({
      where: {
        status: "BOOKED",
        reminderSent: false,
        startsAt: { gte: now, lte: windowEnd },
      },
      orderBy: { startsAt: "asc" },
      select: selectNotification,
    });

    result.matched = appointments.length;

    for (const appointment of appointments) {
      const heading = "Appointment reminder";
      const intro = "This is a reminder for your upcoming appointment. Please find the details below:";
      const sent = await this.mailer({
        to: appointment.patient.email,
        subject: `${env.APP_NAME} - ${heading}`,
        text: buildText(appointment, heading),
        html: buildHtml(appointment, heading, intro),
      });

      if (!sent) {
        result.failed += 1;
        continue;
      }

      const updated = await this.db.appointment.updateMany({
        where: { id: appointment.id, reminderSent: false },
        data: { reminderSent: true },
      });

      if (updated.count === 1) {
        result.sent += 1;
      } else {
        result.failed += 1;
        logger.warn("Appointment reminder sent but reminderSent was not updated", {
          appointmentId: appointment.id,
        });
      }
    }

    logger.info("Appointment reminder run completed", result);
    return result;
  }
}
