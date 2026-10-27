# Changelog - Clinica Backend

## Summary
This file documents all changes made to the Clinica backend architecture and setup.

## Changes Made

### 1) Database Schema (Prisma)
- Replaced minimal schema with full dynamic architecture
- Added enums: `UserRole` (PATIENT, DOCTOR, ADMIN), `AppointmentStatus` (BOOKED, CANCELED, COMPLETED)
- Models added:
  - `User` - accounts with roles, patient relation to appointments
  - `Specialization` - dynamic medical specializations (admin manageable, soft deactivatable)
  - `Doctor` - doctor profile linked 1:1 to User, references Specialization
  - `ClinicService` - shared service catalog (admin manageable)
  - `DoctorService` - doctor-specific offering with `price` (Decimal), `durationMinutes`, `isActive`. Unique on (doctorId, clinicServiceId)
  - `DoctorAvailability` - admin-defined working intervals (startsAt/endsAt)
  - `Appointment` - booking with snapshots (`priceAtBooking`, `durationMinutesAtBooking`), optional name snapshots, time range, status
- Relations, indexes, FKs configured
- Switched to `prisma-client-js` generator for compatibility
- Generated Prisma Client and synced schema to database

### 2) Error Handling Architecture
- `src/shared/errors.ts` - AppError base class + specific errors (ValidationError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError, TooManyRequestsError, InternalServerError)
- `src/shared/errors/prisma-error.mapper.ts` - Maps Prisma known errors (P2002, P2003, P2025, P2014, P2000, P2001, P2011, P2012, P2016, P2021, P2022) to AppError instances
- `src/middlewares/error.middleware.ts` - Central error handler with safe production responses, notFoundHandler, Prisma error mapping, JSON parse handling, DB init/rust panic handling (503)
- Errors never leak stack traces/details in production

### 3) Logging
- `src/utils/logger/index.ts` - Structured logger with dev/prod formatting

### 4) Application Setup
- `src/config/prisma.ts` - PrismaClient with PrismaPg adapter and pg Pool, singleton pattern for dev
- `src/app.ts` - Express app with helmet, cors, morgan, body parsing, health/root routes, 404 and error middleware
- `src/server.ts` - Server bootstrap with DB connect, graceful shutdown (SIGINT/SIGTERM), uncaughtException/unhandledRejection handling, timeouts

### 5) Configuration
- `.env` configured with DATABASE_URL and basic settings
- `.env.example` added
- `tsconfig.json` adjusted for ESM/bundler compatibility
- Installed `@prisma/adapter-pg`, `pg`, `@types/cors`, `@types/morgan`, `@types/express`

### 6) Documentation
- `backend/README.md` - Bilingual documentation
- `backend/docs/erd.mmd`, `docs/booking-workflow.mmd`, `docs/erd-en.md`, `docs/erd-ar.md`, `docs/architecture-review.md`
- Schema validated with prisma format/validate

### Notes
- No API endpoints implemented (only architecture, errors, config)
- Frontend directory remains under backend as per structure
- Project structure preserved

## [Auth Module] - Production Style
- Added env config loader with JWT/BCRYPT settings
- Added password utils (bcrypt) and JWT utils (sign/verify)
- Added unified API response helper
- Added validation middleware using Zod (body/query/params)
- Rewrote auth middleware with token verification, user lookup, proper errors
- Added role middleware for authorization
- Implemented auth module: routes/controllers/services/dtos with clean separation
- Routes: POST /api/auth/register, POST /api/auth/login (public)
- Security: passwords hashed with bcrypt, only safe user fields returned, generic "Invalid email or password" on login, public registration defaults to PATIENT
- Mounted auth routes in app

## [Auth Structure Adjustment]
- Followed Day6-DB style: placed shared interfaces in src/interfaces/auth/IAuth.ts (I prefixed)
- Auth module keeps routes/controllers/services/validation split (scalable). Using classes like Day6 style, instantiating in routes
- Routes mounted as /api/auth/register and /api/auth/login
- Passwords hashed with bcrypt, tokens with JWT, validation with Zod, centralized errors/responses

## [Auth Types Cleanup]
- Moved auth types to src/modules/auth/types.ts (I prefixed)
- Removed duplicate interfaces (dtos/interfaces/auth) to avoid duplication
- Keep module-local types.ts per module as requested

## [Cleanup & Restructure]
- Removed unused src/common folder
- Moved auth to module style: service.ts, controller.ts, routes.ts, validation.ts, types.ts (no extra nested folders)
- Utils moved to src/utils/ (password.ts, jwt.ts), interfaces kept in src/interfaces/auth/
- Shared response in src/shared/response.ts, validation middleware in src/middlewares/
- Followed existing architecture style, avoided over-nesting

## [Tooling & Package Scripts] - 2026-10-25
- Rewrote `backend/package.json` with project metadata, `type: module`, `engines`, and real npm scripts (`dev`, `build`, `start`, `typecheck`, `check`, Prisma/db commands)
- Moved runtime packages (`@prisma/client`, `dotenv`) from `devDependencies` to `dependencies`
- Added missing `@types/*` dev dependencies that were previously resolved from the Training root `node_modules`
- Fixed `prisma/seed.ts`: uses the project's Prisma singleton (driver adapter + pool), bcrypt-hashed passwords, and `SEED_PASSWORD` support
- Added `migrations.seed` to `prisma7.config.ts` so `npm run db:seed` runs `tsx prisma/seed.ts`
- Removed stale `prisma/seed.mjs` (old generated client + old enum names) and the gitignored stale `src/generated/prisma` client; `@prisma/client` is now the single client source
- Updated `README.md` setup/commands/current status and added root `AGENTS.md` as the project source of truth

## [Validation & Auth Hardening] - 2026-10-25
- Improved Zod validation middleware to report exact field paths and include `details.errors` in validation responses
- Extended `AppError` with optional `details` passed through `errorHandler`
- Auth registration now accepts optional `role` (PATIENT/DOCTOR/ADMIN) while still defaulting to PATIENT
- Strengthened register/login validation messages with clearer field-level errors

## [Doctors Module] - 2026-10-25
- Implemented `modules/doctors` in the existing module pattern: `types.ts`, `validation.ts`, `service.ts`, `controller.ts`, `router.ts`
- Only ADMIN can create/update/delete doctors; reading/listing available per project policy (public-safe list/get implemented)
- Creating a doctor links to an existing user (must have role DOCTOR or be assignable) and to an existing active specialization; enforces unique doctor per user and referential checks
- All responses use `ApiResponse`, errors use `AppError` via `next(error)`
- Mounted doctors routes at `/api/doctors` in `app.ts`

## [Specialization, ClinicService, DoctorAvailability, DoctorService Modules] - 2026-10-25
- Implemented all four modules in existing pattern (`types.ts`, `validation.ts`, `service.ts`, `controller.ts`, `router.ts`)
- `specializations` and `clinic-services`: ADMIN-only for create/update/delete, public-safe list/get
- `doctor-availabilities`: ADMIN can manage any doctor; DOCTOR can manage own availability (validated via Doctor profile). Auth required for writes.
- `doctor-services`: ADMIN can manage any doctor-service; DOCTOR can manage own doctor-services only. ClinicService catalog remains ADMIN-only as requested.
- Field-level Zod validation with exact paths, all responses via `ApiResponse`, all errors via `AppError/next(error)`
- Mounted routes: `/api/specializations`, `/api/clinic-services`, `/api/doctor-availabilities`, `/api/doctor-services` in `app.ts`

## [Appointments - Concurrency Safe Booking] - 2026-10-25
- Implemented `modules/appointment` (create with auth). Uses transaction + `SELECT ... FOR UPDATE` on Doctor row, validates active DoctorService, validates full coverage by active DoctorAvailability, creates with snapshots.
- Added custom migration `prisma/migrations/20251027T120000_add_appointment_overlap_exclusion/migration.sql` with `btree_gist` and partial EXCLUDE constraint on `(doctorId, tsrange(startsAt, endsAt, '[)'))` WHERE `status <> 'CANCELED'` (allows adjacent bookings; blocks overlaps for BOOKED/COMPLETED).
- Mapped PostgreSQL exclusion violation (23P01) to HTTP 409 `APPOINTMENT_CONFLICT` in Prisma error mapper.
- Routes mounted at `/api/appointments`. Applied constraint directly to DB (existing schema uses db push; migration SQL added for traceability).

## [Availability API + Booking Hardening + Users Module] - 2026-10-27
- Added `GET /api/appointments/availability?doctorServiceId=...&date=YYYY-MM-DD`:
  - Rejects invalid dates and days before today (`400 BAD_REQUEST`).
  - Builds slots dynamically from active `DoctorAvailability` intervals using the doctor-service `durationMinutes` (no fixed slot system, no client-supplied duration).
  - Excludes slots already ended today, slots overlapping active (`BOOKED`/`COMPLETED`) appointments, and keeps adjacent bookings available.
  - Returns `{ date, doctorServiceId, doctorId, doctorName, durationMinutes, timezone, slots[] }` where each slot is `{ startsAt, endsAt }` in ISO-8601 UTC.
- Hardened `POST /api/appointments`:
  - `startsAt` must be a valid ISO date and strictly in the future at request time (`400 APPOINTMENT_IN_PAST`).
  - Server computes `endsAt = startsAt + durationMinutes`; ignores client `endsAt`, price, and duration entirely.
  - Requires the full interval inside one active `DoctorAvailability` (`400 AVAILABILITY_NOT_COVERED`).
  - Requires active `DoctorService` and active `ClinicService`.
  - Still uses transaction + `SELECT ... FOR UPDATE` on Doctor and the DB EXCLUDE constraint as the final guard; conflicts map to `409 APPOINTMENT_CONFLICT`.
- Added `PATCH /api/appointments/:id/cancel` (owner patient or ADMIN); sets `status = CANCELED` so the interval becomes bookable again.
- Implemented `modules/users` in the standard pattern:
  - `GET /api/users/me` (auth), `GET /api/users` (ADMIN), `GET /api/users/:id` (ADMIN or self), `PATCH /api/users/:id` (ADMIN or self).
  - Zod validation for params/body (`updateUserSchema` requires at least one field; password hashed via existing `hashPassword`).
- Replaced the concurrency integration test with valid fixtures: availability is created for the tested doctor, and tests now assert real `201`/`409` outcomes.
- Tests cover: past day rejection, past appointment rejection, overrun past working hours, booked slots hidden, adjacent booking allowed, cancel+rebook, concurrent same-slot (one `201` + one `409`), and availability-then-lost-race (`409`).

## [Appointment List/Get + Paginated Lists] - 2026-10-27
- Added appointment read endpoints:
  - `GET /api/appointments?status=&doctorServiceId=&from=&to=&page=&limit=&sortBy=&sortOrder=` with role scoping (PATIENT: own, DOCTOR: own, ADMIN: all). Cross-scope filters return `403`.
  - `GET /api/appointments/:id` with the same scoping.
  - `from`/`to` use overlap semantics when both are provided (`startsAt <= to AND endsAt >= from`).
- Added shared pagination helpers (`src/shared/pagination.ts`) and extended `ApiResponse` with optional `meta` plus `ApiResponse.paginated(...)`.
- Converted all list endpoints to return `{ data: [], meta: { page, limit, total, totalPages } }` with Zod-validated query params:
  - `users`: `q`, `role`, page/limit, sort by name/email/role/createdAt/updatedAt.
  - `doctors`: added `q`, sort by createdAt/updatedAt/name.
  - `specializations` / `clinic-services`: `q`, `isActive`, page/limit, sort.
  - `doctor-availabilities`: `isActive`, `from`/`to` overlap, sort by startsAt/endsAt.
  - `doctor-services`: `isActive`, page/limit, sort by createdAt/updatedAt/price/durationMinutes.
- Default list behavior still hides inactive `specializations` and `clinic-services` unless `isActive=false` is requested.
- Cancellation remains restricted to the owning PATIENT or ADMIN; DOCTOR cannot cancel another patient's appointment.
- Extended the integration test with role-scoped list/get coverage (patient owner, other patient `403`, admin access).
- Verified: `npm run typecheck`, `npm run prisma:validate`, `npm run build`, integration tests (`10/10`), and smoke checks for every list endpoint with `meta`.

## [Auth Security Hardening] - 2026-10-27
- Public `POST /api/auth/register` now rejects any `role` field with `400 VALIDATION_ERROR` and always creates a `PATIENT`.
- Removed the optional `role` from the registration input type and service; role resolution no longer trusts client input.
- `PATCH /api/users/:id` now accepts `role` only for `ADMIN`; non-admin users receive `403 FORBIDDEN` and the update is not partially applied.
- Added `test/auth-security.test.mjs` covering: PATIENT-only registration, rejection of `role=ADMIN/DOCTOR/PATIENT`, login compatibility, self-promotion attempts, updating another user, and ADMIN-only role changes.
- Verified: `npm run typecheck`, `npm run prisma:validate`, `npm run build`, `auth-security` tests (`10/10`), and the appointment integration suite (`10/10`).
