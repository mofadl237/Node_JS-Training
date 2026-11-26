# اليوم 9 — Dashboard Foundation: دخول الموظف + الهيكل + قائمة المنتجات (قراءة فقط) — تاسكات التخطيط والتفكيك

> آخر تحديث: 2026-11-26. **حالة المستند: DAY 9 PLAN WRITTEN — NO DAY-9 GATE OPENED — NO DAY-9 IMPLEMENTATION AUTHORIZED.** (استثناء مسجّل: الإصلاحات السابقة لليوم 9 — H1/H2/M1/M2 + الزرار العايم + credentials — اتنفذت بإذن مالك صريح واتسجلت في `PROGRESS.md §63`، وبتشتغل كـ "G1 منفّذة".)
> **المدير/المراجع:** Astra. **المنفّذ المقترح:** GLM. **المالك:** صاحب القرار في فتح كل Gate، الشكل والحركة، ومتى ننتقل لللي بعده.
> **الخط المتبع:** `AGENTS.md` → `FRONTEND_TASKS_10_DAYS.md §0.3` (Phase B) → **`REVIEW_DAY8.md`** (إلزامي: بيحدد G0/G1 وحدود الباك) → `PROGRESS.md §62` → `DAY8_TASKS.md §6/§12` → `DESIGN_SYSTEM.md`.
> المسارات نسبية لـ `Om-Eman/frontend/` إلا لو ذُكر الباك صراحة. **ملف تخطيط فقط**: ما يفتحش Gate ولا يسمح بكود/باك/DB/env/deps/commit. كل Gate محتاجة إذن مالك صريح باسمها.
> **ترقيم الأيام (تثبيت):** الخطة الأصلية «اليوم 9/10» (كتالوج/سلة/checkout/تتبع) اتنفذت فعليًا في أيام 4–7. **اليوم 9 الفعلي = أول يوم Dashboard.** الإطلاق + المراجعة المعمارية + `D15-SEO-SITEMAP` = اليوم 15.

---

## 0) قواعد التعامل — اقرأها الأول

1. قبل أي Gate: اقرأ `AGENTS.md`، `REVIEW_DAY8.md`، هذا الملف، `PROGRESS.md §62`، والكود الحالي. افحص `git status`. تحقق من إذن مالك **باسم Gate بعينه**. أي تعارض عقد/قرار ⇒ STOP وسؤال المالك.
2. منفّذ واحد في وقت واحد: GLM يعرض قايمة الملفات ومسؤولية كل ملف **من غير كود**، ينفّذ Gate واحد، يشغّل الفحوص (كل أمر لوحده)، يراجع diff/untracked، يحدّث `PROGRESS.md`، يسلّم ويقف.
3. **الشكل والحركة بعد الهيكل والسلوك** وبإذن منفصل `G6 — DAY 9 STYLE & MOTION`. لا تجميل في G1–G5 (استخدم الـ tokens والـ wrappers الموجودة فقط).
4. **الاركتيكتشر مجمّد** (نفس App Router والترتيب `NextIntlClientProvider > ReduxProvider > ThemeProvider > MotionProvider`). الداشبورد = route group `(Dashboard)` تحت `app/[locale]`. **ممنوع** استيراد بين `components/ECommerce` و`components/Dashboard`؛ المشترك فقط عبر `components/ui` و`components/shared` و`interface` و`lib` و`hooks`.
5. **الأمان (غير قابل للتفاوض):**
   - توكن الموظف **httpOnly cookie** عبر Route Handler. **ممنوع** `localStorage`/`sessionStorage`/state عام/URL/log.
   - **ممنوع** إعادة استخدام `store/baseApi.ts` للداشبورد: بيحقن توكن **العميل** (`readCustomerToken`) في كل طلب = تسريب بين الجلسات.
   - الـ proxy مش open proxy: **allowlist** للمسارات + الأفعال. بدون تمرير `cookie`/`host` من المتصفح.
   - فك JWT ≠ تحقق: الحارس بيسأل الباك `/auth/me` (`AGENTS §13`).
   - مفيش رسالة خام من الباك للمستخدم؛ كل `code` يتترجم من `messages/`.
6. **لا اختراع قيم أعمال ولا KPIs:** الباك مفيهوش endpoint ملخص (`BE-7`). صفحة الـ overview **مفيهاش أرقام مفبركة**.
7. **اللي الباك مش جاهزه ما يتبنيش عليه UI في اليوم ده:** تغيير حالة الطلب، تأكيد الدفع، الفواتير، الشحنات (`REVIEW_DAY8 §5.2`). مسجّلين blockers مش mock.
8. الملفات ≤150 سطر (حد 200)، ملف لكل مسؤولية، الصفحة ≤30 سطر، `I`/`T`، لا `any`، لا نص hard-coded، لا ألوان خام، `ar.json`/`en.json` متطابقين، Tailwind variables فقط.
9. **ممنوع** dependencies جديدة، تعديل `next.config.ts`/Docker/CI/package scripts، commit/push/deploy (بدون طلب صريح)، تعديل الباك/DB/env.
10. الـ UI states إلزامية لكل شاشة: skeleton / error / empty / success + feedback. HTTP 200 مش acceptance.
11. في كل تقرير افصل: **SOURCE / AUTOMATED / BROWSER / OWNER VISUAL**. توصية Astra ≠ اعتماد المالك.
12. working tree: بعد G0 الشغل الحالي بيتعمله commit (قرار المالك). ممنوع reset/checkout/overwrite.

---

## 1) الهدف والنطاق

### 1.1 داخل اليوم 9 (إلزامي)
- **D9-CLOSE:** قفل Day 8 كـ `SOURCE COMPLETE — PARTIAL HANDOFF` (G0) + إصلاحاته الأربعة (G1).
- **D9-SESSION:** جلسة موظف آمنة: cookie httpOnly + route handlers + proxy بـ allowlist + `adminFetch` للسيرفر + `dashboardApi` للعميل.
- **D9-LOGIN:** صفحة `/{locale}/dashboard/login` + حارس السيرفر + logout + معالجة انتهاء الجلسة + بوابة الأدوار (OWNER/ADMIN/STAFF).
- **D9-SHELL:** هيكل اللوحة: sidebar (collapsible) + topbar (لغة/ثيم/قائمة الموظف) + breadcrumb + نافبار موبايل + overview صادق.
- **D9-PRODUCTS-LIST:** جدول المنتجات **قراءة فقط**: بحث `q` + ترتيب + pagination من `searchParams` + كل الـ states.

### 1.2 خارج اليوم 9 (مؤجل بوضوح — مش ناقص)
| مؤجل | يروح فين | السبب |
|---|---|---|
| فورم منتج + باكدجات + صور + aliases + bundle | **يوم 10** | محتاج `BE-4` وتجربة Cloudinary حية |
| أقسام/أقسام فرعية (CRUD) | يوم 10 | — |
| الطلبات + تفاصيل + تغيير حالة | يوم 11 | `BE-1` + `BE-2` |
| المدفوعات + تأكيد/رفض | يوم 11 | `BE-3` |
| عملاء + تقارير + إعدادات + audit | يوم 12 | `BE-7` + `BE-8` |
| فواتير + شحن + عروض + كوبونات + محتوى + إشعارات | أيام 13–14 | `BE-9` |
| مراجعة الداشبورد النهائية | يوم 14 | — |
| إطلاق: Lighthouse ≥95 + `D15-SEO-SITEMAP` + مراجعة معمارية + أي مؤجلات | **يوم 15** | — |

### 1.3.0 قرارات المالك المسجّلة (2026-11-26) — بتحكم باقي الملف

| # | القرار المسجّل | الأثر على الخطة |
|---|---|---|
| Q1 | **Cloudinary: أولوية قصوى.** المالك هيعمل Revoke للمفتاح القديم ويولّد جديد. `backend/.env.example` = placeholders فقط، و`.env` غير متتبع. **ممنوع** أي secret في التقارير أو الـ commits | `D9-SEC-CLOUDINARY`: التنضيف **اتنفذ** (`PROGRESS §63`)؛ **الـ Revoke على المالك** وبيتأكد في G0. القيم القديمة لسه في تاريخ git |
| Q2 | **المتصفح: مش مؤجل ليوم 15.** Manual Browser Testing لـ Day 8 بالمصفوفة وتوثيق النتايج الفعلية. أي اختبار ما اتعملش = `NOT TESTED`. ممنوع `SEALED` بدون Evidence | G7 بيتقدّم: قايمة `REVIEW_DAY8 §6 + §10.7` تتنفذ **قبل/بالتوازي** مع G2 (مش بعد G6). Chrome موجود وممكن قياس DOM عبر CDP بدون dependencies؛ الحكم البصري يدوي |
| Q3 | الداشبورد بالـ 4 ثيمات الحاليين | بدون dark mode |
| Q4 | **BE-1 و BE-5 مش بيتفتحوا بالتوازي** مع Day 9. الأول مراجعة تفاصيل المهام واعتمادياتها. تركيز Day 9: Auth + Structure + Read-only Products | الباك خارج النطاق؛ الجدول يفضل بدون فلاتر (`D9-BE-*` = متابعة فقط) |
| Q5 | **`End Day8` commit بعد** إصلاح الأربع ملاحظات + الفحوص + مراجعة diff/status. الـ commit لا يعني Browser Verification ولا SEALED | **اتنفذ** (`PROGRESS §63`)؛ المالك اعتمد الشكل لحد ما يغيّر |
| Q6 | طلب إضافي: زرار السلة العايم Fixed طول السكرول | **اتنفذ** — السبب الجذري كان `fill-mode: both` على `template.tsx` (`REVIEW_DAY8 §10.2`) |
| — | G1 (Day 8 closure fixes) | **اتنفذت قبل Day 9 بإذن المالك** — مش gate مفتوحة تحت Day 9؛ G0 يكتفي بتسجيلها وتأكيد الحالة |

### 1.3 قرارات متوقعة من المالك في G0 (الأصلية — اتحسمت فوق)
| # | القرار | الافتراضي المقترح |
|---|---|---|
| Q1 | rotate لمفتاح Cloudinary | **نعم، قبل G2** |
| Q2 | اختبار المتصفح Day 8 | يدوي منك بالقايمة (`REVIEW_DAY8 §6`) أو مؤجل صراحةً ليوم 15 |
| Q3 | ثيمات الداشبورد | الـ 4 ثيمات الحاليين (zafran/attar/cinnamon/hibiscus) — الداكن قرار منفصل |
| Q4 | مهام الباك `BE-1` و`BE-5` | تتفتح بالتوازي ككيان منفصل عن الفرونت |
| Q5 | commit الشغل الحالي | `End Day8` قبل G1 |
| Q6 | هل G1 يشمل Medium/Low الاختيارية (M3–M5/L*) | **لا** — الأربعة (H1,H2,M1,M2) بس |

---

## 2) الحالة الحالية (بأدلة — 2026-11-26)

| البند | الحالة | الدليل |
|---|---|---|
| lint/check/tsc/build | ✅ كلها EXIT 0 (309 ملف / 513 مفتاح) | `REVIEW_DAY8 §2` |
| `app/[locale]/(Dashboard)` | ❌ مش موجود | شجرة `app/[locale]` |
| `app/api/*` route handlers | ❌ مش موجود | `proxy.ts` matcher بيستثني `api` ✅ جاهز |
| UI primitives | `Badge, Button, Input, Skeleton, Toaster` فقط. **`Table/Sheet/Dialog/Select/Tabs` = planned** | `components/ui/` |
| `store/baseApi.ts` | بيحقن توكن العميل ← **ممنوع للداشبورد** | `baseApi.ts:10-16` |
| `API_INTERNAL_URL` | مدعوم أصلًا في `storeFetch` | `lib/server/storeFetch.ts:19` |
| `LocaleSwitcher` | جوه `components/ECommerce/Header/` ← الداشبورد مايقدرش يستورده | AGENTS §4 |
| `ThemeSwitcher` | في `components/shared/` ✅ | — |
| Pagination | `components/ECommerce/Catalog/CatalogPagination.tsx` (متجر) | محتاج نسخة مشتركة |
| `robots.ts` | بيمنع `/design` بس | `app/robots.ts` |

### 2.1 عقود الباك الحقيقية (من الكود — `REVIEW_DAY8 §5.2`)
| Endpoint | العقد |
|---|---|
| `POST /api/auth/login` | body `{email,password}` → `{employee{id,fullName,email,phone,role}, token}`. أخطاء: `INVALID_CREDENTIALS` (401), `EMPLOYEE_DISABLED` (401), `VALIDATION_ERROR` |
| `GET /api/auth/me` | Bearer → `{id,fullName,email,phone,role}`. أخطاء: `TOKEN_MISSING/INVALID/EXPIRED`, `EMPLOYEE_UNAVAILABLE` (401) |
| JWT | HS256، `{employeeId,email,role}`، افتراضي 7 أيام. **مفيش logout/refresh/revoke** |
| `GET /api/products` | `?q&page&limit(≤100)&sortBy&sortOrder` → `{data: IProductRow[], meta}`. **مفيش** فلتر status/subcategory/featured **ولا** صورة/سعر/اسم قسم. أي بارامتر غريب بيتتجاهل |
| `IProductRow` (scalar) | `id, primarySubcategoryId, nameAr, nameEn, slug, descriptionAr/En, productType (FINISHED\|PREDEFINED_BUNDLE), status (DRAFT\|ACTIVE\|INACTIVE\|ARCHIVED), brand, isFeatured, publishedAt, archivedAt, createdAt, updatedAt, search*` |
| صلاحيات | الكتابة OWNER/ADMIN. `/payments` و`/reports` OWNER/ADMIN فقط. باقي الـ GET لأي موظف (STAFF يشمل) |
| CORS | `localhost:3001` مسموح؛ لكن الـ proxy بيخلي المتصفح مايكلمش الباك مباشرة أصلًا |

### 2.2 قرارات التصميم المُثبّتة (للتنفيذ لاحقًا — مفيش كود الآن)
- **قراءة** الداشبورد = Server Components + `adminFetch` (cookie → Bearer) داخل `<Suspense>`. **كتابة/جلسة** = RTK Query `dashboardApi` عبر `/api/admin/*` (same-origin).
- **حارس:** `dashboard/(protected)/layout.tsx` يستدعي `requireEmployee()` (يقرأ الـ cookie + `/auth/me`) ويعمل `redirect` محلي لـ `/dashboard/login`. صفحة الدخول public وبترجّع للوحة لو الجلسة سليمة.
- **انتهاء الجلسة:** أي 401 من الـ proxy ⇒ مسح الـ cookie ⇒ redirect للدخول مع رسالة مترجمة.
- **المسارات:** `app/[locale]/(Dashboard)/dashboard/login`، `app/[locale]/(Dashboard)/dashboard/(protected)/{page,products}`. الـ APIs: `app/api/session/route.ts`، `app/api/admin/[...path]/route.ts`.

---

## 3) خريطة إعادة الاستخدام

| الحاجة | استخدم | لا تضف |
|---|---|---|
| تنسيق/دمج كلاسات | `cn`, `cva` | CSS مكرر |
| رسايل الأخطاء بالـ code | نمط `lib/accountError.ts` + `isApiError` | عرض الـ code الخام |
| envelope | `lib/envelope.ts` (`isEnvelopeFailure/Success`) + `interface/api.ts` | parsing يدوي |
| بيانات السيرفر | نمط `lib/server/storeFetch.ts` → `adminFetch.ts` (`TAdminResult`) | `fetch` في components |
| فورم | `react-hook-form` + `zodResolver` + `validation/` | validation ad-hoc |
| تحميل/فراغ/خطأ | `Skeleton`, `EmptyState`, `ErrorState`, `BrandLoader` | شاشة فاضية |
| ثيم | `ThemeSwitcher` + tokens | ألوان خام |
| لغة | `LocaleSwitcher` (يتنقل لـ `shared` في G4) | نسخة مكررة |
| Drawer موبايل | `useDrawerFocus` + `useBodyScrollLock` (من CartDrawer) | منطق focus-trap جديد |
| حركة | `FadeIn`, `Stagger`, `CountUp`, `BorderBeam`, `ScaleOnHover`, `Shake`, `m.*` | مكتبات حركة جديدة |
| badge حالة | `Badge` variants الموجودة (`primary/neutral/outline/soldOut`) | إضافة ألوان خام |

---

## 4) جرد الملفات المتوقع — تقديري (مش إذن إنشاء)

### 4.1 G1 — Day 8 closure fixes
| الملف | المسؤولية |
|---|---|
| `components/ECommerce/Home/Hero.tsx` | عرض `home.hero.title` كـ `<h1>` (H1) |
| `messages/{ar,en}.json` | حذف `home.hero.subtitle`, `home.title`, `home.body` الميتة |
| `components/Card/ProductCard.tsx` | حلقة focus مرئية للرابط الممدود (H2) |
| `components/ECommerce/Home/HeroCta.tsx` | شيل `opacity:0` الأولي (M1) |
| `components/ECommerce/Home/HeroSlider.tsx` | `preload` للأول فقط (M2) |

### 4.2 G2 — Session & API plumbing (بدون UI)
| الملف | المسؤولية |
|---|---|
| `interface/dashboard.ts` (+barrel) | `IEmployee`, `TEmployeeRole`, `IAdminLoginResult`, `IProductRow`, `IAdminListMeta` |
| `validation/adminLogin.ts` (+barrel) | `adminLoginSchema` (email+password) |
| `lib/server/adminSession.ts` | قراءة/كتابة/مسح cookie httpOnly (اسم ثابت، `secure` في prod، `sameSite=lax`، `path=/`) |
| `lib/server/adminFetch.ts` | `TAdminResult<T>`، Bearer من الـ cookie، timeout، لا throw، 401 ⇒ علامة `UNAUTHENTICATED` |
| `lib/server/requireEmployee.ts` | يتحقق بـ `/auth/me` ويرجّع `IEmployee` أو `redirect` |
| `lib/server/adminAllowlist.ts` | قايمة مسارات/أفعال مسموحة للـ proxy (قراءة منتجات فقط في اليوم ده) |
| `app/api/session/route.ts` | `POST` دخول (Zod → الباك → cookie) · `DELETE` خروج · `GET` me |
| `app/api/admin/[...path]/route.ts` | proxy بـ allowlist، مسح الـ cookie عند 401، صفر تمرير cookie/host |
| `store/dashboardApi.ts` | `createApi` منفصل (`reducerPath:"adminApi"`, baseUrl `/api/admin`، **بدون** توكن عميل) + endpoints الجلسة |
| `store/store.ts` | تسجيل reducer+middleware (تعديل واحد صغير) |
| `lib/adminError.ts` | `code → messages key` |
| `messages/{ar,en}.json` | `dashboard.errors.*` |

### 4.3 G3 — Login + guard
| الملف | المسؤولية |
|---|---|
| `app/[locale]/(Dashboard)/dashboard/login/{page,metadata}.tsx` | صفحة رقيقة + noindex |
| `components/Dashboard/Auth/{LoginCard,LoginForm,LoginFields}.tsx` | فورم RHF+Zod وحالات |
| `hooks/useAdminLogin.ts` | mutation + redirect + feedback |
| `app/[locale]/(Dashboard)/dashboard/(protected)/layout.tsx` | الحارس (`<Suspense>` + `requireEmployee`) |
| `app/[locale]/(Dashboard)/dashboard/{loading,error}.tsx` | حالات الـ segment |
| `app/robots.ts` | `Disallow` لـ `/ar/dashboard` و`/en/dashboard` (استثناء أمني صغير؛ sitemap يفضل مؤجل لـ D15) |
| `messages/{ar,en}.json` | `dashboard.login.*` |

### 4.4 G4 — Shell
| الملف | المسؤولية |
|---|---|
| `components/shared/LocaleSwitcher.tsx` | **نقل** من `ECommerce/Header` (ثم تعديل import المتجر) |
| `components/ui/Sheet.tsx` | قشرة drawer مكتوبة بإيد (`cva`) للموبايل |
| `components/Dashboard/Shell/{DashboardShell,Sidebar,SidebarItem,Topbar,EmployeeMenu,DashboardBreadcrumb}.tsx` | الهيكل |
| `components/Dashboard/data/dashboardNavLinks.ts` | قايمة التنقل + الأدوار المسموحة |
| `lib/dashboardRoles.ts` | `canAccess(role, item)` — مرآة للـ UI فقط، الباك هو الحكم |
| `hooks/useSidebarState.ts` | collapse (بدون setState في effect) |
| `app/[locale]/(Dashboard)/dashboard/(protected)/page.tsx` | overview صادق (ترحيب + روابط) بدون أرقام |
| `messages/{ar,en}.json` | `dashboard.nav.*`, `dashboard.shell.*` |

### 4.5 G5 — Products list (read-only)
| الملف | المسؤولية |
|---|---|
| `app/[locale]/(Dashboard)/dashboard/(protected)/products/{page,metadata}.tsx` | صفحة رقيقة |
| `components/Dashboard/Products/{ProductsSection,ProductsToolbar,ProductsTable,ProductRow,ProductStatusBadge}.tsx` | الأقسام والجدول |
| `components/ui/Table.tsx` | `Table/THead/TR/TH/TD` (cva) |
| `components/shared/Pagination.tsx` | تعميم `CatalogPagination` (المتجر بيستخدمه بعد النقل) |
| `components/Skelton/ProductsTableSkeleton.tsx` | skeleton مطابق |
| `lib/server/adminQueries.ts` | `getAdminProducts(query)` |
| `lib/adminProductsQuery.ts` + `validation/adminProductsQuery.ts` | تحويل `searchParams` ⇆ query آمن (page/limit/q/sort) |
| `messages/{ar,en}.json` | `dashboard.products.*` |

### 4.6 الوثائق
`PROGRESS.md` (سجل كل Gate + بانر + جدول الأيام) · `DAY9_TASKS.md` (هذا الملف) · `FRONTEND_TASKS_10_DAYS.md` (جدول ترقيم) · `AGENTS.md` (حالة `[planned]`→`[exists]` في G8 فقط) · `REVIEW_DAY8.md` (ملاحظة إغلاق).

---

## 5) سجل مؤجلات وblockers (يُقرأ في G0 ولا يُفتح تلقائيًا)

| ID | البند | الحالة | القرار المقترح |
|---|---|---|---|
| D9-SEC-CLOUDINARY | سر Cloudinary في `.env.example` المتتبع/المرفوع | 🟠 الملف اتنضّف (placeholders ✅). **Revoke/rotate على المالك لسه** (التاريخ فيه القيم القديمة) | يتأكد في G0 قبل G2. بدون قيم في أي تقرير |
| D9-SEC-OTHER | `projects/project2_clinica/backend/.env.example` (SMTP) + `Day1/.env`,`Day2/.env` متتبعة | ⚠️ خارج Om-Eman — قرار المالك | revoke لـ SMTP app password + `git rm --cached` + `.gitignore` (بإذن) |
| D9-BROWSER-D8 | اختبار Day 8 اليدوي (قايمة §6 + §10.7) | قرار Q2: **مطلوب، مش مؤجل** | ينفذه المالك ويكتب النتيجة؛ ما اتعملش = NOT TESTED |
| D9-AUDIT-LATER | مراجعة شاملة: تكرار (15 بند)، تباين cinnamon، صور محلية بدون تحسين، reveal بالسكرول، وش الكوبون الحزين، confetti | مسجّلة في `REVIEW_DAY8 §10.4` | لا تُفتح داخل Day 9 إلا بإذن مالك؛ مرشحة لـ gate تنضيف/أنيميشن مستقل |
| D9-ENV | `CORS_ORIGIN` يشمل `:3001`، OWNER مزروع (`db:seed`)، الباك شغال `:3002` | يتأكد في G0 | بدونه G3 مستحيل |
| D9-BROWSER | بيئة متصفح/اختبار يدوي | قرار Q2 | قائمة يدوية لو مفيش Playwright |
| D9-BE-1 | فلاتر الـ list في المولّد | BLOCKS يوم 10–11 | باك منفصل (Q4) |
| D9-BE-2 | endpoint تغيير حالة الطلب | BLOCKS يوم 11 | باك |
| D9-BE-3 | تأكيد/رفض دفع + sync | BLOCKS يوم 11 | باك |
| D9-BE-4 | relations/aggregates (صورة/سعر/عميل) | BLOCKS يوم 10 (غنى الجدول) | باك |
| D9-BE-5 | rate limit للـ login | مفضّل قبل الإنتاج | باك (مش blocker لـ G3) |
| D9-BE-6 | حماية OWNER + تقييد قراءة STAFF | قبل الإنتاج | باك |
| D9-BE-7/8 | KPI summary + AuditLog تلقائي | يوم 12 | باك |
| D9-NO-LOGOUT-BE | مفيش revoke للتوكن | معروف | logout = مسح cookie فقط؛ التوكن يفضل صالح لحد انتهائه (يتوثق) |
| D9-PRODUCT-COLUMNS | صورة/سعر/عدد باكدجات في الجدول | BLOCKED (BE-4) | الجدول بالأعمدة الحقيقية فقط؛ **لا N+1 ولا mock** |
| D9-DARK | وضع داكن للوحة | قرار Q3 | خارج اليوم 9 |
| D9-DOCS | تناقضات `REVIEW_DAY8 §7` | تتصلح في G0/G8 | وثائق فقط |
| D8-* (الباقي) | `D8-BANNER-ASSETS`, FAQ facts, `D8-MERGE-READ`, `D8-GOOGLE-REAL`, `D8-WISHLIST-API`, `R-G4-MAJOR`, `D3-RM`, `D8-SEAL` | مؤجلين | لا يُفتحوا؛ مرجعهم `REVIEW_DAY8 §3.3` |
| D15-SEO-SITEMAP | sitemap ديناميكي + مراجعة SEO/معمارية | DEFERRED TO DAY 15 | لا تعديل `sitemap.ts` |

---

## 6) خطة الـ Gates — 12 حقل لكل Gate

> كل Gate تقف لوحدها. جدول §4 تقديري؛ مفيش حاجة تتنشأ قبل إذن الـ Gate بعينها.

### Gate 0 — Pre-flight / Day 8 Closure Decision / Baseline (docs only)

1. **ID/الهدف:** G0 — تثبيت قرارات الإغلاق وقياس خط الأساس وتصحيح التوثيق.
2. **الإذن:** `G0 — DAY 9 PRE-FLIGHT / DAY 8 CLOSURE`؛ صفر تعديل مصدر.
3. **النطاق:** قراءة `AGENTS`/`REVIEW_DAY8`/هذا الملف؛ تسجيل قرارات Q1–Q6؛ التأكد من `D9-ENV` (قراءة فقط: الباك شغال؟ CORS؟ OWNER؟)؛ تصحيح D1–D6 و D10 من `REVIEW_DAY8 §7`؛ baseline (`git status` + hash)؛ أوامر lint/check/tsc/build (آخر نتيجة).
4. **خارج النطاق:** أي كود، commit (إلا بطلب صريح من المالك)، باك/DB/env، Cloudinary rotate (إجراء المالك).
5. **الملفات:** `PROGRESS.md` (بانر + جدول الأيام + سجل G0)، `DAY8_TASKS.md` (سطر حالة في الرأس)، `FRONTEND_TASKS_10_DAYS.md` (جدول ترقيم أصل→فعلي).
6. **المسؤولية:** وثائق فقط. القرارات تتسجل بنصها، مش بالاستنتاج.
7. **العقود:** `REVIEW_DAY8 §3/§5/§7`.
8. **الفحوص:** `lint`, `check`, `tsc`, `build` (كل واحد لوحده) كخط أساس، `git status --short --untracked-files=all`، `git diff --check`، `git diff -- package.json package-lock.json` فاضي.
9. **المتصفح:** لا — تسجيل توفر الأداة فقط.
10. **البيانات والحماية:** لا مفاتيح/توكنات في أي سجل. (إخفاء قيم Cloudinary).
11. **DoD:** Day 8 مصنّف رسميًا `SOURCE COMPLETE — PARTIAL HANDOFF`، Q1–Q6 مسجّلين، `D9-ENV` متحقق، التناقضات متصلحة، baseline مؤرخ.
12. **STOP:** `⛔ STOP — Gate 0`

### Gate 1 — Day 8 Closure Fixes (D9-CLOSE) — ✅ اتنفذت بإذن المالك قبل Day 9 (`PROGRESS §63`)

> **الحالة الفعلية:** SOURCE ✅ · AUTOMATED ✅ (lint/check/tsc/build EXIT 0) · BROWSER: DOM/HTML فقط (h1=1، preload ×1، CTA ثابت، `/cart` noindex) — الباقي NOT TESTED · OWNER: الشكل معتمد. أُضيف بنفس الإذن: إصلاح السبب الجذري لزرار السلة العايم (`tokens.css`)، إخفاؤه في `/checkout*`، شارة `99+`، `/cart` noindex. **الحقول أدناه تفضل كمرجع للي اتعمل، مش إذن جديد.**

1. **ID/الهدف:** G1 — إصلاح H1/H2/M1/M2 من `REVIEW_DAY8 §4` فقط.
2. **الإذن:** G0 مقبول + `G1 — DAY 9 DAY-8 CLOSURE FIXES`.
3. **النطاق:** (H1) `<h1>` للهوم + حذف المفاتيح الميتة · (H2) focus ring لكارت المنتج · (M1) إزالة `opacity:0` من CTA · (M2) `preload` للأول فقط.
4. **خارج النطاق:** M3–M5 وكل L* (إلا بقرار Q6)، أي إعادة تصميم، باك، أصول.
5. **الملفات:** §4.1.
6. **المسؤولية:** تعديل أصغر ما يمكن؛ الـ `<h1>` ما يغيّرش الشكل المعتمد (`sr-only` لو لزم)؛ الـ CTA يفضل بنفس شكله وحركته (CSS `animate-fade-up` بدل `initial` JS).
7. **العقود:** مفاتيح `ar/en` متطابقة؛ ما يتغيرش route ولا data ولا SEO canonical.
8. **الفحوص:** `lint/check/tsc/build` + `git diff --stat` (يتوقع ≤ 6 ملفات) + فحص HTML المصدر للهوم: **h1 واحد فقط** + عدم وجود `opacity:0` على الـ CTA.
9. **المتصفح:** الهوم ar/en، 360/desktop، الـ Tab على كارت المنتج (حلقة ظاهرة)، reduced-motion — لو مفيش أداة ⇒ NOT TESTED + قايمة المالك.
10. **البيانات والحماية:** صفر باك/API.
11. **DoD:** الأربعة منفذين بدليل مصدر؛ لا تراجع في الحركة المعتمدة؛ G5 اللي اعتمده المالك ما اتغيّرش بصريًا.
12. **STOP:** `⛔ STOP — Gate 1`

### Gate 2 — Dashboard Session & API Plumbing (D9-SESSION) — بدون UI

1. **ID/الهدف:** G2 — جلسة موظف آمنة وطبقة بيانات مخصصة للداشبورد.
2. **الإذن:** G1 مقبول + `D9-SEC-CLOUDINARY` متأكد من المالك (rotate تم/مجدول) + `D9-ENV` + إذن `G2 — DAY 9 SESSION & API PLUMBING`.
3. **النطاق:** عقود + Zod + cookie + `adminFetch` + `requireEmployee` + allowlist + Route Handlers + `dashboardApi` + تسجيله في `store.ts` + مفاتيح أخطاء.
4. **خارج النطاق:** أي صفحة/UI، أي mutation على منتجات، تعديل `baseApi.ts`، refresh token، باك.
5. **الملفات:** §4.2.
6. **المسؤولية:** الـ Route Handlers رقيقة (Zod → service → response)؛ المنطق في `lib/server/*`. الـ allowlist بيسمح في اليوم ده بـ `GET /products` + `/auth/me` بس. الـ cookie: `httpOnly`, `sameSite=lax`, `secure` في production, `maxAge` ≤ عمر JWT (**من غير ما نثق بفك JWT للتفويض**).
7. **العقود:** `§2.1` حرفيًا؛ الأخطاء `{success:false,message,code}` بتتحول لـ `IApiError`؛ 401 ⇒ مسح cookie.
8. **الفحوص:** `lint/check/tsc/build` + `git diff -- package.json package-lock.json` فاضي + مراجعة مصدر: لا `localStorage`، لا توكن في log، لا `baseApi` متغيّر، الـ proxy يرفض مسار/فعل خارج الـ allowlist (حالة اختبار قراءة مصدر + استدعاء محلي لو في بيئة).
9. **المتصفح/الشبكة:** لو في بيئة: login صح/غلط، Set-Cookie flags، طلب بدون cookie ⇒ 401، مسار خارج الـ allowlist ⇒ 403/404. وإلا NOT TESTED.
10. **البيانات والحماية:** صفر توكن/باسورد في التقارير. صفر كتابة على الباك.
11. **DoD:** الجلسة والـ proxy مصدريًا كاملين، الـ allowlist مغلقة، لا تسريب توكن عميل، `store.ts` تعديله سطرين فقط.
12. **STOP:** `⛔ STOP — Gate 2`

### Gate 3 — Employee Login + Guard (D9-LOGIN)

1. **ID/الهدف:** G3 — دخول/خروج/حماية.
2. **الإذن:** G2 مقبول + `G3 — DAY 9 LOGIN & GUARD`.
3. **النطاق:** `/dashboard/login` (Zod + RHF + أخطاء مترجمة + Shake عند الخطأ بالـ wrapper الموجود) + حارس `(protected)/layout` + logout + `loading/error` + `noindex` + `robots` + redirect لو الجلسة سليمة.
4. **خارج النطاق:** الهيكل (G4)، تذكّرني، نسيت الباسورد (الباك مفيهوش للموظف)، إنشاء موظف، Google.
5. **الملفات:** §4.3.
6. **المسؤولية:** الصفحة ≤30 سطر؛ الحارس داخل `<Suspense>` (cacheComponents)؛ الفورم بدون منطق شبكة (hook)؛ رسايل `INVALID_CREDENTIALS/EMPLOYEE_DISABLED/TOKEN_*/VALIDATION_ERROR/429/network` من `messages/`.
7. **العقود:** `§2.1`؛ `EMPLOYEE_DISABLED` رسالة مستقلة؛ `INVALID_CREDENTIALS` رسالة موحّدة (لا كشف وجود الإيميل).
8. **الفحوص:** `lint/check/tsc/build`؛ route table في الـ build يوضح الصفحات dynamic بدون تحذير؛ parity مفاتيح.
9. **المتصفح:** ar/en، 360/desktop، الثيمات الأربعة، خطأ بيانات، موظف معطل، انتهاء جلسة، Tab/focus، reduced-motion. NOT TESTED لو غابت البيئة.
10. **البيانات والحماية:** مفيش توكن/إيميل حقيقي في لقطات؛ مفيش `Authorization` في أي URL.
11. **DoD:** الدخول يشتغل، الخروج يمسح، `/dashboard/*` المحمية ترجّع الدخول من غير جلسة، الأخطاء مترجمة.
12. **STOP:** `⛔ STOP — Gate 3`

### Gate 4 — Dashboard Shell (D9-SHELL)

1. **ID/الهدف:** G4 — هيكل اللوحة (وظيفي، من غير حركة مخصصة).
2. **الإذن:** G3 مقبول + `G4 — DAY 9 DASHBOARD SHELL`.
3. **النطاق:** `LocaleSwitcher` ينتقل لـ `shared`؛ `Sheet`؛ Shell (sidebar collapsible/topbar/employee menu/breadcrumb)؛ نافبار حسب الدور؛ overview صادق بدون أرقام.
4. **خارج النطاق:** KPIs، صفحات الطلبات/العملاء (روابطها تظهر مقفولة/`soon` صادقة أو تتخفى — قرار G4)، dark mode، حركة مخصصة (G6).
5. **الملفات:** §4.4.
6. **المسؤولية:** `DashboardShell` يركّب بس؛ حالة الـ collapse في hook بـ `useSyncExternalStore` أو state محلي بدون effect؛ الموبايل = `Sheet` بـ `useDrawerFocus`؛ الأدوار مرآة UI (الباك الحَكَم).
7. **العقود:** `canAccess` مبني على `role` من `requireEmployee`؛ مفيش بيانات مفبركة في الـ overview.
8. **الفحوص:** `lint/check/tsc/build` + تأكد إن المتجر لسه شغال بعد نقل `LocaleSwitcher` (grep imports + build) + `git diff --stat`.
9. **المتصفح:** collapse/expand، موبايل، RTL (sidebar على اليمين)، 4 ثيمات، Tab order، لا horizontal overflow.
10. **البيانات والحماية:** STAFF ما يشوفش عناصر OWNER/ADMIN (مرآة)، مع التأكيد إن الحماية الحقيقية في الباك.
11. **DoD:** shell يتركّب على كل صفحة محمية، تنقّل سليم، المتجر لم يتأثر.
12. **STOP:** `⛔ STOP — Gate 4`

### Gate 5 — Products List, Read-only (D9-PRODUCTS-LIST)

1. **ID/الهدف:** G5 — جدول المنتجات قراءة فقط ببيانات حقيقية.
2. **الإذن:** G4 مقبول + `G5 — DAY 9 PRODUCTS LIST`.
3. **النطاق:** `/dashboard/products`: بحث `q` + ترتيب (`sortBy/sortOrder` من enum الباك فقط) + pagination + `limit` من `searchParams`؛ أعمدة حقيقية: الاسم (ar/en) · slug · النوع · الحالة · مميز · تاريخ النشر · آخر تحديث؛ skeleton/empty/error/no-results.
4. **خارج النطاق:** إضافة/تعديل/حذف/أرشفة (يوم 10)، صور/أسعار/عدد باكدجات (BE-4)، فلتر حالة/قسم (BE-1)، bulk، export، CSV import UI.
5. **الملفات:** §4.5.
6. **المسؤولية:** الصفحة تركيب؛ البيانات `adminFetch` داخل `<Suspense>`؛ حالة الجدول = URL؛ `searchParams` تتحقق بـ Zod قبل ما توصل للباك (قيم افتراضية آمنة)؛ `Pagination` مشترك والمتجر بيستخدمه بعد التعميم.
7. **العقود:** `§2.1`؛ مفيش فلتر مفتعل أو ترتيب client-side يوهم؛ الحالة تتعرض بـ Badge من variants الموجودة وترجمة `messages/`.
8. **الفحوص:** `lint/check/tsc/build` + parity + حجم الملفات + مراجعة مصدر إن كل رابط pagination بيحافظ على `q/sort`.
9. **المتصفح:** بحث (عربي/إنجليزي)، ترتيب، صفحات، صفر نتائج، خطأ API (باك موقوف)، 401 أثناء الصفحة ⇒ رجوع للدخول، 360px (الجدول ينزلق أفقيًا داخل الحاوية فقط)، RTL، 4 ثيمات.
10. **البيانات والحماية:** قراءة فقط؛ لا mutation؛ لا لقطات فيها بيانات حساسة.
11. **DoD:** الجدول يعكس الباك بدقة، URL قابل للمشاركة، كل الـ states، صفر mock، حدود BE-4/BE-1 موثّقة في الواجهة كـ "غير متاح بعد" **أو** مخفية (قرار المالك).
12. **STOP:** `⛔ STOP — Gate 5`

### Gate 6 — Style & Motion (Dashboard feel)

1. **ID/الهدف:** G6 — لمسة الحركة والهوية للداشبورد بعد ثبات الهيكل.
2. **الإذن:** G1–G5 مقبولة + `G6 — DAY 9 STYLE & MOTION` + مراجعة شكل مع المالك.
3. **النطاق (مقترحات للنقاش، مش التزام):** دخول كارت الـ login (`BorderBeam` خفيف + `Shake` للخطأ)، انزلاق/تحجيم الـ sidebar، stagger لصفوف الجدول عند تغيّر الصفحة، `CountUp` لإجمالي المنتجات، hover/press لعناصر النافبار والصفوف، انتقال ناعم بين الصفحات (`template.tsx` القائم)، toast للأخطاء. **ألوان البراند/التوكنات فقط**.
4. **خارج النطاق:** مكتبات حركة جديدة، تغيير توكنات، dark mode، حركة تعيق قراءة/إدخال بيانات.
5. **الملفات:** المكوّنات المعنية + `styles/animations.css` (keyframe واحد دلالي إن لزم).
6. **المسؤولية:** `m.*` والـ wrappers أولًا؛ transform/opacity؛ `prefers-reduced-motion` إلزامي؛ الجداول كثيفة البيانات ⇒ حركة مقتصدة.
7. **العقود:** الحركة ما تغيّرش بيانات/روابط/ترتيب focus.
8. **الفحوص:** `lint/check/tsc/build` + مراجعة reduced-motion مصدريًا.
9. **المتصفح:** مصفوفة كاملة (ar/en، 360/desktop، 4 ثيمات، normal/reduced، لا flicker/overflow).
10. **اعتماد المالك:** الشكل 🟡 حتى يعتمده؛ لا ترقية تلقائية.
11. **DoD:** حركة تحسّن الفهم ولا تؤخر العمل، لا تغيير عقود.
12. **STOP:** `⛔ STOP — Gate 6`

### Gate 7 — Browser / Manual Evidence

1. **ID/الهدف:** G7 — تحويل NOT TESTED لدليل فعلي (Day 8 + Day 9).
2. **الإذن:** G1–G6 + `G7 — DAY 9 BROWSER EVIDENCE` + بيئة محلية مأذونة **أو** تنفيذ يدوي من المالك. **(قرار Q2: اختبار Day 8 اليدوي بيتنفذ قبل G2 وبيتسجل في `PROGRESS.md`؛ G7 ده للمصفوفة الخاصة بـ Day 9 فقط.)**
3. **النطاق:** قايمة `REVIEW_DAY8 §6` + مصفوفة Day 9: login (نجاح/فشل/معطل/انتهاء)، guard، shell، products (بحث/ترتيب/صفحات/خطأ)، Network (Set-Cookie flags، صفر توكن في URL/JS)، Console، reduced-motion، 4 ثيمات، ar/en، 360/desktop، Tab/focus. + Lighthouse يدوي للهوم والـ PDP (قياس غير ختمي).
4. **خارج النطاق:** إصلاح عيوب داخل الـ Gate، production، Google، mutations.
5. **الملفات:** `PROGRESS.md` فقط.
6. **المسؤولية:** سجّل ما شوهد فقط: `PASS` بدليل / `FAIL` بدليل / `NOT TESTED`. أي FAIL ⇒ بند مفتوح يتصلح بإذن لاحق.
7. **العقود:** لا بيانات حساسة في اللقطات (إيميل موظف/توكن).
8. **الفحوص:** DOM + Visual + Console + Network منفصلين.
9. **المتصفح:** هو الغرض كله.
10. **اعتماد المالك:** 🟡 حتى يعتمد بصريًا.
11. **DoD:** تقرير صادق، مفيش `PASS` من غير تنفيذ.
12. **STOP:** `⛔ STOP — Gate 7`

### Gate 8 — Final Review & Handoff + Docs Sync

1. **ID/الهدف:** G8 — تسليم Day 9 ومزامنة الوثائق.
2. **الإذن:** إذن مالك بعد مراجعة الـ Gates المفتوحة.
3. **النطاق:** `PROGRESS.md` (جدول Gate/Evidence/Blockers + بانر)، `DAY9_TASKS.md` (حالة فعلية)، `AGENTS.md` (`[planned]`→`[exists]` لـ `(Dashboard)`/`app/api`/`Sheet`/`Table`/`dashboardApi`/`adminFetch`)، `FRONTEND_TASKS_10_DAYS.md` (جدول الأيام)، ملاحظة إغلاق في `REVIEW_DAY8.md`.
4. **خارج النطاق:** إصلاح عيوب، فتح Day 10، production seal.
5. **الملفات:** وثائق فقط.
6. **المسؤولية:** جدول `KS-17..KS-21` + كل ID في §5 + فصل SOURCE/AUTOMATED/BROWSER/OWNER؛ `D15-SEO-SITEMAP` مؤجل؛ حالة طلبات الباك `BE-1..BE-9`.
7. **العقود:** مفيش قبول بدون دليل.
8. **الفحوص:** استشهد بالأوامر المؤرخة وأرقامها/exit codes.
9. **المتصفح:** انقل ما شوهد فعليًا فقط.
10. **الاعتماد:** Astra يوصي، المالك يعتمد.
11. **DoD:** وثائق متطابقة مع الواقع، STOP أخير.
12. **STOP:** `⛔ STOP — Gate 8`

---

## 7) معايير القبول — KS الجديدة

| KS | المعيار |
|---|---|
| **KS-17** | Day 8 مقفول رسميًا `SOURCE COMPLETE — PARTIAL HANDOFF` + الإصلاحات الأربعة (h1 للهوم، focus للكارت، CTA بدون opacity:0، preload للأول) |
| **KS-18** | جلسة موظف httpOnly + proxy بـ allowlist + لا تسريب توكن + لا استخدام لـ `baseApi` |
| **KS-19** | دخول/خروج/حارس يعمل، أخطاء مترجمة، انتهاء الجلسة بيرجّع للدخول |
| **KS-20** | Shell كامل (sidebar/topbar/breadcrumb/موبايل) + أدوار + RTL، والمتجر لم يتأثر |
| **KS-21** | قائمة المنتجات قراءة فقط بيانات حقيقية، URL state، كل الـ states، بلا mock |

---

## 8) أوامر التحقق — تُسجَّل وقت التنفيذ

من `Om-Eman/frontend`، كل أمر لوحده بعد كل Gate كود: `npm run lint`, `npm run check`, `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`, `npm run build`, `git status --short --untracked-files=all`, `git diff --check`, `git diff --stat`, `git diff -- package.json package-lock.json`. أي dependency diff ⇒ STOP. لا توكنات/أسرار في المخرجات.

---

## 9) المخاطر

| ID | الخطر | الإجراء |
|---|---|---|
| R-D9-OWNER | لا إذن لأي Gate | STOP |
| R-D9-SECRET | سر Cloudinary مكشوف | rotate قبل G2؛ تسجيل التنفيذ بدون قيم |
| R-D9-TOKEN-LEAK | استخدام `baseApi` للداشبورد | ممنوع؛ `dashboardApi` منفصل |
| R-D9-OPEN-PROXY | proxy بدون allowlist | allowlist مسارات+أفعال، رفض باقي الطلبات |
| R-D9-NO-REVOKE | الباك مفيهوش logout/revoke | logout = مسح cookie؛ يتوثق + BE-5 |
| R-D9-STAFF | STAFF يقرأ بيانات حساسة من الباك | مرآة UI + BE-6؛ مش بنخبي حاجة ونفترض أمان |
| R-D9-FAKE-KPI | إغراء أرقام overview | ممنوع حتى BE-7 |
| R-D9-N+1 | جدول غني بنداءات متعددة | ممنوع؛ BE-4 |
| R-D9-CACHE | قراءة `cookies()` تخلّي الـ route dynamic بدون Suspense | `<Suspense>` + `loading.tsx`؛ مفيش `"use cache"` على بيانات محمية |
| R-D9-LOCALE-MOVE | نقل `LocaleSwitcher` يكسر الهيدر | grep + build قبل/بعد |
| R-D9-BROWSER | لا أداة متصفح | قايمة يدوية Q2 |
| R-D9-SEAL | ختم إنتاج بدون دليل | ممنوع؛ `D8-SEAL`/`D9-SEAL` NOT SEALED |

---

## 10) قالب تقرير كل Gate

1. Gate / الإذن / البيئة / التاريخ.
2. جدول `Task ID | الحالة | الملف الفعلي | المسؤولية | الدليل`.
3. أوامر + exit codes + مقتطفات بلا أسرار.
4. الانحرافات و untracked/dependencies/باك/DB.
5. المتبقي من KS-17..21 وكل ID في §5.
6. توصية Astra ثم اعتماد المالك منفصل.
7. آخر سطر `⛔ STOP — Gate N`.

---

## 11) طلب مراجعة Astra والاعتماد

يرجى من Astra مراجعة هذا الملف مقابل `AGENTS.md` و`REVIEW_DAY8.md` و`FRONTEND_TASKS_10_DAYS.md §0.3`، واكتمال الـ 12 حقل لكل Gate، وحدود الأمان (§0.5)، وعدم بناء UI على endpoints الباك الناقصة، وعدم فتح Day 10+ أو أي Gate تلقائيًا.

**قرار Astra:** لم يُطلب بعد.
**اعتماد المالك:** لم يُطلب بعد.
**الإذن الحالي:** `DAY 9 PLAN WRITTEN — NO GATE OPENED — NO IMPLEMENTATION AUTHORIZED`.

⛔ STOP — DAY 9 PLAN WRITTEN — NO GATE OPENED — NO IMPLEMENTATION AUTHORIZED
