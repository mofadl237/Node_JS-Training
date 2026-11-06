# معالجة الحضور التلقائية (Attendance Automation)

هذا الجزء مسؤول عن حساب الحضور والانصراف بشكل دوري في الخلفية، بدون تدخل يدوي.
يعتمد على:

- `node-cron` لجدولة التشغيل.
- `bullmq` + Redis لتنفيذ المهام في الخلفية مع إعادة المحاولة.
- `dayjs` لحسابات الوقت والمناطق الزمنية.

---

## الفكرة باختصار

1. الـ Scheduler يشتغل حسب Cron محدد.
2. بيحوّل كل يوم مطلوب إلى Job داخل Queue اسمها `attendance-processing`.
3. الـ Worker يسحب الـ Job ويعالج بيانات اليوم.
4. المعالجة بتحسب:
   - دقائق العمل.
   - التأخير.
   - الانصراف المبكر.
   - الوقت الإضافي.
   - حالة اليوم (`PRESENT` / `LATE` / `ABSENT` / `HALF_DAY` / `ON_LEAVE`).
5. النتيجة بتتخزن أو بتتحدث في جدول `AttendanceRecord` باستخدام `upsert`، فإعادة تشغيل نفس اليوم آمنة.

---

## الملفات

| الملف | الوظيفة |
| --- | --- |
| `types.ts` | أنواع بيانات الـ Job ونتيجة المعالجة. |
| `calculations.ts` | دوال حساب الدقائق والحالة وبناء نافذة الشيفت. |
| `queue.ts` | إنشاء BullMQ Queue وإضافة المهام. |
| `worker.ts` | تشغيل Worker ومعالجة الـ Jobs. |
| `scheduler.ts` | تشغيل Cron وإضافة أيام الـ lookback. |
| `processor.ts` | قلب المعالجة: قراءة الشيفتات واللوجات والـ Leaves وحساب النتيجة. |
| `index.ts` | تشغيل/إيقاف التشغيل التلقائي بالكامل. |

---

## التشغيل

### 1. التشغيل التلقائي

عند تشغيل السيرفر:

- لو Redis متاح: يتم تشغيل الـ Worker.
- لو `ATTENDANCE_AUTO_ENABLED=true`: يتم تشغيل الـ Scheduler أيضًا.
- لو Redis غير متاح: يتم تسجيل تحذير وتخطي التشغيل التلقائي، والسيرفر يكمل عادي.

### 2. التشغيل اليدوي

`POST /api/attendance/process`

متاح لـ `ADMIN` و `HR` فقط.

مثال ليوم واحد:

```json
{
  "date": "2026-02-01"
}
```

مثال لفترة:

```json
{
  "from": "2026-02-01",
  "to": "2026-02-07"
}
```

مثال لفترة مع موظفين محددين:

```json
{
  "from": "2026-02-01",
  "to": "2026-02-07",
  "employeeIds": ["employee-uuid-1", "employee-uuid-2"]
}
```

ملاحظات:

- لا يمكن إرسال `date` مع `from/to` في نفس الطلب.
- أقصى مدة للفترة 31 يومًا.
- لو Redis غير متاح يرجع `503` بكود `ATTENDANCE_QUEUE_UNAVAILABLE`.
- الطلب يرجع `202 Accepted` لأن المعالجة تتم في الخلفية.

---

## الإعدادات (Environment Variables)

| المتغير | الافتراضي | المعنى |
| --- | --- | --- |
| `ATTENDANCE_AUTO_ENABLED` | `true` | تشغيل الـ Scheduler تلقائيًا. |
| `ATTENDANCE_CRON` | `0 2 * * *` | موعد التشغيل اليومي (2 صباحًا). |
| `ATTENDANCE_TIMEZONE` | `APP_TIMEZONE` | المنطقة الزمنية المستخدمة في الحسابات والجدولة. |
| `ATTENDANCE_LOOKBACK_DAYS` | `1` | عدد الأيام السابقة التي تتم معالجتها عند كل تشغيل. |
| `ATTENDANCE_WORKER_CONCURRENCY` | `1` | عدد الـ Jobs التي يعالجها الـ Worker في نفس الوقت. |
| `ATTENDANCE_BATCH_SIZE` | `100` | عدد الموظفين في كل دفعة داخل اليوم. |

مثال في `.env`:

```env
ATTENDANCE_AUTO_ENABLED=true
ATTENDANCE_CRON=0 2 * * *
ATTENDANCE_TIMEZONE=Africa/Cairo
ATTENDANCE_LOOKBACK_DAYS=1
ATTENDANCE_WORKER_CONCURRENCY=1
ATTENDANCE_BATCH_SIZE=100
```

أمثلة Cron:

```env
# كل يوم الساعة 2 صباحًا
ATTENDANCE_CRON=0 2 * * *

# كل يوم أحد الساعة 2 صباحًا
ATTENDANCE_CRON=0 2 * * 1

# كل أول يوم في الشهر الساعة 2 صباحًا
ATTENDANCE_CRON=0 2 1 * *
```

---

## خطوات المعالجة بالتفصيل

### 1. اختيار الموظفين

- بيتم قراءة `EmployeeShift` النشطة التي يقع تاريخ اليوم داخل فترتها.
- لو الموظف عنده أكثر من Assignment، يتم اختيار الأحدث حسب `startDate`.

### 2. بناء نافذة الشيفت

- يتم بناء بداية ونهاية الشيفت باستخدام `dayjs` والمنطقة الزمنية.
- لو `endTime <= startTime`، يتم اعتبار النهاية في اليوم التالي (شيفت ليلي).

### 3. قراءة اللوجات

- يتم البحث في `AttendanceLog` داخل نافذة:
  - من `shiftStart - 6 ساعات`
  - إلى `shiftEnd + 12 ساعة`
- يتم اختيار:
  - أول `CHECK_IN`.
  - أول `CHECK_OUT` بعده.
- لو مفيش `CHECK_IN` بس فيه `CHECK_OUT`، يتم استخدام أول `CHECK_OUT` مع ملاحظة `Missing check-in`.

### 4. قراءة الإجازات

- يتم استخدام `LeaveService.getLeaveMapForDate` مرة واحدة لكل دفعة.
- يدعم كل أنواع الإجازات:
  - `ALL`
  - `DEPARTMENT`
  - `EMPLOYEE`
- ويدعم التكرار:
  - `NONE`
  - `WEEKLY`
  - `MONTHLY`
  - `YEARLY`

### 5. الحسابات

```text
workingMinutes    = max(0, checkOut - checkIn)
lateMinutes       = max(0, (checkIn - shiftStart) - graceMinutes)
earlyLeaveMinutes = max(0, shiftEnd - checkOut)
overtimeMinutes   = max(0, (checkOut - shiftEnd) - overtimeAfterMinutes)
```

- `graceMinutes` تأتي من `Shift.graceMinutes`.
- `overtimeAfterMinutes` تأتي من `Shift.overtimeAfterMinutes`.
- `expectedHours` تأتي من `Shift.expectedHours`.

### 6. تحديد الحالة

| الحالة | الشرط |
| --- | --- |
| `ON_LEAVE` | مفيش لوجات + يوجد Leave في نفس اليوم. |
| `ABSENT` | مفيش لوجات + مفيش Leave. |
| `HALF_DAY` | فيه حضور وانصراف + `workingMinutes < expectedMinutes / 2`. |
| `LATE` | فيه لوجات + `lateMinutes > 0`. |
| `PRESENT` | غير ذلك. |

- لو فيه لوج واحد فقط: الحالة تكون `PRESENT` أو `LATE` حسب التأخير، مع ملاحظة توضح اللوج الناقص.
- لو اليوم إجازة وفيه لوجات: الحالة تتحسب من اللوجات، وتتضاف ملاحظة `Leave day: ...`.

### 7. الحفظ

- يتم `upsert` على `AttendanceRecord` باستخدام `(employeeId, date)`.
- يتم تحديث:
  - `shiftId`
  - `checkIn`
  - `checkOut`
  - `status`
  - `workingMinutes`
  - `lateMinutes`
  - `earlyLeaveMinutes`
  - `overtimeMinutes`
  - `notes`
  - `processedAt`

---

## إعدادات BullMQ

- اسم الـ Queue: `attendance-processing`.
- كل Job:
  - `attempts: 3`
  - `backoff: exponential` ببداية 5 ثواني.
  - `removeOnComplete`: بعد يوم أو بعد 100 Job.
  - `removeOnFail`: بعد 7 أيام أو بعد 500 Job.
- الـ Worker:
  - `concurrency` من `ATTENDANCE_WORKER_CONCURRENCY`.
  - `lockDuration: 120000ms`.

---

## ملاحظات مهمة

- إعادة تشغيل نفس اليوم لا تسبب تكرار Records بسبب `upsert`.
- المعالجة لا تحذف Records القديمة، فقط تضيف أو تحدث.
- لو الموظف ليس لديه Shift نشط في اليوم، لن يتم إنشاء Record له.
- لو Redis وقع، التشغيل التلقائي يتخطى، والـ endpoint اليدوي يرجع `503`.
- السيرفر عند الإغلاق بيوقف الـ Scheduler ثم الـ Worker ثم الـ Queue بشكل منظم.

---

## أوامر مفيدة

```bash
npm run typecheck
npm run build
npm run dev
```

لو Redis شغال محليًا:

```bash
redis-cli ping
# PONG
```
