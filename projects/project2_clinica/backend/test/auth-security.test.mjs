import test from "node:test";
import assert from "node:assert";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const PORT = process.env.TEST_PORT || 4151;
const BASE = `http://localhost:${PORT}`;
const DB_URL = process.env.DATABASE_URL;

const pool = new Pool({ connectionString: DB_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

function uniqueEmail(prefix) {
  return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 1e6)}@example.com`;
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

async function register({ email, role, name = "Security Test" } = {}) {
  const body = { name, email, password: "Password123" };
  if (role !== undefined) body.role = role;
  return api("POST", "/api/auth/register", { body });
}

async function login(email) {
  return api("POST", "/api/auth/login", {
    body: { email, password: process.env.SEED_PASSWORD || "Password123" },
  });
}

test("public registration and profile updates cannot escalate roles", async (t) => {
  const createdEmails = [];

  try {
    let patient;

    await t.test("register without role creates a PATIENT", async () => {
      const email = uniqueEmail("patient");
      createdEmails.push(email);

      const res = await register({ email });
      assert.equal(res.status, 201, JSON.stringify(res.body));
      assert.equal(res.body.data.user.role, "PATIENT");

      const dbUser = await prisma.user.findUnique({ where: { email }, select: { role: true } });
      assert.equal(dbUser?.role, "PATIENT");

      patient = { id: res.body.data.user.id, token: res.body.data.token, email, name: "Security Test" };
    });

    for (const role of ["ADMIN", "DOCTOR", "PATIENT"]) {
      await t.test(`rejects role=${role} during public registration`, async () => {
        const email = uniqueEmail(`register-${role.toLowerCase()}`);
        createdEmails.push(email);

        const res = await register({ email, role });
        assert.equal(res.status, 400, JSON.stringify(res.body));
        assert.equal(res.body.code, "VALIDATION_ERROR");
        assert.match(res.body.message, /role/i);

        const dbUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
        assert.equal(dbUser, null, "no account should be created when role is supplied");
      });
    }

    await t.test("registered user can still log in as PATIENT", async () => {
      const res = await login(patient.email);
      assert.equal(res.status, 200, JSON.stringify(res.body));
      assert.equal(res.body.data.user.role, "PATIENT");
      patient.token = res.body.data.token;
    });

    await t.test("patient cannot promote self through PATCH /api/users/:id", async () => {
      const res = await api("PATCH", `/api/users/${patient.id}`, {
        token: patient.token,
        body: { name: "Changed Name", role: "ADMIN" },
      });
      assert.equal(res.status, 403, JSON.stringify(res.body));

      const dbUser = await prisma.user.findUnique({
        where: { id: patient.id },
        select: { role: true, name: true },
      });
      assert.equal(dbUser?.role, "PATIENT");
      assert.equal(dbUser?.name, patient.name, "rejected update must not partially apply");
    });

    await t.test("patient cannot set role with a role-only PATCH", async () => {
      const res = await api("PATCH", `/api/users/${patient.id}`, {
        token: patient.token,
        body: { role: "DOCTOR" },
      });
      assert.equal(res.status, 403, JSON.stringify(res.body));

      const dbUser = await prisma.user.findUnique({ where: { id: patient.id }, select: { role: true } });
      assert.equal(dbUser?.role, "PATIENT");
    });

    await t.test("patient cannot update another user", async () => {
      const email = uniqueEmail("other");
      createdEmails.push(email);
      const other = await register({ email });
      assert.equal(other.status, 201, JSON.stringify(other.body));

      const res = await api("PATCH", `/api/users/${other.body.data.user.id}`, {
        token: patient.token,
        body: { name: "Hijacked" },
      });
      assert.equal(res.status, 403, JSON.stringify(res.body));
    });

    await t.test("only an ADMIN can change a user role", async () => {
      const email = uniqueEmail("target");
      createdEmails.push(email);
      const target = await register({ email });
      assert.equal(target.status, 201, JSON.stringify(target.body));

      const adminLogin = await login(process.env.SEED_ADMIN_EMAIL || "mohamedfadldev@gmail.com");
      assert.equal(adminLogin.status, 200, JSON.stringify(adminLogin.body));

      const res = await api("PATCH", `/api/users/${target.body.data.user.id}`, {
        token: adminLogin.body.data.token,
        body: { role: "DOCTOR" },
      });
      assert.equal(res.status, 200, JSON.stringify(res.body));
      assert.equal(res.body.data.role, "DOCTOR");

      const dbUser = await prisma.user.findUnique({
        where: { id: target.body.data.user.id },
        select: { role: true },
      });
      assert.equal(dbUser?.role, "DOCTOR");
    });
  } finally {
    await prisma.user.deleteMany({ where: { email: { in: createdEmails } } }).catch(() => {});
    await prisma.$disconnect();
    await pool.end();
  }
});
