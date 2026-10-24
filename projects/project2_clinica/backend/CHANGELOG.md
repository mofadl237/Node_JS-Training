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
