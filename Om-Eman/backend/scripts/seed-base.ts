import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "../src/config/prisma.js";
import { hashPassword } from "../src/utils/password.js";

// Base seed (B1): the minimal REAL configuration the store needs - the OWNER
// employee, document sequences, and the SystemSetting keys the storefront
// reads. It never invents business values: everything comes from
// seed.config.json (gitignored, see seed.config.example.json).
//
// Idempotent: safe to run repeatedly (upserts only).
//
//   cp seed.config.example.json seed.config.json   # then edit it
//   npm run db:seed

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, "..", "seed.config.json");

interface IOwnerConfig {
  fullName: string;
  email: string;
  password: string;
}

interface ISequenceConfig {
  documentType: string;
  prefix: string | null;
  padding: number;
}

interface ISettingConfig {
  key: string;
  value: unknown;
  description?: string;
}

interface ISeedConfig {
  owner: IOwnerConfig;
  sequences?: ISequenceConfig[];
  settings?: ISettingConfig[];
}

function fail(message: string): never {
  console.error(`Seed aborted: ${message}`);
  process.exit(1);
}

function validate(config: ISeedConfig): void {
  if (!config.owner) fail("seed.config.json must contain an 'owner' object");
  const { fullName, email, password } = config.owner;
  if (!fullName || !email || !password) {
    fail("owner.fullName, owner.email and owner.password are all required");
  }
  if (password.length < 8) fail("owner.password must be at least 8 characters");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fail("owner.email must be a valid email address");
  }
}

async function seedOwner(config: IOwnerConfig): Promise<void> {
  const passwordHash = await hashPassword(config.password);
  const employee = await prisma.employee.upsert({
    where: { email: config.email.toLowerCase() },
    update: { fullName: config.fullName },
    create: {
      fullName: config.fullName,
      email: config.email.toLowerCase(),
      passwordHash,
      role: "OWNER",
      status: "ACTIVE",
    },
    select: { id: true, email: true, role: true },
  });
  console.log(`✔ owner ready: ${employee.email} (${employee.role})`);
}

async function seedSequences(config: ISeedConfig): Promise<void> {
  const year = new Date().getFullYear();
  for (const seq of config.sequences ?? []) {
    if (!seq.documentType.trim()) fail("sequence.documentType is required");
    const row = await prisma.documentSequence.upsert({
      where: {
        documentType_year: { documentType: seq.documentType, year },
      },
      update: { prefix: seq.prefix ?? null, padding: seq.padding },
      create: {
        documentType: seq.documentType,
        year,
        prefix: seq.prefix ?? null,
        padding: seq.padding,
      },
      select: { documentType: true, prefix: true, padding: true },
    });
    console.log(`✔ sequence ${row.documentType}/${year} (${row.prefix ?? "-"}, pad ${row.padding})`);
  }
}

async function seedSettings(config: ISeedConfig): Promise<void> {
  for (const setting of config.settings ?? []) {
    if (!setting.key.trim()) fail("setting.key is required");
    if (setting.value === undefined) fail(`setting "${setting.key}" needs a value`);
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value as object, description: setting.description ?? null },
      create: {
        key: setting.key,
        value: setting.value as object,
        description: setting.description ?? null,
      },
    });
    console.log(`✔ setting ${setting.key}`);
  }
}

async function main(): Promise<void> {
  if (!existsSync(CONFIG_PATH)) {
    fail(
      "seed.config.json not found. Copy seed.config.example.json to seed.config.json, fill in the real values, then run again.",
    );
  }
  const raw = await readFile(CONFIG_PATH, "utf8");
  const config = JSON.parse(raw) as ISeedConfig;
  validate(config);

  await seedOwner(config);
  await seedSequences(config);
  await seedSettings(config);
}

main()
  .then(async () => {
    console.log("Base seed completed.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error instanceof Error ? error.message : error);
    await prisma.$disconnect();
    process.exit(1);
  });
