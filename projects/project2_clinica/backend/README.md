# Clinica / كلينيكا

## 1) Project Introduction / مقدمة المشروع

**English**
Clinica is a clinic appointment management and booking platform built with TypeScript, Node.js, Express.js, Prisma ORM, and PostgreSQL. It enables patients to book appointments with doctors based on actual doctor availability and service duration, while giving administrators full control over specializations, services, pricing, and working schedules.

**العربية**
كلينيكا هو نظام لإدارة وحجز مواعيد العيادات، مبني باستخدام TypeScript وNode.js وExpress.js وPrisma ORM وPostgreSQL. يتيح النظام للمرضى حجز مواعيد مع الأطباء بناءً على أوقات عملهم الفعلية ومدة الخدمة، مع منح المسؤول (الأدمن) التحكم الكامل في التخصصات، الخدمات، الأسعار، وجداول العمل.

## 2) Goals, Scope & Exclusions / الأهداف، النطاق، والاستثناءات

### Goals / الأهداف
- **English:** Patient/Doctor/Admin roles, dynamic specializations & services, doctor-specific pricing/durations, admin-managed availability, duration-based booking, historical snapshots, concurrency-safe booking.
- **العربية:** أدوار (مريض/طبيب/مسؤول)، تخصصات وخدمات ديناميكية، أسعار ومدد محددة لكل طبيب، إدارة أوقات العمل من الأدمن، حجز حسب مدة الخدمة، حفظ بيانات تاريخية، حجز آمن ضد التعارض.

### In Scope (v1) / النطاق في الإصدار الأول
- User accounts with roles (PATIENT/DOCTOR/ADMIN)
- Dynamic Specialization model (managed by admin)
- Dynamic ClinicService catalog + DoctorService (per-doctor pricing/duration)
- DoctorAvailability periods (admin-controlled)
- Appointment booking with snapshots (priceAtBooking, durationMinutesAtBooking)
- Appointment lifecycle (PENDING/BOOKED/CANCELED/COMPLETED)
- History preservation

### Excluded (v1) / مستبعد حالياً
- Frontend implementation (the `frontend/` app is still the Next.js starter template)
- Payments, prescriptions, medical records, clinical diagnosis
- Complex recurring schedules/exceptions/holidays (can extend later)
- SMS/push notifications (email confirmation and reminders are implemented)

### Implemented Today / المطبّق حالياً
- Database schema, seed data, and bilingual design docs (ERD + booking workflow)
- Authentication module: `POST /api/auth/register`, `POST /api/auth/login`
- Modules implemented: `doctors`, `specializations`, `clinic-services`, `doctor-availabilities`, `doctor-services`, `appointment`, `users`
- All list endpoints support pagination, filtering, sorting, and return `meta`
- Shared infrastructure: error handling, validation, logging, Prisma client, JWT/password utils
- Email notifications: booking confirmation on successful booking + daily upcoming-appointment reminders with `reminderSent` tracking
- API documentation: Swagger UI at `/api-docs` and OpenAPI JSON at `/api-docs.json`
- Remaining: frontend integration, payments, medical records, SMS/push notifications

## 3) User Roles & Permissions / الأدوار والصلاحيات

| Role | English | العربية |
|------|---------|---------|
| PATIENT | Register/login, view doctors/services/availability, book/cancel own appointments | التسجيل، عرض الأطباء/الخدمات/الأوقات، حجز/إلغاء مواعيده |
| DOCTOR | View own profile/appointments/availability (managed by admin in v1) | عرض ملفه ومواعيده (إدارة الأوقات غالبًا عبر الأدمن في v1) |
| ADMIN | Manage specializations, clinic services, doctor services/prices/durations, doctor availability, oversee appointments | إدارة التخصصات، كتالوج الخدمات، عروض الأطباء وأسعارهم ومددهم، فترات عمل الأطباء، ومتابعة المواعيد |

## 4) Business Rules / قواعد العمل

- **Specializations dynamic:** Stored in `Specialization` table (not enum). Soft deactivate with `isActive`.
- **Services split:** `ClinicService` = shared catalog; `DoctorService` = doctor offering with price/duration. Same service can differ per doctor.
- **Pricing/Duration snapshots:** `Appointment.priceAtBooking` and `Appointment.durationMinutesAtBooking` copied at booking time; never change on updates.
- **Availability-based scheduling:** Admin creates `DoctorAvailability` intervals (DateTime). Patient books by selecting active `DoctorService`; system computes valid times and requires full containment inside one availability period.
- **No patient-defined slots:** Patients cannot create/edit availability.
- **Overlap prevention:** No overlapping active appointments for same doctor; consider patient overlaps. Enforced via transactions + DB constraints (exclusion constraint recommended).
- **History preservation:** Canceled/completed remain; deactivating service/specialization/availability does not delete history.
- **Uniqueness:** A doctor cannot offer same clinic service twice (`@@unique([doctorId, clinicServiceId])`).
- **Decimals:** Monetary values use `Decimal` (Postgres). Durations are positive integers (minutes).

## 5) Data Model Summary / ملخص نموذج البيانات

| Model | Purpose (EN/AR) |
|-------|-----------------|
| `User` | Accounts/roles / حسابات المستخدمين |
| `Specialization` | Dynamic specializations / تخصصات طبية ديناميكية |
| `Doctor` | Doctor profile linked to User & Specialization / ملف الطبيب |
| `ClinicService` | Shared service catalog / كتالوج الخدمات العام |
| `DoctorService` | Per-doctor offering (price/duration/active) / عرض كل طبيب للخدمة بسعر ومدة |
| `DoctorAvailability` | Admin-defined working intervals / فترات عمل يحددها المسؤول |
| `Appointment` | Booking with time range + snapshots / الحجز الفعلي مع لقطات تاريخية |

**Relationships:** User 1:1 Doctor (opt); Specialization 1:N Doctor; Doctor 1:N DoctorAvailability/DoctorService/Appointment; ClinicService 1:N DoctorService; DoctorService 1:N Appointment; User 1:N Appointment (patient).

See [docs/erd.mmd](docs/erd.mmd), [docs/erd-en.md](docs/erd-en.md), [docs/erd-ar.md](docs/erd-ar.md), [docs/booking-workflow.mmd](docs/booking-workflow.mmd).

## 6) Technical Architecture / البنية التقنية

- **Runtime:** Node.js + TypeScript + Express.js
- **ORM:** Prisma ORM v7.x
- **DB:** PostgreSQL
- **Client output:** default `@prisma/client` in `node_modules` (source of truth: `prisma/schema.prisma`)
- **Structure:** Backend under `project2_clinica/backend/`, frontend under `project2_clinica/frontend/` (sibling, currently the Next.js starter template). Follow existing structure strictly.

**Layers:** router → controller → service → validation → Prisma client. Implemented modules: `auth`, `doctors`, `specialization`, `clinicService`, `doctorAvailability`, `doctorService`, `appointment`, `users`.

**Notifications:** `src/config/email.ts` owns the nodemailer transporter; `modules/appointment/notification.service.ts` builds escaped HTML/text emails; `src/jobs/appointmentReminder.job.ts` runs a configurable cron job with overlap protection. Email failures are logged and never fail a booking.

**API docs:** OpenAPI 3.0 spec in `src/config/swagger.ts`, served by Swagger UI. See `/api-docs` (UI) and `/api-docs.json` (raw spec).

## 7) Installation & Configuration / التثبيت والإعداد

### Prerequisites / المتطلبات
- Node.js, npm
- PostgreSQL
- Environment variables in `.env`

### Setup
```bash
cd backend
npm install
# Configure DATABASE_URL in .env
# Optional email/reminders: APP_TIMEZONE, SMTP_HOST/PORT/SECURE/USER/PASS/FROM, REMINDER_CRON
npm run prisma:validate
npm run prisma:generate
npm run typecheck
```

### Email & reminder configuration
- Notifications are enabled only when `EMAIL_ENABLED` is not false and both `SMTP_USER` and `SMTP_PASS` are set.
- `SMTP_HOST` defaults to `smtp.gmail.com`; `SMTP_PORT` defaults to `587`; `SMTP_SECURE` defaults to true only for port `465`.
- `SMTP_FROM` defaults to `APP_NAME <SMTP_USER>`.
- After a booking succeeds, the patient receives a confirmation email asynchronously. The recipient is always `appointment.patient.email` (the `patientId` on the appointment); emails are never sent to ADMIN accounts.
- A cron job runs at `REMINDER_CRON` (default `0 8 * * *`) in `REMINDER_TIMEZONE` and sends reminders for `BOOKED` appointments without `reminderSent`, from now through the end of tomorrow (server-local time). `reminderSent` becomes `true` only after a successful send.
- Invalid cron expressions, invalid timezones (which fall back to `APP_TIMEZONE`/the server timezone), or missing SMTP credentials disable the reminder job without stopping the API.

### Development Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start the API with hot reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server from `dist/` |
| `npm run typecheck` | TypeScript check without emitting files |
| `npm run check` | Typecheck + validate Prisma schema |
| `npm run prisma:generate` | Regenerate Prisma Client from the schema |
| `npm run prisma:validate` | Validate `prisma/schema.prisma` |
| `npm run prisma:format` | Format the Prisma schema |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run db:push` | Sync the schema to the database (no migration files) |
| `npm run db:seed` | Reset seed data and insert test records |

**Seed data:** every seeded account uses `SEED_PASSWORD` or `Password123` by default (e.g. `mohamedfadldev@gmail.com`).
The project currently uses `prisma db push` (no migration history).

### Tests
The API integration tests need a running server and a reachable test DB. `EMAIL_ENABLED=false` keeps tests from contacting SMTP. The notification unit tests use an injected fake mailer and do not send email.
```bash
# terminal 1
npm run build
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/clinica?schema=public" JWT_SECRET=testsecret PORT=4420 EMAIL_ENABLED=false node dist/server.js

# terminal 2
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/clinica?schema=public" TEST_PORT=4420 node --test test/appointment-concurrency.test.mjs
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/clinica?schema=public" TEST_PORT=4420 node --test test/auth-security.test.mjs
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/clinica?schema=public" node --test test/appointment-notifications.test.mjs
```

**Note:** Do not commit real credentials. `.env.example` present.

## 8) API Roadmap (Proposed) / خارطة API المقترحة

Implemented:
- **Auth:** register/login — public registration always creates `PATIENT` and rejects any `role` field; role changes via `PATCH /api/users/:id` are ADMIN-only.
- **Users:** `GET /api/users/me`, `GET /api/users` (ADMIN), `GET /api/users/:id`, `PATCH /api/users/:id`
- **Specializations:** CRUD (ADMIN) / list-get
- **Clinic Services:** CRUD (ADMIN) / list-get
- **Doctors:** CRUD (ADMIN) / list-get
- **Doctor Services:** manage by ADMIN or own DOCTOR
- **Doctor Availability:** manage by ADMIN or own DOCTOR
- **Appointments:**
  - `GET /api/appointments?status=&doctorServiceId=&from=&to=&page=&limit=&sortBy=&sortOrder=` — scoped list (PATIENT: own, DOCTOR: own, ADMIN: all); `status` accepts `PENDING`/`BOOKED`/`COMPLETED`/`CANCELED`.
  - `GET /api/appointments/:id` — detail, scoped per role.
  - `GET /api/appointments/availability?doctorServiceId=...&date=YYYY-MM-DD` — computed slots from active availability and service duration; excludes past and booked/overlapping intervals.
  - `POST /api/appointments` — body `{ doctorServiceId, startsAt, patientId?, notes? }`; server computes `endsAt`/price/duration and creates a `PENDING` request that holds the slot. Patients/doctors can only book for themselves; ADMIN must pass a PATIENT `patientId`.
  - `PATCH /api/appointments/:id/confirm` — ADMIN only; `PENDING` → `BOOKED` and sends the confirmation email to the patient.
  - `PATCH /api/appointments/:id/cancel` — owner patient or ADMIN; soft cancel.
  - `DELETE /api/appointments/:id` — ADMIN only; permanent delete that releases the slot.
  - Booking confirmation email is sent only after ADMIN confirmation; the daily reminder job handles `BOOKED` appointments (`reminderSent` updated after successful delivery).
- **API documentation:** Swagger UI at `/api-docs`; OpenAPI JSON at `/api-docs.json`.

Remaining:
- **Appointments:** complete/update status for Doctor/Admin
- **Reports (Admin):** basic historical views

### Pagination & list query contract
Every list endpoint accepts:
- `page` (default `1`), `limit` (default `20`, max `100`).
- `sortBy` and `sortOrder` (`asc` / `desc`) with per-module allowed fields.
- Module filters (e.g. `q`, `isActive`, `role`, `doctorId`, `specializationId`, `status`, `from`, `to`).

Response keeps `data` as an array and adds:
```json
{ "success": true, "message": "...", "data": [], "meta": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 } }
```

## 9) Concurrency & Integrity Notes / ملاحظات التزامن والتكامل

- **Transactions:** Booking validates inside a transaction (re-checks availability/overlaps).
- **DB constraints:** PostgreSQL partial EXCLUDE constraint `appointment_no_overlap` on `(doctorId, tsrange(startsAt, endsAt, '[)')) WHERE status <> 'CANCELED'` blocks overlaps and allows adjacent bookings.
- **Locking:** `SELECT ... FOR UPDATE` on the `Doctor` row serializes concurrent bookings for the same doctor.
- **Conflict response:** exclusion violation (`23P01`) is mapped to `409 APPOINTMENT_CONFLICT`; availability checks alone are never trusted.
- **Time:** API accepts/returns ISO-8601 UTC (`Z`). Availability request `date=YYYY-MM-DD` is interpreted in the server's local timezone; the response includes `timezone`. The server clock is the only authority for "future" checks.
- **Snapshots:** Prevent corruption from catalog changes.
- **Soft deletes:** Use `isActive` rather than hard delete when referenced.

## 10) Limitations & Future Improvements / القيود والتحسينات المستقبلية
- Recurring weekly availability, breaks, holidays/exceptions
- SMS/push notifications (email confirmation/reminders are implemented)
- Retry/outbox queue for email delivery
- Payments
- Audit logging
- Advanced search/filters
- Multi-specialization per doctor (if business requires)

---

**Architecture Review Summary:** Replaced enum-based specializations/services with dynamic tables; introduced `DoctorService` for per-doctor pricing/duration; switched to `DoctorAvailability` periods with duration-based, dynamically computed booking (no fixed slots). Snapshots preserve history. Concurrency strategy documented (transactions + DB-level constraints). Existing module structure preserved; the frontend remains a sibling Next.js app. Schema validated with `prisma format`/`prisma validate`.
