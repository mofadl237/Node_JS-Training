# WorkTrack HR - Frontend Integration Guide

هذا الملف يشرح كل ما تم تنفيذه في الـ Backend وكيف يستخدمه الـ Frontend.

---

## 1. Overview

- Base URL المحلي: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api-docs`
- Swagger JSON: `http://localhost:3000/api-docs.json`
- Health check: `GET /health`
- كل الـ APIs تبدأ بـ `/api`
- الاستجابة الموحدة:

```json
{
  "success": true,
  "message": "Message here",
  "data": {},
  "meta": {}
}
```

- شكل الخطأ:

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {}
}
```

- الـ Pagination ترجع `meta`:

```json
{
  "page": 1,
  "limit": 20,
  "total": 42,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

---

## 2. Authentication

### Register

`POST /api/auth/register` - Public

```json
{
  "name": "Mohamed Fadl",
  "email": "mohamed@worktrack.com",
  "password": "Password123"
}
```

- الدور الافتراضي `HR`.
- لا يمكن إرسال `role` أثناء التسجيل العام.

### Login

`POST /api/auth/login` - Public

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
      "name": "Admin",
      "email": "admin@worktrack.com",
      "role": "ADMIN",
      "departmentId": null,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    },
    "token": "jwt-token",
    "refreshToken": "opaque-refresh-token",
    "tokenType": "Bearer",
    "expiresIn": "7d",
    "refreshExpiresInDays": 30
  }
}
```

- ضع الـ access token في كل الطلبات المحمية:

```http
Authorization: Bearer <token>
```

- مدة الـ access token الافتراضية: `7d`.
- مدة الـ refresh token الافتراضية: `30` يوم.
- خزّن `refreshToken` في مكان آمن. لا ترسله إلا إلى `/api/auth/refresh` و `/api/auth/logout`.
- `departmentId` مطلوب عملياً لحساب `MANAGER`، وإلا سيرجع Dashboard خطأ `403 MANAGER_DEPARTMENT_REQUIRED`.

### Refresh Token

`POST /api/auth/refresh` - Public

```json
{
  "refreshToken": "opaque-refresh-token"
}
```

- يرجع نفس شكل Login مع access token جديد و refresh token جديد.
- الـ refresh token القديم يتم إبطاله بعد الاستخدام.
- إعادة استخدام refresh token قديم/ملغي تُبطل كل refresh tokens الخاصة بالمستخدم وتُرجع `401 REFRESH_TOKEN_REVOKED`.
- طبّق Refresh تلقائياً عند `401` من أي طلب محمي، مع منع أكثر من محاولة Refresh متزامنة.

### Logout

`POST /api/auth/logout` - Public

```json
{
  "refreshToken": "opaque-refresh-token"
}
```

- يُبطل الـ refresh token الممرر.
- امسح access token و refresh token من العميل بعد النجاح.

### Current User

`GET /api/auth/me` - Authenticated

يرجع بيانات المستخدم الحالي فقط. لا توجد حالياً endpoints لإدارة المستخدمين (`/api/users`)، لذلك استخدم `/api/auth/me` للبروفايل.

### Rate Limiting

- `POST /api/auth/register`: 5 محاولات/ساعة لكل IP.
- `POST /api/auth/login`: 10 محاولات/15 دقيقة لكل IP.
- `POST /api/auth/refresh` و `/api/auth/logout`: 30 محاولة/15 دقيقة لكل IP.
- عند التجاوز يرجع `429` مع `code: "RATE_LIMITED"` و `details.retryAfter` بالثواني و header `Retry-After`.
- Rate limiting حالياً in-memory لكل process، وليس موزعاً عبر Redis.

---

## 3. Roles

| Role | الاستخدام |
|---|---|
| `ADMIN` | كل الصلاحيات |
| `HR` | إدارة الموظفين والأقسام والشيفتات والحضور والإجازات والرفع |
| `MANAGER` | قراءة Dashboard الخاصة بقسمه فقط |

- الكتابة في معظم الـ modules تحتاج `ADMIN` أو `HR`.
- حذف Audit Log يحتاج `ADMIN` فقط.
- Dashboard summary متاح لـ `ADMIN` و `HR` و `MANAGER`.
- HR KPI report متاح لـ `ADMIN` و `HR`.
- `MANAGER` يُجبر تلقائياً على قسمه (`departmentId`) في Dashboard، وأي `departmentId` يرسله يتم تجاهله.
- `MANAGER` بدون قسم يرجع `403 MANAGER_DEPARTMENT_REQUIRED` عند فتح Dashboard.

---

## 4. Enums

```ts
type Role = "ADMIN" | "HR" | "MANAGER";

type EmployeeStatus = "ACTIVE" | "INACTIVE";

type AttendanceType = "CHECK_IN" | "CHECK_OUT";

type AttendanceSource = "MANUAL" | "CSV" | "SYSTEM";

type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "HALF_DAY"
  | "ON_LEAVE";

type LeaveType =
  | "ANNUAL"
  | "SICK"
  | "UNPAID"
  | "ABSENCE"
  | "OFFICIAL_HOLIDAY"
  | "WEEKEND"
  | "CUSTOM";

type LeaveScope = "ALL" | "DEPARTMENT" | "EMPLOYEE";

type LeaveRecurrence = "NONE" | "WEEKLY" | "MONTHLY" | "YEARLY";

type UploadType = "EMPLOYEE_IMPORT" | "ATTENDANCE_IMPORT";
```

---

## 5. Endpoints

### 5.1 Auth

| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | تسجيل مستخدم جديد |
| POST | `/api/auth/login` | Public | تسجيل الدخول |
| POST | `/api/auth/refresh` | Public | تدوير refresh token وإصدار tokens جديدة |
| POST | `/api/auth/logout` | Public | إبطال refresh token |
| GET | `/api/auth/me` | Authenticated | بيانات المستخدم الحالي |

### 5.2 Departments

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/departments` | Authenticated | قائمة الأقسام |
| GET | `/api/departments/:id` | Authenticated | قسم واحد |
| POST | `/api/departments` | ADMIN, HR | إنشاء قسم |
| PATCH | `/api/departments/:id` | ADMIN, HR | تعديل قسم |
| DELETE | `/api/departments/:id` | ADMIN, HR | حذف قسم |

List query:

- `q`
- `page`
- `limit` (max 100)
- `sortBy`: `name | createdAt | updatedAt`
- `sortOrder`: `asc | desc`

Create body:

```json
{
  "name": "Engineering",
  "description": "Product engineering team"
}
```

### 5.3 Employees

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/employees` | Authenticated | قائمة الموظفين |
| GET | `/api/employees/:id` | Authenticated | موظف واحد |
| POST | `/api/employees` | ADMIN, HR | إنشاء موظف |
| PATCH | `/api/employees/:id` | ADMIN, HR | تعديل موظف |
| DELETE | `/api/employees/:id` | ADMIN, HR | حذف موظف |

List query:

- `q`
- `departmentId`
- `status`: `ACTIVE | INACTIVE`
- `page`
- `limit`
- `sortBy`: `employeeCode | firstName | lastName | hireDate | createdAt | updatedAt`
- `sortOrder`

Create body:

```json
{
  "employeeCode": "EMP-001",
  "firstName": "Ahmed",
  "lastName": "Mohamed",
  "email": "ahmed@worktrack.com",
  "phone": "01000000000",
  "departmentId": "uuid",
  "jobTitle": "Backend Developer",
  "status": "ACTIVE",
  "hireDate": "2026-01-01"
}
```

### 5.4 Shifts

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/shifts` | Authenticated | قائمة الشيفتات |
| GET | `/api/shifts/:id` | Authenticated | شيفت واحد |
| POST | `/api/shifts` | ADMIN, HR | إنشاء شيفت |
| PATCH | `/api/shifts/:id` | ADMIN, HR | تعديل شيفت |
| DELETE | `/api/shifts/:id` | ADMIN, HR | حذف شيفت |

List query:

- `q`
- `isNightShift`: `true | false`
- `page`
- `limit`
- `sortBy`: `name | startTime | createdAt | updatedAt`
- `sortOrder`

Create body:

```json
{
  "name": "Morning",
  "startTime": "09:00",
  "endTime": "17:00",
  "graceMinutes": 15,
  "expectedHours": 8,
  "overtimeAfterMinutes": 0,
  "isNightShift": false
}
```

### 5.5 Employee Shift Assignments

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/shifts/assignments` | Authenticated | قائمة التعيينات |
| GET | `/api/shifts/assignments/:id` | Authenticated | تعيين واحد |
| POST | `/api/shifts/assignments` | ADMIN, HR | تعيين شيفت لموظف |
| PATCH | `/api/shifts/assignments/:id` | ADMIN, HR | تعديل تعيين |
| DELETE | `/api/shifts/assignments/:id` | ADMIN, HR | حذف تعيين |

List query:

- `employeeId`
- `shiftId`
- `isActive`: `true | false`
- `from`
- `to`
- `page`
- `limit`
- `sortBy`: `startDate | endDate | createdAt | updatedAt`
- `sortOrder`

Create body:

```json
{
  "employeeId": "uuid",
  "shiftId": "uuid",
  "startDate": "2026-01-01",
  "endDate": null,
  "isActive": true
}
```

### 5.6 Attendance Logs

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/attendance/logs` | Authenticated | قائمة سجلات الحضور الخام |
| GET | `/api/attendance/logs/:id` | Authenticated | سجل واحد |
| POST | `/api/attendance/logs` | ADMIN, HR | إنشاء سجل حضور |
| DELETE | `/api/attendance/logs/:id` | ADMIN, HR | حذف سجل |

List query:

- `employeeId`
- `departmentId`
- `type`: `CHECK_IN | CHECK_OUT`
- `source`: `MANUAL | CSV | SYSTEM`
- `from`
- `to`
- `page`
- `limit`
- `sortBy`: `timestamp | createdAt`
- `sortOrder`

Create body:

```json
{
  "employeeId": "uuid",
  "type": "CHECK_IN",
  "timestamp": "2026-11-06T09:05:00.000Z",
  "source": "MANUAL"
}
```

### 5.7 Attendance Records

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/attendance/records` | Authenticated | قائمة سجلات الحضور المحسوبة |
| GET | `/api/attendance/records/:id` | Authenticated | سجل واحد |
| POST | `/api/attendance/records` | ADMIN, HR | إنشاء سجل |
| PATCH | `/api/attendance/records/:id` | ADMIN, HR | تعديل سجل |
| DELETE | `/api/attendance/records/:id` | ADMIN, HR | حذف سجل |

List query:

- `employeeId`
- `departmentId`
- `shiftId`
- `status`: `PRESENT | ABSENT | LATE | HALF_DAY | ON_LEAVE`
- `from`
- `to`
- `page`
- `limit`
- `sortBy`: `date | createdAt | updatedAt`
- `sortOrder`

Create/Update body:

```json
{
  "employeeId": "uuid",
  "shiftId": "uuid",
  "date": "2026-11-06",
  "checkIn": "2026-11-06T09:05:00.000Z",
  "checkOut": "2026-11-06T17:10:00.000Z",
  "status": "LATE",
  "workingMinutes": 485,
  "lateMinutes": 5,
  "earlyLeaveMinutes": 0,
  "overtimeMinutes": 10,
  "notes": "Traffic",
  "processedAt": "2026-11-06T17:15:00.000Z"
}
```

- `date` يتم تخزينه كـ UTC midnight.
- `(employeeId + date)` unique، لذلك نفس الموظف لا يمكن أن يملك سجلين في نفس اليوم.

### 5.8 Attendance Processing

`POST /api/attendance/process` - ADMIN, HR

يشغّل حساب الحضور في الخلفية عبر Redis/BullMQ.

Body options:

```json
{ "date": "2026-11-06" }
```

أو:

```json
{
  "from": "2026-11-01",
  "to": "2026-11-06",
  "employeeIds": ["uuid"]
}
```

- استخدم `date` أو `from/to`، وليس الاثنين معاً.
- أقصى مدى: 31 يوم.
- `employeeIds` اختياري وبحد أقصى 500.
- Response `202`:

```json
{
  "success": true,
  "message": "Attendance processing jobs enqueued successfully",
  "data": {
    "dates": ["2026-11-06"],
    "jobIds": ["1"],
    "count": 1
  }
}
```

- إذا Redis غير متاح: `503` مع `code: "ATTENDANCE_QUEUE_UNAVAILABLE"`.

### 5.9 Leaves

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/leaves` | Authenticated | قائمة الإجازات |
| GET | `/api/leaves/:id` | Authenticated | إجازة واحدة |
| GET | `/api/leaves/calendar` | Authenticated | تقويم الإجازات |
| GET | `/api/leaves/check` | Authenticated | هل يوم معين إجازة |
| POST | `/api/leaves` | ADMIN, HR | إنشاء إجازة |
| PATCH | `/api/leaves/:id` | ADMIN, HR | تعديل إجازة |
| DELETE | `/api/leaves/:id` | ADMIN, HR | حذف إجازة |

List query:

- `q`
- `type`
- `scope`
- `employeeId`
- `departmentId`
- `recurrence`
- `isActive`: `true | false`
- `from`
- `to`
- `page`
- `limit`
- `sortBy`: `name | startDate | endDate | createdAt | updatedAt`
- `sortOrder`

Create body:

```json
{
  "name": "Annual Leave",
  "description": "Paid annual leave",
  "type": "ANNUAL",
  "scope": "ALL",
  "employeeId": null,
  "departmentId": null,
  "startDate": "2026-01-01",
  "endDate": "2026-01-05",
  "isPaid": true,
  "isDeductible": false,
  "isActive": true,
  "recurrence": "NONE"
}
```

- `scope: EMPLOYEE` يتطلب `employeeId`.
- `scope: DEPARTMENT` يتطلب `departmentId`.
- Recurrence:
  - `WEEKLY`: يستخدم `recurrenceDayOfWeek` (0-6).
  - `MONTHLY`: يستخدم `recurrenceDayOfMonth` (1-31).
  - `YEARLY`: يستخدم `recurrenceMonth` و `recurrenceDay`.

Calendar:

`GET /api/leaves/calendar?from=2026-01-01&to=2026-01-31&employeeId=uuid&departmentId=uuid`

- `from` و `to` مطلوبان.
- أقصى مدى: 3660 يوم.
- يرجع occurrences فعلية بعد تطبيق التكرار.

Check:

`GET /api/leaves/check?date=2026-01-01&employeeId=uuid`

### 5.10 Uploads / CSV

| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/api/uploads/employees` | ADMIN, HR | رفع موظفين CSV |
| POST | `/api/uploads/attendance` | ADMIN, HR | رفع حضور CSV |
| GET | `/api/uploads` | Authenticated | قائمة الملفات المرفوعة |
| GET | `/api/uploads/:id` | Authenticated | ملف مرفوع |

- استخدم `multipart/form-data`.
- اسم الحقل: `file`.
- أقصى حجم: 5MB.
- List query:
  - `type`: `EMPLOYEE_IMPORT | ATTENDANCE_IMPORT`
  - `page`
  - `limit`
  - `sortBy`: `createdAt | originalName | type`
  - `sortOrder`

Employee CSV columns:

Required:

- `employeeCode`
- `firstName`
- `lastName`
- `department`
- `hireDate`

Optional:

- `email`
- `phone`
- `jobTitle`
- `status` (`ACTIVE | INACTIVE`)
- `departmentDescription`
- `shiftName`
- `shiftStartTime`
- `shiftEndTime`
- `shiftGraceMinutes`
- `shiftExpectedHours`
- `shiftOvertimeAfterMinutes`
- `shiftIsNightShift`
- `shiftStartDate`
- `shiftEndDate`

Attendance CSV columns:

- Attendance log row:
  - `employeeCode`
  - `type` (`CHECK_IN | CHECK_OUT`)
  - `timestamp`
  - `source` (optional, default `CSV`)
- Attendance record row:
  - `employeeCode`
  - `date`
  - `shiftName` (optional)
  - `checkIn` (optional)
  - `checkOut` (optional)
  - `status` (optional)
  - `workingMinutes` (optional)
  - `lateMinutes` (optional)
  - `earlyLeaveMinutes` (optional)
  - `overtimeMinutes` (optional)
  - `notes` (optional)
  - `processedAt` (optional)

- كل صف يعالج بشكل مستقل. الصفوف الفاشلة ترجع في `errors` مع رقم الصف.
- إعادة رفع نفس الموظف بنفس `employeeCode` تعمل update.
- إعادة رفع نفس Attendance Record تعمل upsert على `(employeeId + date)`.

### 5.11 Audit Logs

- التسجيل التلقائي يتم لأي طلب ناجح `POST | PATCH | PUT | DELETE` من مستخدم مُسجل.
- لا يتم تسجيل `/api/auth/*` ولا `/api/audit-logs/*`.
- يتم تسجيل `action` و `entity` و `entityId` و `details` تلقائياً.
- الرفع يسجل `IMPORT`، ومعالجة الحضور تسجل `PROCESS`.
- الفشل في كتابة Audit Log لا يُفشل الطلب الأصلي.
- لا يحتاج الفرونت لإرسال Audit Log يدوياً بعد كل عملية.

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/audit-logs` | ADMIN, HR | قائمة السجلات |
| GET | `/api/audit-logs/:id` | ADMIN, HR | سجل واحد |
| POST | `/api/audit-logs` | ADMIN, HR | إنشاء سجل |
| DELETE | `/api/audit-logs/:id` | ADMIN | حذف سجل |

List query:

- `q`
- `userId`
- `action`
- `entity`
- `entityId`
- `from`
- `to`
- `page`
- `limit`
- `sortBy`: `createdAt | action | entity`
- `sortOrder`

Create body:

```json
{
  "action": "CREATE",
  "entity": "Employee",
  "entityId": "uuid",
  "userId": "uuid",
  "details": {
    "source": "frontend"
  }
}
```

### 5.12 Dashboard Summary

`GET /api/dashboard/summary` - ADMIN, HR, MANAGER

Query filters:

- `from` (`YYYY-MM-DD`)
- `to` (`YYYY-MM-DD`)
- `departmentId`
- `employeeId`

Default period:

- من أول الشهر الحالي
- إلى اليوم الحالي حسب `APP_TIMEZONE` (الافتراضي `Africa/Cairo`)

Manager scoping:

- `MANAGER` يرى بيانات قسمه فقط.
- أي `departmentId` في الـ query يتم استبداله بقسم المستخدم.
- `recentAuditLogs` لـ `MANAGER` تكون لعمليات مستخدمي قسمه فقط.
- `MANAGER` بدون `departmentId` يرجع `403 MANAGER_DEPARTMENT_REQUIRED`.

Response data:

```json
{
  "generatedAt": "2026-11-06T12:00:00.000Z",
  "period": { "from": "2026-11-01", "to": "2026-11-06" },
  "filters": { "departmentId": null, "employeeId": null },
  "workforce": {
    "totalEmployees": 11,
    "activeEmployees": 10,
    "inactiveEmployees": 1,
    "totalDepartments": 5,
    "totalShifts": 3
  },
  "attendance": {
    "totalRecords": 18,
    "present": 13,
    "late": 5,
    "absent": 0,
    "halfDay": 0,
    "onLeave": 0,
    "attendanceRate": 100,
    "absenceRate": 0,
    "lateRate": 27.78,
    "averageWorkingMinutes": 474,
    "totalWorkingMinutes": 8540,
    "totalOvertimeMinutes": 270,
    "totalLateMinutes": 100,
    "totalEarlyLeaveMinutes": 0
  },
  "today": {
    "date": "2026-11-06",
    "totalRecords": 0,
    "present": 0,
    "late": 0,
    "absent": 0,
    "halfDay": 0,
    "onLeave": 0,
    "attendanceRate": 0,
    "absenceRate": 0,
    "lateRate": 0,
    "averageWorkingMinutes": 0,
    "totalWorkingMinutes": 0,
    "totalOvertimeMinutes": 0,
    "totalLateMinutes": 0,
    "totalEarlyLeaveMinutes": 0
  },
  "leaves": {
    "activeLeaves": 0,
    "todayLeaves": 0
  },
  "trend": [
    {
      "date": "2026-11-01",
      "totalRecords": 3,
      "present": 3,
      "late": 0,
      "absent": 0,
      "halfDay": 0,
      "onLeave": 0,
      "attendanceRate": 100
    }
  ],
  "recentAuditLogs": []
}
```

- `attendanceRate = (present + late + halfDay) / totalRecords * 100`
- `today` snapshot مستقل عن `from/to` ويستخدم اليوم الحالي.
- `todayLeaves` هو عدد occurrences الإجازات في اليوم الحالي.

### 5.13 HR KPI Report

`GET /api/dashboard/hr-kpi` - ADMIN, HR

نفس فلاتر Dashboard:

- `from`
- `to`
- `departmentId`
- `employeeId`

Response data:

```json
{
  "generatedAt": "2026-11-06T12:00:00.000Z",
  "period": { "from": "2026-11-01", "to": "2026-11-06" },
  "filters": { "departmentId": null, "employeeId": null },
  "workforce": {
    "totalEmployees": 11,
    "activeEmployees": 10,
    "inactiveEmployees": 1,
    "totalDepartments": 5,
    "totalShifts": 3
  },
  "totals": {
    "totalRecords": 18,
    "present": 13,
    "late": 5,
    "absent": 0,
    "halfDay": 0,
    "onLeave": 0,
    "attendanceRate": 100,
    "absenceRate": 0,
    "lateRate": 27.78,
    "averageWorkingMinutes": 474,
    "totalWorkingMinutes": 8540,
    "totalOvertimeMinutes": 270,
    "totalLateMinutes": 100,
    "totalEarlyLeaveMinutes": 0
  },
  "byDepartment": [
    {
      "departmentId": "uuid",
      "departmentName": "Engineering",
      "employees": 4,
      "totalRecords": 6,
      "present": 4,
      "late": 2,
      "absent": 0,
      "halfDay": 0,
      "onLeave": 0,
      "attendanceRate": 100,
      "absenceRate": 0,
      "lateRate": 33.33,
      "averageWorkingMinutes": 470,
      "totalWorkingMinutes": 2820,
      "totalOvertimeMinutes": 90,
      "totalLateMinutes": 35,
      "totalEarlyLeaveMinutes": 0
    }
  ],
  "topLateEmployees": [
    {
      "employeeId": "uuid",
      "employeeCode": "EMP-001",
      "employeeName": "Ahmed Mohamed",
      "departmentId": "uuid",
      "departmentName": "Engineering",
      "lateDays": 4,
      "lateMinutes": 85,
      "absentDays": 1
    }
  ],
  "trend": [],
  "leaves": {
    "activeLeaves": 0
  }
}
```

- `byDepartment` يحتوي على إحصائيات كل قسم داخل الفلتر.
- `topLateEmployees` أعلى 10 موظفين حسب `lateMinutes`.
- `leaves.activeLeaves` عدد تعريفات الإجازات النشطة داخل نطاق الفلتر.

---

## 6. Date and Time Rules

- استخدم `YYYY-MM-DD` مع:
  - Dashboard filters
  - HR KPI filters
  - Attendance process
  - Leave dates
  - Attendance record `date`
- استخدم ISO date-time مع:
  - Attendance log `timestamp`
  - Attendance record `checkIn` / `checkOut`
  - Audit log `from` / `to`
  - Shift assignment `from` / `to`
- `AttendanceRecord.date` يخزن كـ UTC midnight. اعرضه كـ date-only في الواجهة.
- اليوم الحالي في Dashboard و HR KPI يعتمد على `APP_TIMEZONE`، الافتراضي `Africa/Cairo`.
- حساب الحضور المجدول يعمل افتراضياً الساعة `02:00` بتوقيت `Africa/Cairo` على بيانات اليوم السابق.

---

## 7. Attendance Automation

- يعمل في الخلفية عبر Redis + BullMQ.
- عند تشغيل السيرفر:
  - يتصل Redis.
  - يبدأ worker.
  - يبدأ scheduler إذا `ATTENDANCE_AUTO_ENABLED=true`.
- Scheduler:
  - `ATTENDANCE_CRON=0 2 * * *`
  - `ATTENDANCE_TIMEZONE=Africa/Cairo`
  - `ATTENDANCE_LOOKBACK_DAYS=1`
- Worker:
  - `ATTENDANCE_WORKER_CONCURRENCY=1`
  - `ATTENDANCE_BATCH_SIZE=100`
- لكل موظف:
  - يجيب أحدث `EmployeeShift`.
  - يجيب attendance logs في نافذة `-6h` إلى `+12h`.
  - يأخذ أول `CHECK_IN` وأول `CHECK_OUT` بعده.
  - يحسب working/late/earlyLeave/overtime.
  - يطبق الإجازات `ON_LEAVE`.
  - يعمل upsert على `(employeeId + date)`.
- التشغيل اليدوي:
  - `POST /api/attendance/process`
  - يحتاج Redis و worker يعملان.
- إذا Redis غير متاح، الـ endpoint يرجع `503`.

---

## 8. Suggested Frontend Screens

### Login

- `POST /api/auth/login`
- خزّن `token` و `refreshToken` و `user`.
- استخدم `GET /api/auth/me` عند تحميل التطبيق للتحقق من الجلسة.
- عند `401` استخدم `POST /api/auth/refresh` مرة واحدة ثم أعد الطلب.
- زر Logout يستدعي `POST /api/auth/logout` ثم يمسح الجلسة محلياً.

### Dashboard

- `GET /api/dashboard/summary`
- `MANAGER` يرى قسمه فقط ولا يظهر له فلتر الأقسام.
- `MANAGER` بدون قسم يعرض رسالة واضحة بدلاً من Dashboard.
- Cards:
  - Total Employees
  - Active Employees
  - Attendance Rate
  - Absence Rate
  - Late Rate
  - Today Records
  - Today Leaves
- Charts:
  - `trend` line/bar chart
  - attendance status distribution from `attendance`
- Table:
  - `recentAuditLogs`

### HR KPI Report

- `GET /api/dashboard/hr-kpi`
- Filters:
  - Date range
  - Department
  - Employee
- Sections:
  - KPI cards from `totals`
  - Department table from `byDepartment`
  - Top late employees table from `topLateEmployees`
  - Trend chart from `trend`

### Employees

- List + filters + pagination: `GET /api/employees`
- Create/Edit: `POST/PATCH /api/employees`
- Delete: `DELETE /api/employees/:id`

### Departments

- `GET /api/departments`
- `POST /api/departments`
- `PATCH /api/departments/:id`
- `DELETE /api/departments/:id`

### Shifts

- `GET /api/shifts`
- `POST /api/shifts`
- `PATCH /api/shifts/:id`
- `DELETE /api/shifts/:id`
- Assignments:
  - `GET /api/shifts/assignments`
  - `POST /api/shifts/assignments`
  - `PATCH /api/shifts/assignments/:id`
  - `DELETE /api/shifts/assignments/:id`

### Attendance

- Logs:
  - `GET /api/attendance/logs`
  - `POST /api/attendance/logs`
  - `DELETE /api/attendance/logs/:id`
- Records:
  - `GET /api/attendance/records`
  - `POST /api/attendance/records`
  - `PATCH /api/attendance/records/:id`
  - `DELETE /api/attendance/records/:id`
- Manual processing:
  - `POST /api/attendance/process`

### Leaves

- List: `GET /api/leaves`
- Calendar: `GET /api/leaves/calendar`
- Check day: `GET /api/leaves/check`
- Create/Edit/Delete: `POST/PATCH/DELETE /api/leaves`

### Uploads

- Employee CSV: `POST /api/uploads/employees`
- Attendance CSV: `POST /api/uploads/attendance`
- Upload history: `GET /api/uploads`
- Upload details: `GET /api/uploads/:id`

### Audit Logs

- `GET /api/audit-logs`
- `GET /api/audit-logs/:id`
- Read-only في الواجهة؛ السجلات تُكتب تلقائياً من الـ Backend.
- حذف السجل متاح لـ `ADMIN` فقط إن لزم.

---

## 9. Example API Client

```ts
const API_BASE_URL = "http://localhost:3000";

let accessToken: string | null = localStorage.getItem("worktrack_token");
let refreshToken: string | null = localStorage.getItem("worktrack_refresh_token");

export const setSession = (auth: AuthResponse) => {
  accessToken = auth.token;
  refreshToken = auth.refreshToken;
  localStorage.setItem("worktrack_token", auth.token);
  localStorage.setItem("worktrack_refresh_token", auth.refreshToken);
};

export const clearSession = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem("worktrack_token");
  localStorage.removeItem("worktrack_refresh_token");
};

type QueryValue = string | number | boolean | null | undefined;

export const buildQuery = (params: Record<string, QueryValue>) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `?${query}` : "";
};

const refreshSession = async (): Promise<boolean> => {
  if (!refreshToken) return false;

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearSession();
    return false;
  }

  const payload = (await response.json()) as { data: AuthResponse };
  setSession(payload.data);
  return true;
};

let refreshPromise: Promise<boolean> | null = null;

const ensureRefreshed = (): Promise<boolean> => {
  refreshPromise ??= refreshSession().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
};

type ApiOptions = RequestInit & { skipAuthRetry?: boolean };

export const apiRequest = async <T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> => {
  const { skipAuthRetry, ...init } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init.headers,
    },
  });

  if (response.status === 401 && !skipAuthRetry && refreshToken) {
    const refreshed = await ensureRefreshed();

    if (refreshed) {
      return apiRequest<T>(path, { ...init, skipAuthRetry: true });
    }
  }

  const payload = await response.json();

  if (!response.ok) {
    const error = new Error(payload.message || "Request failed") as Error & {
      status?: number;
      code?: string;
      details?: unknown;
    };
    error.status = response.status;
    error.code = payload.code;
    error.details = payload.details;
    throw error;
  }

  return payload as T;
};
```

Example usage:

```ts
const summary = await apiRequest("/api/dashboard/summary");

const report = await apiRequest(
  `/api/dashboard/hr-kpi${buildQuery({
    from: "2026-11-01",
    to: "2026-11-06",
    departmentId: "uuid",
  })}`,
);

const employees = await apiRequest(
  `/api/employees${buildQuery({
    q: "Ahmed",
    departmentId: "uuid",
    status: "ACTIVE",
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  })}`,
);
```

---

## 10. Frontend TypeScript Types

```ts
export type Role = "ADMIN" | "HR" | "MANAGER";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: string;
  refreshExpiresInDays: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiListResponse<T> {
  success: true;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export interface AttendanceStats {
  totalRecords: number;
  present: number;
  late: number;
  absent: number;
  halfDay: number;
  onLeave: number;
  attendanceRate: number;
  absenceRate: number;
  lateRate: number;
  averageWorkingMinutes: number;
  totalWorkingMinutes: number;
  totalOvertimeMinutes: number;
  totalLateMinutes: number;
  totalEarlyLeaveMinutes: number;
}

export interface DashboardTrendPoint {
  date: string;
  totalRecords: number;
  present: number;
  late: number;
  absent: number;
  halfDay: number;
  onLeave: number;
  attendanceRate: number;
}

export interface DashboardSummary {
  generatedAt: string;
  period: { from: string; to: string };
  filters: { departmentId: string | null; employeeId: string | null };
  workforce: {
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    totalDepartments: number;
    totalShifts: number;
  };
  attendance: AttendanceStats;
  today: AttendanceStats & { date: string };
  leaves: { activeLeaves: number; todayLeaves: number };
  trend: DashboardTrendPoint[];
  recentAuditLogs: unknown[];
}

export interface DepartmentKpi extends AttendanceStats {
  departmentId: string;
  departmentName: string;
  employees: number;
}

export interface TopLateEmployee {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentId: string;
  departmentName: string;
  lateDays: number;
  lateMinutes: number;
  absentDays: number;
}

export interface HrKpiReport {
  generatedAt: string;
  period: { from: string; to: string };
  filters: { departmentId: string | null; employeeId: string | null };
  workforce: DashboardSummary["workforce"];
  totals: AttendanceStats;
  byDepartment: DepartmentKpi[];
  topLateEmployees: TopLateEmployee[];
  trend: DashboardTrendPoint[];
  leaves: { activeLeaves: number };
}
```

---

## 11. Notes

- لا توجد حالياً endpoints لإدارة المستخدمين (`/api/users`). المستخدم الحالي فقط عبر `/api/auth/me`.
- `User` schema في Swagger لا يحتوي على `password` ولا يجب أن يعرضه الـ Frontend.
- `AuditLogs` للقراءة فقط عملياً من واجهة الـ Frontend؛ التسجيل التلقائي يتم من الـ Backend.
- كل التواريخ القادمة من الـ Backend تكون ISO strings.
- استخدم `meta.total` و `meta.totalPages` لعمل pagination.
- استخدم `sortBy` و `sortOrder` حسب الجدول الموضح لكل endpoint.
- عند رفع CSV استخدم `FormData` ولا تضبط `Content-Type` يدوياً.
- إذا ظهر `503` مع `ATTENDANCE_QUEUE_UNAVAILABLE` أثناء `POST /api/attendance/process`، فهذا يعني Redis أو الـ worker غير متاح.
- Swagger هو المصدر الأحدث دائماً: `http://localhost:3000/api-docs`.

---

## 12. Recommended Frontend Implementation Order

ابدأ بالترتيب التالي لتجنب إعادة العمل:

1. **API client + environment**
   - `baseURL`, JSON handling, error normalization, query string builder.
   - Interceptors: attach access token, handle `401`, refresh once, retry request, logout on refresh failure.
   - Handle `429` with `Retry-After` and show a clear message.

2. **Auth flow**
   - Login page.
   - Store access token + refresh token securely.
   - `GET /api/auth/me` on app boot.
   - Refresh token flow.
   - Logout + clear session.
   - Route guards by role.

3. **App shell**
   - Layout, sidebar, top bar, user menu, role-based navigation.
   - Loading, empty, error, and forbidden states.

4. **Departments**
   - List + create/edit/delete for `ADMIN`/`HR`.
   - Use it as the first CRUD module to validate forms, tables, pagination, and toasts.

5. **Employees**
   - List + filters + pagination.
   - Create/edit/delete.
   - Employee details page.
   - Department and status filters.

6. **Shifts + assignments**
   - Shift CRUD.
   - Assign employees to shifts.
   - Show assigned employees and assignment dates.

7. **Attendance**
   - Attendance logs list + filters.
   - Attendance records list + filters (`departmentId`, `employeeId`, `status`, dates).
   - Manual create/update/delete for `ADMIN`/`HR`.
   - Trigger processing (`POST /api/attendance/process`) and show queue status.

8. **Uploads**
   - Employee CSV import.
   - Attendance CSV import.
   - Show success rows, failed rows, and row-level errors.
   - Upload history.

9. **Leaves**
   - Leave types, holidays, recurring leave days.
   - List + CRUD for `ADMIN`/`HR`.

10. **Dashboard**
    - KPI cards.
    - Attendance trend chart.
    - Department breakdown.
    - Recent audit logs.
    - Date range and department filters.
    - Hide department filter for `MANAGER` or lock it to their department.

11. **HR KPI report**
    - Department KPI table.
    - Top late employees.
    - Trend chart.
    - Export/print if needed.
    - `ADMIN`/`HR` only.

12. **Audit logs**
    - Read-only list + filters + details drawer.
    - `ADMIN`/`HR` only.
    - Delete action for `ADMIN` only.

13. **Polish**
    - Responsive layout.
    - Skeleton loaders.
    - Form validation messages matching backend errors.
    - Timezone/date formatting.
    - Permission-aware buttons.
    - End-to-end smoke test for each role.
