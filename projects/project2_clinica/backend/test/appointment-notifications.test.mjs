import test, { after } from "node:test";
import assert from "node:assert";
import { AppointmentNotificationService } from "../dist/modules/appointment/notification.service.js";
import { prisma } from "../dist/config/prisma.js";

after(async () => {
  await prisma.$disconnect().catch(() => {});
});

function makeAppointment(overrides = {}) {
  return {
    id: "appointment-1",
    startsAt: new Date("2026-11-02T11:00:00.000Z"),
    endsAt: new Date("2026-11-02T11:30:00.000Z"),
    status: "BOOKED",
    notes: "<b>First visit</b> & follow-up",
    priceAtBooking: "350.00",
    durationMinutesAtBooking: 30,
    serviceNameSnapshot: "Initial Consultation",
    doctorDisplayNameSnapshot: "Dr. Karim Fouad",
    patient: { name: "Test <Patient>", email: "patient@example.com", role: "PATIENT" },
    doctor: { user: { name: "Dr. Karim Fouad" } },
    doctorService: { clinicService: { name: "Initial Consultation" } },
    ...overrides,
  };
}

function makeDb(appointments) {
  const calls = { findMany: [], findUnique: [], updateMany: [] };
  return {
    calls,
    db: {
      appointment: {
        findMany: async (args) => {
          calls.findMany.push(args);
          return appointments;
        },
        findUnique: async (args) => {
          calls.findUnique.push(args);
          return appointments.find((a) => a.id === args.where.id) ?? null;
        },
        updateMany: async (args) => {
          calls.updateMany.push(args);
          return { count: 1 };
        },
      },
    },
  };
}

test("reminder run sends once, updates reminderSent, and escapes HTML", async () => {
  const appointment = makeAppointment();
  const { db, calls } = makeDb([appointment]);
  const sent = [];
  const service = new AppointmentNotificationService(db, async (message) => {
    sent.push(message);
    return true;
  }, true);

  const now = new Date("2026-11-02T08:00:00.000Z");
  const result = await service.sendDueReminders(now);

  assert.equal(result.matched, 1);
  assert.equal(result.sent, 1);
  assert.equal(result.failed, 0);
  assert.equal(result.skipped, false);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, "patient@example.com");
  assert.match(sent[0].subject, /Appointment reminder/);
  assert.match(sent[0].text, /Initial Consultation/);
  assert.match(sent[0].text, /Dr\. Karim Fouad/);
  assert.match(sent[0].text, /Appointment ID: appointment-1/);
  assert.match(sent[0].html, /&lt;b&gt;First visit&lt;\/b&gt; &amp; follow-up/);
  assert.match(sent[0].html, /Test &lt;Patient&gt;/);

  const expectedWindowEnd = new Date(now);
  expectedWindowEnd.setDate(expectedWindowEnd.getDate() + 1);
  expectedWindowEnd.setHours(23, 59, 59, 999);

  assert.equal(calls.findMany.length, 1);
  assert.equal(calls.findMany[0].where.status, "BOOKED");
  assert.equal(calls.findMany[0].where.reminderSent, false);
  assert.deepEqual(calls.findMany[0].where.patient, { role: "PATIENT" });
  assert.equal(calls.findMany[0].where.startsAt.gte.getTime(), now.getTime());
  assert.equal(calls.findMany[0].where.startsAt.lte.getTime(), expectedWindowEnd.getTime());
  assert.deepEqual(calls.updateMany, [
    { where: { id: "appointment-1", reminderSent: false }, data: { reminderSent: true } },
  ]);
});

test("reminder is not marked sent when email delivery fails", async () => {
  const { db, calls } = makeDb([makeAppointment()]);
  const service = new AppointmentNotificationService(db, async () => false, true);

  const result = await service.sendDueReminders(new Date("2026-11-02T08:00:00.000Z"));

  assert.equal(result.matched, 1);
  assert.equal(result.sent, 0);
  assert.equal(result.failed, 1);
  assert.equal(calls.updateMany.length, 0);
});

test("reminder run skips without querying when email is not configured", async () => {
  const db = {
    appointment: {
      findMany: async () => {
        throw new Error("findMany should not be called");
      },
      updateMany: async () => {
        throw new Error("updateMany should not be called");
      },
    },
  };
  const service = new AppointmentNotificationService(db, async () => true, false);

  const result = await service.sendDueReminders(new Date("2026-11-02T08:00:00.000Z"));

  assert.equal(result.skipped, true);
  assert.equal(result.matched, 0);
  assert.equal(result.sent, 0);
});

test("booking confirmation sends the appointment snapshot details", async () => {
  const appointment = makeAppointment();
  const { db, calls } = makeDb([appointment]);
  const sent = [];
  const service = new AppointmentNotificationService(db, async (message) => {
    sent.push(message);
    return true;
  }, true);

  const result = await service.sendBookingConfirmation(appointment.id);

  assert.equal(result, true);
  assert.equal(calls.findUnique.length, 1);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, "patient@example.com");
  assert.match(sent[0].subject, /Appointment confirmed/);
  assert.match(sent[0].text, /Initial Consultation/);
  assert.match(sent[0].html, /Appointment confirmed/);
});

test("booking confirmation returns false for a missing appointment", async () => {
  const { db } = makeDb([]);
  let mails = 0;
  const service = new AppointmentNotificationService(db, async () => {
    mails += 1;
    return true;
  }, true);

  const result = await service.sendBookingConfirmation("missing-id");

  assert.equal(result, false);
  assert.equal(mails, 0);
});

test("booking confirmation is never sent to a non-patient account", async () => {
  const appointment = makeAppointment({
    patient: { name: "Clinic Admin", email: "admin@clinica.com", role: "ADMIN" },
  });
  const { db } = makeDb([appointment]);
  let mails = 0;
  const service = new AppointmentNotificationService(db, async () => {
    mails += 1;
    return true;
  }, true);

  const result = await service.sendBookingConfirmation(appointment.id);

  assert.equal(result, false);
  assert.equal(mails, 0);
});
