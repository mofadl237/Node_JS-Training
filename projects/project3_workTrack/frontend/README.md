# WorkTrack HR API

Backend REST API for WorkTrack HR, a workforce management platform covering authentication, departments, employees, shifts, attendance, leaves, CSV imports, audit logs, dashboards, and HR KPI reporting.

## Stack

- Node.js 22+
- TypeScript (ESM)
- Express 5
- PostgreSQL + Prisma 7
- Redis + BullMQ
- Zod validation
- JWT access tokens + opaque rotating refresh tokens
- Swagger / OpenAPI
- BullMQ worker for attendance processing
- node-cron for scheduled attendance automation

## Features

- Auth: register, login, refresh, logout, current user.
- Roles: `ADMIN`, `HR`, `MANAGER`.
- Departments CRUD.
- Employees CRUD with filters, pagination, and department relation.
- Shifts and employee shift assignments.
- Attendance logs and processed attendance records.
- Attendance processing through Redis/BullMQ.
- Scheduled attendance automation with configurable cron and lookback.
- Leaves: types, holidays, recurring leave days, and active leave lookup.
- CSV imports for employees and attendance with row-level errors.
- Dashboard summary and HR KPI report.
- Automatic audit logging for successful mutating requests.
- Manager dashboard scoping by department.
- Rate limiting for auth endpoints.
- Swagger UI at `/api-docs`.

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL
- Redis (optional for normal API usage; required for attendance processing/automation)

> `docker-compose.yaml` and `dockerFile` are currently empty placeholders. Use local PostgreSQL and Redis, or fill those files before using the Docker scripts.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env` in the project root. Do not commit real secrets.

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/worktrack?schema=public"
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_TTL_DAYS=30
BCRYPT_SALT_ROUNDS=12

REDIS_URL=redis://localhost:6379

APP_NAME=WorkTrack HR
APP_TIMEZONE=Africa/Cairo

ATTENDANCE_AUTO_ENABLED=true
ATTENDANCE_CRON=0 2 * * *
ATTENDANCE_TIMEZONE=Africa/Cairo
ATTENDANCE_LOOKBACK_DAYS=1
ATTENDANCE_WORKER_CONCURRENCY=1
ATTENDANCE_BATCH_SIZE=100

EMAIL_ENABLED=false
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=WorkTrack HR <no-reply@worktrack.local>

UPLOAD_DIR=uploads
```

### 3. Generate Prisma client and apply migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

For local development:

```bash
npx prisma migrate dev
```

### 4. Seed the database

```bash
npm run db:seed
```

The seed recreates demo data, including:

- `admin@worktrack.com` / `Password123`
- `mona.hr@worktrack.com` / `Password123`
- `youssef.hr@worktrack.com` / `Password123`
- `omar.manager@worktrack.com` / `Password123` (assigned to Engineering)

> The seed deletes existing data first. Do not run it against a database you want to keep.

### 5. Start the API

```bash
npm run dev
```

- API: `http://localhost:3000`
- Health: `http://localhost:3000/health`
- Swagger: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api-docs.json`

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start with `tsx watch` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server |
| `npm run typecheck` | TypeScript check without emitting |
| `npm run check` | Typecheck + Prisma schema validation |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:validate` | Validate Prisma schema |
| `npm run prisma:format` | Format Prisma schema |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run db:push` | Push schema without a migration |
| `npm run db:seed` | Seed demo data |
| `npm run docker:up` | Docker Compose up (requires filled Docker files) |
| `npm run docker:down` | Docker Compose down |
| `npm run docker:logs` | Follow Docker Compose logs |

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | Runtime environment |
| `PORT` | No | `3000` | HTTP port |
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `JWT_SECRET` | Yes in production | insecure fallback | JWT signing secret |
| `JWT_EXPIRES_IN` | No | `7d` | Access token lifetime |
| `REFRESH_TOKEN_TTL_DAYS` | No | `30` | Refresh token lifetime in days |
| `BCRYPT_SALT_ROUNDS` | No | `12` | Password hashing cost |
| `CORS_ORIGIN` | No | `*` | Comma-separated allowed origins |
| `REDIS_URL` | No | `redis://localhost:6379` | Redis connection string |
| `APP_NAME` | No | `WorkTrack HR` | Application name |
| `APP_TIMEZONE` | No | System timezone | Business timezone |
| `ATTENDANCE_AUTO_ENABLED` | No | `true` | Enable scheduled attendance processing |
| `ATTENDANCE_CRON` | No | `0 2 * * *` | Attendance automation cron |
| `ATTENDANCE_TIMEZONE` | No | `APP_TIMEZONE` | Automation timezone |
| `ATTENDANCE_LOOKBACK_DAYS` | No | `1` | Days to reprocess |
| `ATTENDANCE_WORKER_CONCURRENCY` | No | `1` | Worker concurrency |
| `ATTENDANCE_BATCH_SIZE` | No | `100` | Processing batch size |
| `EMAIL_ENABLED` | No | `true` | Enable email delivery |
| `SMTP_HOST` | No | `smtp.gmail.com` | SMTP host |
| `SMTP_PORT` | No | `587` | SMTP port |
| `SMTP_SECURE` | No | `true` when port is `465` | SMTP TLS mode |
| `SMTP_USER` | No | - | SMTP username |
| `SMTP_PASS` | No | - | SMTP password |
| `SMTP_FROM` | No | derived | Sender address |
| `UPLOAD_DIR` | No | `uploads` | Upload storage directory |
| `REMINDER_CRON` | No | `0 8 * * *` | Reminder cron |
| `REMINDER_TIMEZONE` | No | `APP_TIMEZONE` | Reminder timezone |

## Authentication

### Login

`POST /api/auth/login`

```json
{
  "email": "admin@worktrack.com",
  "password": "Password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "System Administrator",
      "email": "admin@worktrack.com",
      "role": "ADMIN",
      "departmentId": null,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    },
    "token": "jwt-access-token",
    "refreshToken": "opaque-refresh-token",
    "tokenType": "Bearer",
    "expiresIn": "7d",
    "refreshExpiresInDays": 30
  }
}
```

Send the access token on protected routes:

```http
Authorization: Bearer <token>
```

### Refresh

`POST /api/auth/refresh`

```json
{
  "refreshToken": "opaque-refresh-token"
}
```

- Returns a new access token and a new refresh token.
- The old refresh token is revoked after use.
- Reusing a revoked token revokes all refresh tokens for that user and returns `401 REFRESH_TOKEN_REVOKED`.

### Logout

`POST /api/auth/logout`

```json
{
  "refreshToken": "opaque-refresh-token"
}
```

Revokes the supplied refresh token.

### Rate Limits

| Endpoint | Limit |
|---|---|
| `POST /api/auth/register` | 5 requests/hour/IP |
| `POST /api/auth/login` | 10 requests/15 minutes/IP |
| `POST /api/auth/refresh` | 30 requests/15 minutes/IP |
| `POST /api/auth/logout` | 30 requests/15 minutes/IP |

Rate-limited responses use `429` with `code: "RATE_LIMITED"`, `details.retryAfter`, and the `Retry-After` header. The limiter is in-memory per process, not distributed through Redis.

## Roles and Permissions

| Role | Access |
|---|---|
| `ADMIN` | Full access, including audit log deletion |
| `HR` | Manage departments, employees, shifts, attendance, leaves, uploads, and read audit logs |
| `MANAGER` | Read dashboard summary scoped to their department |

- Most write endpoints require `ADMIN` or `HR`.
- `GET /api/dashboard/summary` allows `ADMIN`, `HR`, and `MANAGER`.
- `GET /api/dashboard/hr-kpi` allows `ADMIN` and `HR`.
- A `MANAGER` without a department receives `403 MANAGER_DEPARTMENT_REQUIRED` on dashboard routes.
- Any `departmentId` query sent by a `MANAGER` is replaced with their own department.

There are currently no `/api/users` management endpoints. Use `GET /api/auth/me` for the current profile.

## Automatic Audit Logging

The global audit middleware logs successful mutating requests from authenticated users:

- Methods: `POST`, `PATCH`, `PUT`, `DELETE`
- Skipped: `/api/auth/*` and `/api/audit-logs/*`
- Captured: method, path, status, route params, query, IP, user agent
- Entity IDs are taken from route params or the created response `data.id`

Action mapping:

| Request | Action |
|---|---|
| `POST` | `CREATE` |
| `PATCH` / `PUT` | `UPDATE` |
| `DELETE` | `DELETE` |
| `/api/uploads/*` | `IMPORT` |
| `/api/attendance/process` | `PROCESS` |

Entity mapping includes `Department`, `Employee`, `Shift`, `EmployeeShift`, `AttendanceLog`, `AttendanceRecord`, `AttendanceProcess`, `Leave`, and `UploadedFile`.

Audit write failures are logged and do not fail the original request.

## Attendance Automation

The server starts attendance automation when Redis is available.

- Queue: BullMQ
- Worker: processes attendance records in batches
- Scheduler: node-cron
- Default schedule: `0 2 * * *`
- Default timezone: `Africa/Cairo`
- Default lookback: 1 day
- Default batch size: 100

Manual trigger:

`POST /api/attendance/process`

Requires `ADMIN` or `HR`. Returns `503 ATTENDANCE_QUEUE_UNAVAILABLE` if Redis or the worker is unavailable.

Attendance record dates are stored at UTC midnight. Business “today” uses `APP_TIMEZONE`.

## API Documentation

- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api-docs.json`

Swagger includes authentication, dashboard, attendance, leave, shift, upload, and audit-log schemas.

## Project Structure

```text
src/
  app.ts                  Express app and route wiring
  server.ts               Startup, Redis, automation, graceful shutdown
  config/                 env, Prisma, Redis, email, Swagger
  middlewares/            auth, role authorization, validation, errors, rate limit, audit
  modules/
    Auth/                 register, login, refresh, logout, me
    Departments/          department CRUD
    Employees/            employee CRUD and filters
    Shifts/               shifts and assignments
    Attendance/           logs, records, processing
    Leaves/               types, holidays, recurring days
    Uploads/              employee and attendance CSV imports
    Dashboard/            summary and HR KPI report
    AuditLogs/            audit log read/create/delete
  jobs/attendance/        queue, worker, scheduler, processor
  shared/                 response helpers and errors
  utils/                  JWT, password, refresh tokens, logger
prisma/
  schema.prisma
  migrations/
  seed.ts
```

## Error Format

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "errors": [
      { "field": "email", "message": "email must be a valid email address" }
    ]
  }
}
```

Common codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `INTERNAL_ERROR`.

## Frontend Integration

See [FRONTEND_API_GUIDE.md](./FRONTEND_API_GUIDE.md) for:

- Auth and refresh-token flow
- Role-based navigation
- Endpoint tables and examples
- Dashboard and HR KPI payloads
- Manager scoping rules
- TypeScript types
- Recommended frontend implementation order

## Known Limitations

- No `/api/users` management endpoints.
- No automated test suite or CI yet; verification is typecheck/build plus manual smoke tests.
- Rate limiting is in-memory per process.
- Docker files are placeholders.
- Audit logs are written asynchronously after the response finishes.

## Verification

```bash
npm run check
npm run build
```

Manual smoke checks should cover:

1. Login → refresh → reuse old refresh token → logout.
2. Create/update/delete a department and confirm audit logs.
3. Manager login without department → dashboard `403`.
4. Manager login with department → dashboard scoped to that department.
5. `GET /api/dashboard/summary` and `GET /api/dashboard/hr-kpi` for `ADMIN`/`HR`.
6. Attendance processing when Redis is available.
