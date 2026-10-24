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
- Appointment lifecycle (BOOKED/CANCELED/COMPLETED)
- History preservation

### Excluded (v1) / مستبعد حالياً
- API implementation (this milestone is DB design/docs)
- Frontend implementation
- Payments, prescriptions, medical records, clinical diagnosis
- Complex recurring schedules/exceptions/holidays (can extend later)
- Full notification system (only `reminderSent` flag)

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
- **Client output:** `src/generated/prisma` (as configured)
- **Structure:** Backend under `project2_clinica/backend/`, frontend under `backend/frontend/` (currently empty). Follow existing structure strictly.

**Layers (future):** routes → controllers → services → validation → Prisma client. This milestone does **not** implement APIs.

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
npx prisma format
npx prisma validate
# npx prisma migrate dev  # only when DB ready and explicitly intended
```

**Note:** Do not commit real credentials. `.env.example` present.

## 8) API Roadmap (Proposed) / خارطة API المقترحة

Organized by modules (not implemented):
- **Auth:** register/login/roles
- **Specializations (Admin):** CRUD + activate/deactivate
- **Clinic Services (Admin):** CRUD + activate/deactivate
- **Doctors (Admin):** manage doctor profiles & link to user/specialization
- **Doctor Services (Admin):** assign services with price/duration
- **Doctor Availability (Admin):** manage intervals
- **Appointments (Patient/Doctor/Admin):** get available slots (computed), create/cancel/complete
- **Reports (Admin):** basic historical views

## 9) Concurrency & Integrity Notes / ملاحظات التزامن والتكامل

- **Transactions:** Booking must validate inside a transaction (re-check availability/overlaps).
- **DB constraints:** Recommend PostgreSQL exclusion constraint on `appointment` time ranges for same doctor excluding CANCELED (if feasible). Also consider patient overlaps.
- **Locking:** Consider row-level locks / advisory locks as appropriate.
- **Snapshots:** Prevent corruption from catalog changes.
- **Soft deletes:** Use `isActive` rather than hard delete when referenced.

## 10) Limitations & Future Improvements / القيود والتحسينات المستقبلية
- Recurring weekly availability, breaks, holidays/exceptions
- Notifications/reminders (SMS/email)
- Payments
- Audit logging
- Advanced search/filters
- Exclusion constraints/migrations for concurrency hardening
- Multi-specialization per doctor (if business requires)

---

**Architecture Review Summary:** Replaced enum-based specializations/services with dynamic tables; introduced `DoctorService` for per-doctor pricing/duration; switched to `DoctorAvailability` periods with duration-based, dynamically computed booking (no fixed slots). Snapshots preserve history. Concurrency strategy documented (transactions + DB-level constraints). Existing project structure preserved (frontend remains under backend, no restructuring). Schema validated with `prisma format`/`prisma validate`.
