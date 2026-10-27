import test from "node:test";
import assert from "node:assert";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const PORT = process.env.TEST_PORT || 4150;
const BASE = `http://localhost:${PORT}`;
const DB_URL = process.env.DATABASE_URL;

const pool = new Pool({ connectionString: DB_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

function pad(n) {
  return String(n).padStart(2, "0");
}

function localDateString(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function api(method, path, { token, body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, body: json };
}

async function registerPatient(prefix) {
  const email = `${prefix}.${Date.now()}.${Math.floor(Math.random() * 1e6)}@example.com`;
  const res = await api("POST", "/api/auth/register", {
    body: { name: "Test Patient", email, password: "Password123" },
  });
  assert.equal(res.status, 201, `register failed: ${JSON.stringify(res.body)}`);
  return { token: res.body.data.token, userId: res.body.data.user.id, email };
}

async function availability(doctorServiceId, date) {
  return api("GET", `/api/appointments/availability?doctorServiceId=${doctorServiceId}&date=${date}`);
}

async function book(token, doctorServiceId, startsAt) {
  return api("POST", "/api/appointments", { token, body: { doctorServiceId, startsAt } });
}

async function cancel(token, id) {
  return api("PATCH", `/api/appointments/${id}/cancel`, { token });
}

async function login(email) {
  const res = await api("POST", "/api/auth/login", {
    body: { email, password: process.env.SEED_PASSWORD || "Password123" },
  });
  assert.equal(res.status, 200, `login failed for ${email}: ${JSON.stringify(res.body)}`);
  return res.body.data.token;
}

test("appointment booking rules, availability and concurrency", async (t) => {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const tomorrowStr = localDateString(tomorrow);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const yesterdayStr = localDateString(yesterday);

  const ds = await prisma.doctorService.findFirst({
    where: { isActive: true, clinicService: { isActive: true } },
    select: { id: true, doctorId: true, durationMinutes: true },
  });
  assert.ok(ds, "no active doctor service in DB");

  const dayStart = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 0, 0, 0, 0);
  const dayEnd = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59, 999);
  const availStart = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 0, 0, 0);
  const availEnd = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 13, 0, 0, 0);

  let createdAvailabilityId;
  const patientA = await registerPatient("a");
  const patientB = await registerPatient("b");

  try {
    await prisma.appointment.deleteMany({
      where: { doctorId: ds.doctorId, startsAt: { gte: dayStart }, endsAt: { lte: dayEnd } },
    });
    const createdAvailability = await prisma.doctorAvailability.create({
      data: { doctorId: ds.doctorId, startsAt: availStart, endsAt: availEnd, isActive: true },
    });
    createdAvailabilityId = createdAvailability.id;

    await t.test("rejects past day for availability", async () => {
      const res = await availability(ds.id, yesterdayStr);
      assert.equal(res.status, 400, JSON.stringify(res.body));
      assert.equal(res.body.code, "BAD_REQUEST");
    });

    await t.test("rejects appointment already ended today", async () => {
      const past = new Date(now.getTime() - 5 * 60000);
      const res = await book(patientA.token, ds.id, past.toISOString());
      assert.equal(res.status, 400, JSON.stringify(res.body));
      assert.equal(res.body.code, "APPOINTMENT_IN_PAST");
    });

    const avRes = await availability(ds.id, tomorrowStr);
    assert.equal(avRes.status, 200, JSON.stringify(avRes.body));
    const slots = avRes.body.data.slots;
    assert.ok(slots.length > 2, `expected multiple slots, got ${slots.length}`);

    await t.test("availability slots fit service duration inside working hours", async () => {
      for (const slot of slots) {
        const s = new Date(slot.startsAt);
        const e = new Date(slot.endsAt);
        assert.equal(e.getTime() - s.getTime(), ds.durationMinutes * 60000);
        assert.ok(s >= availStart && e <= availEnd);
      }
    });

    await t.test("rejects start in future but end exceeding working hours", async () => {
      const startsAt = new Date(availEnd.getTime() - 5 * 60000);
      const res = await book(patientA.token, ds.id, startsAt.toISOString());
      assert.equal(res.status, 400, JSON.stringify(res.body));
      assert.equal(res.body.code, "AVAILABILITY_NOT_COVERED");
    });

    const first = slots[0];
    const second = slots[1];

    await t.test("does not expose booked slots and allows adjacent booking", async () => {
      const r1 = await book(patientA.token, ds.id, first.startsAt);
      assert.equal(r1.status, 201, JSON.stringify(r1.body));

      const after = await availability(ds.id, tomorrowStr);
      assert.equal(after.status, 200);
      const overlaps = after.body.data.slots.some((s) => {
        const ss = new Date(s.startsAt).getTime();
        const se = new Date(s.endsAt).getTime();
        return ss < new Date(first.endsAt).getTime() && se > new Date(first.startsAt).getTime();
      });
      assert.equal(overlaps, false, "booked slot must not appear in availability");

      const rAdj = await book(patientB.token, ds.id, first.endsAt === second.startsAt ? second.startsAt : first.endsAt);
      assert.equal(rAdj.status, 201, JSON.stringify(rAdj.body));

      await cancel(patientA.token, r1.body.data.id);
      await cancel(patientB.token, rAdj.body.data.id);
    });

    await t.test("cancel then rebook the same period", async () => {
      const r1 = await book(patientA.token, ds.id, first.startsAt);
      assert.equal(r1.status, 201, JSON.stringify(r1.body));

      const c = await cancel(patientA.token, r1.body.data.id);
      assert.equal(c.status, 200, JSON.stringify(c.body));
      assert.equal(c.body.data.status, "CANCELED");

      const again = await book(patientA.token, ds.id, first.startsAt);
      assert.equal(again.status, 201, JSON.stringify(again.body));
      await cancel(patientA.token, again.body.data.id);
    });

    await t.test("concurrent valid requests: exactly one succeeds and one gets 409", async () => {
      const target = slots[2];
      const [c1, c2] = await Promise.all([
        book(patientA.token, ds.id, target.startsAt),
        book(patientB.token, ds.id, target.startsAt),
      ]);
      const statuses = [c1.status, c2.status].sort();
      assert.deepEqual(statuses, [201, 409], JSON.stringify({ c1: c1.body, c2: c2.body }));
      const conflict = c1.status === 409 ? c1 : c2;
      assert.equal(conflict.body.code, "APPOINTMENT_CONFLICT");

      const winner = c1.status === 201 ? c1 : c2;
      const winnerToken = c1.status === 201 ? patientA.token : patientB.token;
      await cancel(winnerToken, winner.body.data.id);
    });

    await t.test("availability check then another books, our booking gets 409", async () => {
      const target = slots[3];
      const before = await availability(ds.id, tomorrowStr);
      const visible = before.body.data.slots.some((s) => s.startsAt === target.startsAt);
      assert.equal(visible, true, "target slot should be visible before booking");

      const other = await book(patientB.token, ds.id, target.startsAt);
      assert.equal(other.status, 201, JSON.stringify(other.body));

      const mine = await book(patientA.token, ds.id, target.startsAt);
      assert.equal(mine.status, 409, JSON.stringify(mine.body));
      assert.equal(mine.body.code, "APPOINTMENT_CONFLICT");

      await cancel(patientB.token, other.body.data.id);
    });

    await t.test("list and get appointments are scoped by role", async () => {
      const target = slots[slots.length - 1];
      const created = await book(patientA.token, ds.id, target.startsAt);
      assert.equal(created.status, 201, JSON.stringify(created.body));
      const id = created.body.data.id;

      const ownList = await api("GET", "/api/appointments?limit=100", { token: patientA.token });
      assert.equal(ownList.status, 200, JSON.stringify(ownList.body));
      assert.ok(ownList.body.data.some((a) => a.id === id), "owner list must include the appointment");
      assert.ok(ownList.body.meta && ownList.body.meta.total >= 1);

      const otherList = await api("GET", "/api/appointments?limit=100", { token: patientB.token });
      assert.equal(otherList.status, 200);
      assert.equal(otherList.body.data.some((a) => a.id === id), false, "other patient must not see it");

      const ownGet = await api("GET", `/api/appointments/${id}`, { token: patientA.token });
      assert.equal(ownGet.status, 200, JSON.stringify(ownGet.body));
      assert.equal(ownGet.body.data.id, id);

      const otherGet = await api("GET", `/api/appointments/${id}`, { token: patientB.token });
      assert.equal(otherGet.status, 403, JSON.stringify(otherGet.body));

      const adminToken = await login(process.env.SEED_ADMIN_EMAIL || "admin@clinica.com");
      const adminGet = await api("GET", `/api/appointments/${id}`, { token: adminToken });
      assert.equal(adminGet.status, 200, JSON.stringify(adminGet.body));

      await cancel(patientA.token, id);
    });
  } finally {
    await prisma.appointment.deleteMany({
      where: { doctorId: ds.doctorId, startsAt: { gte: dayStart }, endsAt: { lte: dayEnd } },
    });
    if (createdAvailabilityId) {
      await prisma.doctorAvailability.delete({ where: { id: createdAvailabilityId } }).catch(() => {});
    }
    await prisma.user.deleteMany({ where: { email: { in: [patientA.email, patientB.email] } } }).catch(() => {});
    await prisma.$disconnect();
    await pool.end();
  }
});
