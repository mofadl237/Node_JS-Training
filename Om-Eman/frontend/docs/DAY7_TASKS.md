# اليوم 7 — Storefront: التتبع + حساب العميل + دمج السلة — تاسكات التخطيط والتفكيك

> آخر تحديث: 2026-11-23. **حالة المستند: G6 — DAY 7 FINAL REVIEW & HANDOFF OPEN — DOCUMENTATION ONLY — DAY 7 — PARTIAL HANDOFF — WAITING FOR OWNER FINAL REVIEW.**
> **المدير/المراجع:** Astra. **المنفّذ المقترح:** GLM. **المالك:** صاحب القرار في النطاق، العقود، حفظ توكن العميل، Google، فتح كل Gate والانتقال للي بعده.
> **الخط المتبع في الملف:** `FRONTEND_TASKS_10_DAYS.md:31-43` §0.3 «الجدول المعدّل (14 يوم بدل 10، ومرن)» → مرحلة `C — Storefront`: هوم → كتالوج → منتج → سلة → checkout → **تتبع → حساب العميل**. خطة `FRONTEND_TASKS_10_DAYS.md:215` القديمة «اليوم 7 — Dashboard: التقارير + العملاء + الأمان» مرجع تاريخي فقط وليست المسار الحالي. محتوى `FRONTEND_TASKS_10_DAYS.md:247-251` مرجع للمحتوى لا للمسارات، لأن قرار الإيصال النهائي يمنع `trackingToken` في route صفحة المتصفح.
> المسارات نسبية إلى `Om-Eman/frontend/` إلا لو ذُكر الباك صراحة. هذا ملف تخطيط ومراجعة Day 7 فقط؛ لا يفتح Gate ولا يسمح بكود/باك/DB/env/deps/commit. كل Gate محتاج إذن مالك صريح باسمه.

---

## 0) قواعد التعامل — اقرأها الأول

1. قبل أي Gate: اقرأ `AGENTS.md`، `PROGRESS.md` §37/§38، هذا الملف، وعقود الباك في §3. تحقّق من إذن مالك باسم Gate بعينه، وافحص `git status` والكود قبل أي تعديل. أي تعارض عقد/قرار ⇒ STOP وسؤال المالك.
2. منفّذ واحد في وقت واحد: GLM يعرض قائمة الملفات ومسؤولية كل ملف، ينفّذ Gate واحدًا، يشغّل الفحوص، يراجع diff/untracked، يحدّث `PROGRESS.md`، ويسلّم ويقف. Astra يراجع ولا يعدّل بالتوازي.
3. حتى مع توصية Astra بالقبول، الانتقال للـGate التالية أو اعتماد الشكل/الحركة النهائي يحتاج موافقة المالك. لا يُترجم «كود جاهز» إلى «اعتماد بصري 🟢».
4. **الاركتيكتشر مجمد:** نفس App Router، ترتيب `NextIntlClientProvider > ReduxProvider > ThemeProvider > MotionProvider`، نفس `store/baseApi.ts` كبوابة API واحدة، `interface/`، `components/Skelton/`، `hooks/`، `components/Animation/`، `@/` imports، TypeScript strict. لا restructure، لا slice/fetch wrapper/provider موازٍ، لا cart slice جديد، لا cookie/localStorage key جديد للسلة، لا تغيير استراتيجية الكاش العامة، لا استيراد بين `ECommerce` و`Dashboard`.
5. **القرارات النهائية المُعتمدة مجمدة:** إيصال الجلسة في `sessionStorage` بلا `trackingToken` في route الصفحة/canonical/JSON-LD/analytics/التقارير؛ **Public Cloudinary Delivery لإثبات الدفع مقبول من المالك**؛ Private Delivery ليس شرطًا لقبول Day 6 ولا يوجد إذن لتنفيذه، لذلك لا يُفتح في Day 7؛ G6 الكلي ما زال `BLOCKED / NO-GO` لأسباب runtime/browser/env لا بسبب public proof؛ لا production seal. لا يُعاد فتح أي قرار منهم في Day 7.
6. الملفات ≤150 سطر هدفًا و200 حدًا أقصى، ملف لكل مسؤولية، الصفحة للتركيب فقط (هدف ≤30)، `I` للـinterfaces و`T` للـunions، لا `any` ولا casts لإسكات الأخطاء، لا نصوص مستخدم hard-coded، لا ألوان خام.
7. مفيش dependencies، edits للباك/DB/migrations/seed/npm scripts/config/env/deployment، ولا commit/push/deploy. مسار API جديد (إن لزم) يحتاج إذن باك منفصل؛ لا يُستبدل بـfetch مباشر أو route handler موازٍ.
8. الـUI states إلزامية: loading skeleton، error، empty، success، وmutation feedback. كل فشل يظهر رسالة مترجمة من `messages/` حسب `code`؛ لا raw message/stack/SQL.
9. في كل تقرير افصل: **منفّذ في المصدر / فحص آلي بنتيجة / شوهد في متصفح / 🟢 اعتمده المالك / ⛔ محجوب أو لم يُختبر**. HTTP 200 مش acceptance.
10. الشكل والحركة بعد الهيكل فقط، وبإذن منفصل `G5 — DAY 7 STYLE & MOTION`. لا حركة/تجميل في G1–G4؛ استخدم wrappers الموجودة و`prefers-reduced-motion`، Tailwind variables فقط.
11. مصادر العقود: `backend/src/modules/store/{auth,track,cart}/**`، `backend/src/services/customer-claim.service.ts`، `backend/docs/{STORE_BACKEND_TASKS,BACKEND_PROGRESS}.md`. أي تعارض بين الخطة القديمة والكود ⇒ الكود + قرارات المالك الحالية أعلى.
12. working tree موروث dirty من Days 1–6 والإصلاح الأمني؛ لا reset/checkout/overwrite. الإضافات البصرية غير المعتمدة (`R-VIS`) تبقى للمراجعة، ولا تُصلح تلقائيًا.

---

## 1) الهدف والنطاق

### 1.1 الهدف
- **D7-TRACK:** صفحة `/{locale}/track` تعرض بيانات الطلب المسموح بها من `GET /api/store/track/:trackingToken`: رقم الطلب، الحالتين، تاريخ الطلب/التسليم، ETA، والبنود. لا هوية/عنوان/هاتف.
- **D7-ACCOUNT:** تسجيل/تحقق/دخول/خروج/نسيان/إعادة تعيين/ملف العميل عبر `/api/store/auth/*`، مع Google كمسار مشروط بقرار/env منفصل.
- **D7-MERGE:** بعد الدخول الناجح يُرسل `POST /api/store/cart/merge` بـ`guestToken` الحالي + توكن العميل؛ تُعرض رسالة صادقة بنتيجة الدمج دون ادعاء اكتمال تجربة السلة إن كان العقد ناقصًا.

### 1.2 داخل النطاق (بعد إذن Gates)
- عقود/validation/رسائل `track.*`, `account.*`, `cart.merge.*` و`lib/routes.ts`.
- API endpoints عبر `baseApi.injectEndpoints` فقط: track query، auth mutations/queries، cart merge mutation.
- صفحات track وaccount الرقيقة + skeletons + حالات + hooks منفصلة + مكوّنات عرض صغيرة.
- مصفوفة تحقق source/check/tsc/diff/build بلا runtime write حتى بيئة مأذونة.

### 1.3 خارج النطاق / موعده
- TODO: Dashboard القديم في `FRONTEND_TASKS_10_DAYS.md:215-221`، التقارير/العملاء/audit كمسار موظفين (مرحلة B).
- خارج النطاق: أي تنفيذ لـCloudinary Private/Signed Delivery أو تعديل uploads/proof؛ **غير مأذون وليس شرطًا لقبول Day 6**. Public Delivery مقبول كما هو ولا يُغيَّر في Day 7.
- TODO: إصلاح `R-API-SEARCH`, `R-CART-WRITE`, `R-VIS`, `R-G4-MAJOR`, `D3-RM`, `B-PUB`، انحرافات Day 5، `B-Build`. تُسجَّل في §6 وتُوزَّع، ولا تُصلح تلقائيًا.
- TODO: backend جديد (مثل قراءة سلة العميل بعد الدمج)، env/config، dependencies، cron، seed، production.

### 1.4 KS المقترحة
- **KS-6:** `/{locale}/track` يعرض الحد الأدنى من بيانات باك حقيقية بمجرد توفير `trackingToken` من إيصال الجلسة أو إدخال يدوي، بلا token في route الصفحة أو بيانات وصفية.
- **KS-7:** الدخول البريد ينتج توكن عميل صالحًا ويُكمل `me/logout`؛ Google ودمج السلة يظلان مشروطين بقرارات G0.
- **KS-8:** `cart/merge` يُرسل مرة واحدة بعد الدخول، وتُرجم نتيجته (`mergedCartId` أو `null`) بلا سلة مختلقة.

---

## 2) تدقيق الحالة قبل التخطيط

| المصدر | الحقيقة المؤثرة |
| --- | --- |
| `FRONTEND_TASKS_10_DAYS.md:31-43` | الخطة المعدّلة تضع المتجر قبل اللوحة؛ اليوم 7 الحالي هو نهاية مسار Storefront لا مسار Dashboard. |
| `FRONTEND_TASKS_10_DAYS.md:247-251,269-282` | track/auth/merge متاحة في الباك؛ توكن العميل opaque ويُرسل Bearer؛ لكن مسار `/track/[trackingToken]` القديم موقوف بقرار الإيصال. |
| `DAY6_TASKS.md:36,113,154,208-222,461-472` | track/account/merge مؤجلة صريحًا؛ Public Cloudinary Delivery مقبول وPrivate Delivery غير مأذون وغير مطلوب لقبول Day 6؛ G6 `NO-GO` لأسباب runtime/browser/env؛ الاعتماد الأمني لا يفتح Gate. |
| `PROGRESS.md §37/§38` | إصلاح إثبات الدفع مقبول في المصدر فقط؛ Public Cloudinary Delivery مقبول وPrivate Delivery غير مأذون؛ runtime/browser/production `NOT TESTED`; لا تغيير اركتيكتشر. |
| `backend/src/modules/store/track/routes.ts:11-20` | `GET /track/:trackingToken`، rate limit 60/15د، validation على param. |
| `backend/src/modules/store/track/types.ts:3-19` | `ITrackedOrder` بلا أي بيانات شخصية؛ `placedAt/deliveredAt` تواريخ، ETA أرقام أو `null`. |
| `backend/src/modules/store/auth/routes.ts:21-40` | ثمانية endpoints، auth limiter 10/15د على ما يمنح هوية، `me/logout` يحتاج Bearer. |
| `backend/src/modules/store/auth/types.ts:3-24` | `{ customer, token, expiresInDays }`؛ `devVerificationLink` في dev فقط. |
| `backend/src/modules/store/auth/validation.ts:3-54` | قواعد email/password/phone/credential/token؛ لا يوجد refresh endpoint. |
| `backend/src/modules/store/cart/routes.ts:19-24`, `validation.ts:16-18` | `POST /cart/merge` بجسم `{ guestToken }` وبـ`authenticateCustomer`. |
| `backend/src/services/customer-claim.service.ts:348-425` | الدمج يجمع البنود ويجعل سلة الضيف `MERGED` مع `mergedIntoCartId`؛ تكرار الدمج على سلة غير ACTIVE يعيد `mergedCartId: null` دون خطأ. |
| `frontend/lib/orderReceipt.ts`, `hooks/useOrderReceipt.ts` | الإيصال موجود في `oe.order.receipt` مع `trackingToken` وSSR guard؛ قابل لإعادة استخدامه في track. |
| `frontend/store/cartApi.ts`, `lib/cartToken.ts` | cart token reader و`getOrCreateCart` موجودان؛ لا cart slice ولا API slice موازٍ. |

**فجوة عقد موثّقة:** لا يوجد endpoint قراءة سلة بعد الدمج بصورة `customerId`؛ `GET /store/cart` يعمل بـ`guestToken` فقط، وسلة الضيف بعد الدمج تصبح `MERGED`. لذلك اختبار «السلة بعد الدمج» محجوب حتى يقرر المالك فتح عمل باك منفصل؛ لا يُخترع endpoint ولا يُعاد استخدام توكن منتهي.

---

## 3) العقود الحقيقية — قراءة فقط

### 3.1 Track
- `GET /api/store/track/:trackingToken` (`track/routes.ts:20`) ⇒ envelope `{ success, message, data: ITrackedOrder }`.
- `ITrackedOrder`: `orderNumber`, `status`, `paymentStatus`, `placedAt`, `deliveredAt`, `etaMinDays`, `etaMaxDays`, `items[{ productNameAr, sku, quantity, lineTotal }]`.
- `quantity/lineTotal` decimal strings؛ لا `Number()` للحساب؛ التواريخ تُنسَّق في helper واحد حسب locale.
- أخطاء متوقعة: `VALIDATION_ERROR`، `TRACK_*`/`NOT_FOUND` حسب مصدر الباك، `TOO_MANY_REQUESTS`. لا مخاطرة بعرض رقم الطلب من مصدر محلي.
- **صفحة المتصفح:** `/{locale}/track` فقط. يقرأ hook الإيصال أو يستقبل token في حقل إدخال يدوي؛ token يظهر فقط في مسار طلب الـAPI الضروري، ولا يظهر في route الصفحة/canonical/OG/JSON-LD/analytics/التقارير. لو احتاج المالك رابط تتبع قابل للمشاركة، فهو قرار جديد يخالف القرار الحالي ⇒ STOP.

### 3.2 Customer auth
- `POST /register` body: `email`, `password(8..72)`, `firstName?`, `lastName?`, `phone?`؛ الرد `{ customer, token, expiresInDays, devVerificationLink? }` في غير production فقط.
- `POST /verify-email` `{ token }`؛ `POST /login` `{ email, password }` ⇒ `{ customer, token, expiresInDays }`.
- `POST /google` `{ credential }` ⇒ `{ customer, token, expiresInDays }`؛ يتطلب `GOOGLE_CLIENT_ID` في الباك وإلا `GOOGLE_NOT_CONFIGURED`.
- `POST /forgot-password` `{ email }` رد عام دائمًا؛ `POST /reset-password` `{ token, password }`.
- `POST /logout` و`GET /me` يحتاجان `Authorization: Bearer <customer token>`.
- أخطاء متوقعة: `EMAIL_ALREADY_REGISTERED`, `EMAIL_NOT_VERIFIED`, `INVALID_CREDENTIALS`, `CUSTOMER_UNAVAILABLE`, `TOKEN_INVALID/USED/EXPIRED`, `GOOGLE_NOT_CONFIGURED/INVALID/EXPIRED`, `TOO_MANY_REQUESTS`. كلها مفاتيح `account.errors.*` متطابقة ar/en.
- **قرار مفتوح في G0:** مكان حفظ توكن العميل (memory/sessionStorage/route handler httpOnly) وسياسة البقاء بعد reload؛ لا يُختار تلقائيًا، لا localStorage جديد، ولا httpOnly cookie جديد بدون إذن صريح.

### 3.3 Cart merge
- `POST /api/store/cart/merge` مع `Authorization: Bearer <token>` وbody `{ guestToken: 20..64 [A-Za-z0-9_-] }`.
- الرد `{ mergedCartId: string | null }`؛ `null` يعني سلة الضيف غير ACTIVE (مُدمجة/مشتراة) وليس فشلًا بالضرورة.
- لا يعيد token سلة جديدة ولا بيانات سلة؛ لا تعرض بنودًا أو إجماليًا من الرد؛ لا ترسل merge قبل نجاح الدخول؛ لا تعيد المحاولة تلقائيًا عند فشل الشبكة.
- الدمج في الباك claim تلقائي للهوية عبر email/Google؛ لا endpoint `claim` منفصل في الفرونت ولا تعديل على customer.

---

## 4) الموجود فعليًا في الفرونت — أعد استخدامه

| الاحتياج | الموجود | القرار |
| --- | --- | --- |
| API gateway | `store/baseApi.ts`, `unwrapEnvelope`, `IApiError` | كل endpoint جديد بحقنه؛ لا fetch مباشر، لا instance ثانٍ. |
| توكن الضيف | `lib/cartToken.ts`, `hooks/useCartToken.ts`, `store/cartApi.ts` | استخدم القارئ الحالي؛ أضف mutation merge في نفس الملف لا slice جديد. |
| إيصال الطلب | `lib/orderReceipt.ts`, `hooks/useOrderReceipt.ts`, `validation/orderReceipt.ts` | استخدمها في track؛ لا storage key جديد للإيصال. |
| توكن العميل | غير موجود | G0 يقرر الحفظ؛ G1 يضيف helper واحدًا و`prepareHeaders` داخل `baseApi` فقط بإذن. |
| التوجيه | `@/i18n/navigation`, `lib/routes.ts` | أضف `TRACK_HREF`, `ACCOUNT_HREF`, مسارات الحساب؛ لا `/ar/` hard-coded. |
| الحالات/الشكل | `EmptyState`, `ErrorState`, `Skeleton`, `Badge`, `Button`, `Input`, `components/Skelton/*` | أعد الاستخدام قبل أي primitive جديد. |
| الأنيميشن | `FadeIn`, `Stagger`, `Shake`, `CountUp`, `BorderBeam`, `Spotlight`, `m.*` | G5 فقط، وبعد اعتماد الهيكل؛ لا مكتبة جديدة. |
| الرسائل | `messages/{ar,en}.json` | أضف `track.*`, `account.*`, `cart.merge.*` بالتساوي وICU صحيح. |

---

## 5) جرد الملفات المتوقع — أسماء متوقعة، ليست إذن إنشاء

> كل ملف جديد يجب أن يمرّ باختبار «مسؤولية واحدة». لو ملف موجود يؤدي نفس الدور، أعد استخدامه وسجّل الاسم الفعلي. لا تُنشأ ملفات Gate لاحقة قبل إذنها.

### 5.1 Contracts وvalidation وhelpers

| الملف | جديد/تعديل | المسؤولية |
| --- | --- | --- |
| `interface/track.ts`, `interface/customerAuth.ts`, `interface/index.ts` | جديد/تعديل | `ITrackedOrder`, `IStoreCustomer`, `ICustomerAuthResponse`, `IMergeCartResult`؛ لا DTO موازٍ. |
| `validation/track.ts` | جديد | token pattern وحماية الرد عند الحاجة؛ لا واجهة شبكة ثانية. |
| `validation/customerAuth.ts`, `validation/cartMerge.ts`, `validation/index.ts` | جديد/تعديل | Zod مطابق للباك. |
| `lib/customerSession.ts` | جديد | مساعد واحد لحفظ/قراءة/مسح توكن العميل **بعد قرار G0**؛ لا storage key جديد تلقائيًا. |
| `lib/routes.ts` | تعديل | `TRACK_HREF`, `ACCOUNT_HREF`, `ACCOUNT_*_HREF`؛ لا مسارات مبنية باليد. |
| `lib/accountError.ts` | جديد | خريطة `code` إلى مفاتيح الرسائل؛ لا raw message. |
| `lib/trackFormat.ts` | جديد | تنسيق التاريخ وترجمة enum الحالة من الرسائل فقط. |

### 5.2 API endpoints

| الملف | جديد/تعديل | المسؤولية |
| --- | --- | --- |
| `store/trackApi.ts` | جديد | query track عبر `baseApi.injectEndpoints`؛ لا token في tag/cache key يظهر في التقارير. |
| `store/authApi.ts` | جديد | register/verify/login/google/forgot/reset/logout/me؛ `invalidatesTags` للجلسة والسلة عند النجاح فقط. |
| `store/cartApi.ts` | تعديل | إضافة `mergeCart` فقط؛ لا نسخة جديدة من cart service. |

### 5.3 Routes وUI

| الملف | جديد/تعديل | المسؤولية |
| --- | --- | --- |
| `app/[locale]/(Store)/track/{page,metadata,loading}.tsx` | جديد | صفحة رقيقة noindex بلا token في route؛ skeleton مطابق. |
| `app/[locale]/(Store)/account/{page,metadata,loading}.tsx` + `login/`, `register/`, `verify-email/`, `forgot-password/`, `reset-password/` | جديد | كلها noindex، metadata/hreflang عبر `buildMetadata()`، loading مطابق. |
| `components/ECommerce/Track/{TrackSection,TrackLookupForm,TrackSummary,TrackTimeline,TrackItems,TrackState}.tsx` | جديد | عرض فقط، لا API مباشر. |
| `components/ECommerce/Account/{AccountSection,LoginForm,RegisterForm,VerifyEmailForm,ForgotPasswordForm,ResetPasswordForm,AccountProfile,GoogleButton,AccountState}.tsx` | جديد | GoogleButton مشروط بقرار G0. |
| `components/Skelton/{TrackSkeleton,AccountSkeleton}.tsx` | جديد | نفس أبعاد الشاشات. |
| `hooks/{useTrackLookup,useCustomerAuth,useCartMerge}.ts` | جديد | منطق منفصل؛ لا hook كبير يجمع الثلاثة. |
| `messages/{ar,en}.json` | تعديل | `track.*`, `account.*`, `cart.merge.*` متطابقة. |

---

## 6) سجل مؤجلات Day 6 — يُقرأ في G0 ولا يُفتح تلقائيًا

| ID | البند | الحالة الموروثة | القرار المقترح للتوزيع |
| --- | --- | --- | --- |
| D7-TRACK | Track كامل + timeline + ETA | Day 6 P2 → Day 7 | G2؛ لا رابط token في route. |
| D7-ACCOUNT | Login/Google/Email + me | Day 6 P2 → Day 7 | G3 email أولًا؛ Google G4 مشروط. |
| D7-MERGE | `POST /cart/merge` | Day 6 P2 → Day 7 | G4؛ قراءة السلة بعد الدمج محجوبة بفجوة عقد. |
| R-API-SEARCH | Search runtime | مفتوح من Day 5 | G0 يسجّل البيئة فقط؛ لا إصلاح implementation. |
| R-CART-WRITE | PATCH/DELETE cart runtime | مفتوح من Day 5 | G0 يسجّل القيد؛ لا كتابة سلة جديدة في G1–G4. |
| R-VIS | Browser acceptance | مفتوح | مصفوفة Day 7 مستقلة؛ 🟡 حتى اعتماد المالك. |
| R-G4-MAJOR / D3-RM | fly target / reduced motion قديمان | مفتوح P2 | لا يُلمسا؛ G5 يستخدم reduced-motion لكوده فقط. |
| B-PUB | Negative cases لـDay 4 | NOT-TESTED | G0 يسجّلها؛ لا إعادة فتح Day 4. |
| Day 5 deviations | native fallback/grid/noindex/drawer/focus/`Number` | مفتوحة P2 | سجل فقط؛ أي إصلاح Gate منفصل بإذن. |
| B-BUILD | خطر Turbopack تاريخي | مسجّل | لا tooling/Next config؛ آمن فقط بأوامر G6. |
| R-PRIVATE-PROOF | Cloudinary Private/Signed Delivery للإثبات | `NOT AUTHORIZED — NOT REQUIRED FOR DAY 6` | Public Delivery مقبول؛ لا تنفيذ Private/signed بلا إذن مالك جديد. |
| R-G6-SEAL | G6 production seal | `BLOCKED / NO-GO` | لا يُرفع إلى 🟢 بسبب غياب runtime/browser/env؛ public proof لا يغيّر الحالة. |

---

## 7) خطة الـGates — 12 حقل لكل Gate

> كل Gate تقف وحدها؛ جدول §5 متوقّع، لا يُنشأ شيء قبل إذن هذه الـGate بعينها.

### Gate 0 — Pre-flight وتثبيت القرارات (docs/baseline فقط)

1. **ID/الهدف:** G0؛ فصل سلامة البيئة وتوزيع المؤجلات والقرارات المعلّقة عن implementation.
2. **الاعتماد/الإذن:** إذن مالك مستقل باسم `G0 — DAY 7 PRE-FLIGHT`؛ صفر تعديل مصدر.
3. **النطاق:** قراءة `AGENTS/PROGRESS/هذا الملف/عقود الباك`، `git status --short`، فحص `:3001/:3002`، آخر build/check، وتصنيف §6.
4. **خارج النطاق:** لا track UI، لا account، لا merge، لا إصلاح blockers، لا باك/DB/env.
5. **الملفات المتوقعة:** `PROGRESS.md` فقط لتسجيل الأدلة/القرارات.
6. **المسؤولية:** وثيقة فقط؛ لا ملفات مصدر جديدة.
7. **العقود المطلوب تأكيدها:** track response/status codes، auth responses/codes، merge response، ومكان حفظ توكن العميل.
8. **قرار المالك المطلوب:** (أ) تخزين توكن العميل؛ (ب) Google: تأجيل أم توفير client ID وموافقة script؛ (ج) فجوة قراءة السلة بعد الدمج: accept limitation أم فتح باك منفصل؛ (د) إبقاء `/track` بلا token في route.
9. **الفحوص:** سجّل أوامر القراءة separately؛ لا tokens في التقارير؛ HTTP 200 ليس acceptance.
10. **المتصفح:** لا شاشة Day 7 هنا؛ سجّل توفر المتصفح/قيوده فقط.
11. **DoD:** baseline مؤرّخ + مؤجلات موزّعة + القرارات الأربعة مسجّلة + blockers ظاهرة.
12. **STOP:** `⛔ STOP — Gate 0`

### Gate 1 — Contracts وValidation وAPI helpers

1. **ID/الهدف:** G1؛ تجهيز الأنواع والمدخلات وكل endpoints بلا صفحة أو حركة.
2. **الاعتماد/الإذن:** G0 مقبول + إذن `G1 — DAY 7 CONTRACTS` + قرارات G0 المرتبطة بالتوكن/Google/الدمج.
3. **النطاق:** §5.1 و§5.2 ورسائل `track/account/cart.merge` فقط عند الحاجة.
4. **خارج النطاق:** لا route UI، لا حفظ فعلي لتوكن، لا merge request، لا حساب محلي.
5. **الملفات المتوقعة:** `interface/{track,customerAuth}.ts`, `validation/{track,cartMerge,customerAuth}.ts`, `lib/{accountError,trackFormat,customerSession}.ts`, `store/{track,auth}Api.ts`, تعديل `store/cartApi.ts`, `lib/routes.ts`, messages.
6. **المسؤولية:** لكل ملف مسؤولية واحدة؛ كل طلب عبر `baseApi`؛ لا DTO موازٍ ولا تعديل cart token الحالي.
7. **العقد:** Zod يطابق الباك؛ decimal strings تبقى strings؛ `trackingToken` لا يُسجَّل ولا يُعرض في tag/cache key مقروء.
8. **الفحوص:** lint/check/tsc/diff منفصلين؛ ثم build منفصلًا؛ لا API write.
9. **API smoke:** قراءة فقط في بيئة مأذونة: track بtoken من إيصال محلي إن وُجد، و`me` بدون token لمراجعة 401؛ لا register/login/merge.
10. **المتصفح:** لا شاشة؛ سجّل أن لا ستايل/حركة أُضيفا في G1.
11. **DoD:** مدخلات خاطئة لا تصل للباك؛ الفشل failure؛ لا توكن في المخرجات.
12. **STOP:** `⛔ STOP — Gate 1`

### Gate 2 — صفحة التتبع

1. **ID/الهدف:** G2؛ إغلاق KS-6 في المصدر/API المسموح.
2. **الاعتماد/الإذن:** G1 مقبول + إذن `G2 — DAY 7 TRACK` + إيصال صالح أو إدخال محلي مأذون.
3. **النطاق:** route `/track`، skeleton، `TrackSection/LookupForm/Summary/Timeline/Items/State`، `useTrackLookup`.
4. **خارج النطاق:** لا account، لا merge، لا حركة G5، لا تعديل الإيصال أو cart token.
5. **الملفات المتوقعة:** §5.3 الخاصة بtrack.
6. **المسؤولية:** الصفحة تركيب فقط؛ token من `useOrderReceipt` أو إدخال المستخدم؛ لا token في route/canonical/metadata/analytics.
7. **العقد:** بنود/hالة/ETA من الرد فقط؛ أسماء الحالات من messages؛ `deliveredAt/eta` null لا «0»؛ لا بيانات شخصية.
8. **الفحوص:** lint/check/tsc/diff/build؛ Network: request واحد لكل بحث، لا إعادة تلقائية عند 429، لا token في التقارير.
9. **المتصفح:** تحميل/نجاح/خطأ/بدون إيصال/token خاطئ/rate-limit؛ ar/en، RTL/LTR، 360px/desktop، 4 ثيمات، Tab/Enter/focus-visible، SSR مرئي.
10. **البيانات:** لا طلب وهمي ولا منطقة/حالة مختلقة؛ لا لقطة شاشة فيها token.
11. **DoD:** المسار النهائي `/{locale}/track` بلا token؛ Astra review.
12. **STOP:** `⛔ STOP — Gate 2`

### Gate 3 — مصادقة البريد وملف العميل

1. **ID/الهدف:** G3؛ إغلاق KS-7 للمسار البريدي فقط.
2. **الاعتماد/الإذن:** G2 مقبول + إذن `G3 — DAY 7 EMAIL AUTH` + قرار G0 بشأن تخزين التوكن.
3. **النطاق:** routes register/verify/login/forgot/reset/logout/account profile، forms، `useCustomerAuth`، `customerSession`، `me`.
4. **خارج النطاق:** Google، cart merge، Dashboard، employee session cookie، تعديل baseApi خارج prepareHeaders المصرَّح به.
5. **الملفات المتوقعة:** §5.3 عدا GoogleButton.
6. **المسؤولية:** نماذج Zod منفصلة؛ رسائل coded؛ `me/logout` يقرآن التوكن من helper واحد؛ لا raw token في DOM/URL.
7. **العقد:** register يظهر `devVerificationLink` في dev فقط؛ forgot رد عام؛ login يمنع التقديم قبل تحقق الحقول؛ 429/401/409/400 ترجمات منفصلة.
8. **الفحوص:** lint/check/tsc/diff/build؛ Network: طلب واحد لكل submit، لا إرسال بعد فشل validation، لا toast نجاح قبل response.
9. **المتصفح:** register/verification/login/logout/forgot/reset، reload حسب قرار التخزين، back/forward، 360px/desktop، RTL/LTR، 4 ثيمات، focus-visible.
10. **البيانات:** لا بريد/token حقيقي في التقارير؛ لا dev link في production؛ لا seed.
11. **DoD:** الجلسة تعمل وفق قرار G0؛ الفشل لا يفتح الحساب؛ Astra review.
12. **STOP:** `⛔ STOP — Gate 3`

### Gate 4 — Google ودمج سلة الضيف

1. **ID/الهدف:** G4؛ إغلاق KS-8 واستكمال Google المشروط.
2. **الاعتماد/الإذن:** G3 مقبول + إذن `G4 — DAY 7 GOOGLE & CART MERGE` + قرار Google/client ID من G0.
3. **النطاق:** `GoogleButton`, `useCartMerge`, `mergeCart` في `cartApi`، ربط ما بعد login/google، رسائل النتيجة.
4. **خارج النطاق:** فجوة قراءة سلة العميل، باك/DB، Cloudinary Private/Signed Delivery أو أي تعديل uploads/proof، Dashboard، استخدام توكن الضيف بعد أن يصبح MERGED.
5. **الملفات المتوقعة:** الملفات المقابلة في §5.
6. **المسؤولية:** merge بعد نجاح auth فقط، مرة واحدة لكل guestToken صالح؛ `null` رسالة محايدة؛ Google `GOOGLE_NOT_CONFIGURED` رسالة لا زر ميت.
7. **العقد:** `Authorization: Bearer` + `{ guestToken }`؛ لا إجمالي من رد merge؛ لا إعادة محاولة تلقائية؛ لا تخزين mergedCartId في cart key.
8. **الفحوص:** lint/check/tsc/diff/build؛ Network: login/google ثم merge بالترتيب، لا merge بدون auth، لا عرض سلة بعد merge لأن العقد لا يوفرها.
9. **المتصفح:** زر Google مخفي/معطّل بوضوح عند NOT_CONFIGURED؛ merge مع سلة فارغة/غير ACTIVE/ناجحة؛ RTL/LTR و360px.
10. **القرار المعلّق:** فجوة قراءة السلة بعد الدمج تبقى `BLOCKED`؛ لا يُختم KS-8 كتجربة كاملة.
11. **DoD:** الدمج يُرسل بعقد صحيح وتُترجم نتيجته؛ Astra review.
12. **STOP:** `⛔ STOP — Gate 4`

### Gate 5 — الشكل والأنيميشن (بعد الهيكل، بإذن منفصل)

1. **ID/الهدف:** G5؛ جعل track/account حيّين ومتسقين مع الهوية بلا تغيير العقود/الاركتيكتشر.
2. **الاعتماد/الإذن:** G1–G4 المقبولة + إذن صريح `G5 — DAY 7 STYLE & MOTION` + مراجعة شكل مع المالك.
3. **النطاق:** timeline يرسم خط تقدّم، أرقام حالة/ETA تتحرك بعد الرد، hover/spotlight خفيف على كروت الطلب/الحساب، انتقال سلس بين نماذج الحساب، لمسات مالية خفيفة.
4. **خارج النطاق:** مكتبات جديدة، GSAP/Lottie/Three، Sass، hex/rgb، حركة على كل عنصر، إصلاح `R-G4-MAJOR`/`D3-RM`، تعديل الهيدر/الفوتر/السلة.
5. **الملفات المتوقعة:** تعديل مكوّنات Day 7 الحالية فقط + `styles/animations.css` لو لزم keyframe دلالي مضاف لكل الثيمات.
6. **المسؤولية:** `m.*` والwrappers الموجودة أولًا؛ transform/opacity غالبًا؛ `prefers-reduced-motion` إلزامي؛ لا حركة تخفي نجاح/فشل.
7. **العقد:** أي حركة لا تُغيّر القيم المرسلة/المعروضة؛ لا تأخير يمنع focus أو mutation feedback؛ لا token في DOM visible.
8. **الفحوص:** lint/check/tsc/diff/build + قياس تقريبي للتأثير؛ beam لكارت واحد/اثنين بالتناوب.
9. **المتصفح:** مصفوفة كاملة مع reduced-motion، 360px/desktop، 4 ثيمات، لا overflow، لا وميض hydration، SSR مرئي.
10. **اعتماد المالك:** الشكل النهائي 🟡 حتى يعتمده؛ لا ترقية تلقائية إلى 🟢.
11. **DoD:** الحركة تحسّن الفهم ولا تبطّئ؛ لا تغيير منطق/عقود؛ انحرافات النمط موثّقة.
12. **STOP:** `⛔ STOP — Gate 5`

### Gate 6 — المراجعة والتسليم (Day 7 فقط)

1. **ID/الهدف:** G6؛ تقرير كامل وتوصية Astra، لا implementation.
2. **الاعتماد/الإذن:** إذن مالك بعد مراجعة Gates المفتوحة؛ لو G2 وحده جاهز يُسمّى «تسليم جزئي D7-TRACK».
3. **النطاق:** `docs/PROGRESS.md` و`docs/DAY7_TASKS.md` فقط لتحديث الحالة/الأدلة.
4. **خارج النطاق:** لا إصلاح عيوب، لا فتح Day 8/لوحة، لا production seal مع أي blocker مفتوح.
5. **الملفات المتوقعة:** الوثائق فقط.
6. **المسؤولية:** جدول Task ID/الحالة/الملف/الدليل؛ انحرافات؛ أوامر؛ KS-6/7/8؛ blockers؛ سجل المؤجلات.
7. **العقد:** راجع كل Gate مقابل §3 و§5 و§7؛ لا accept بلا دليل؛ لا ترقية 🟡 إلى 🟢.
8. **الفحوص:** استشهد بالأوامر المؤرّخة؛ لا إعادة build فاشل في حلقة.
9. **المتصفح:** افصل `SOURCE`, `API`, `BROWSER`, `OWNER VISUAL`؛ اذكر ما شوهد فعليًا فقط.
10. **الاعتماد:** Astra يوصي؛ المالك وحده يعتمد الشكل والانتقال.
11. **DoD:** تقرير صادق بالقيود؛ هذا الملف يعكس الحالة الفعلية؛ STOP أخير.
12. **STOP:** `⛔ STOP — Gate 6`

---

## 8) أوامر التحقق — تُسجَّل وقت التنفيذ، لا تعليمات الآن

من `Om-Eman/frontend` بعد كل Gate كود، كل أمر منفصلًا: `npm run lint`, `npm run check`, `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`, `npm run build`, `git status --short --untracked-files=all`, `git diff --check`, `git diff --stat`, `git diff -- package.json package-lock.json`. أي dependency diff ⇒ STOP. لا tokens/أسرار في المخرجات المنقولة للتقرير.

---

## 9) المخاطر والـblockers

| ID | الخطر | الإجراء المسموح |
| --- | --- | --- |
| R-D7-OWNER | لا إذن لأي Gate Day 7 بعد. | STOP؛ لا implementation قبل إذن مالك بالاسم. |
| R-D7-ENV | `:3002` وGoogle/env غير مؤكدة وقت التنفيذ. | G0 يسجّل فقط؛ `NOT-TESTED` بدل القيم المختلقة. |
| R-D7-TOKEN | مكان حفظ توكن العميل غير مقرر. | G0 قرار مالك؛ لا localStorage/cookie جديد تلقائيًا. |
| R-D7-TRACK-TOKEN | `trackingToken` سر ملكية الطلب. | route صفحة بلا token؛ لا canonical/logs/analytics؛ لا رابط مشاركة جديد. |
| R-D7-MERGE-READ | لا endpoint لقراءة سلة العميل بعد الدمج. | اختبر إرسال merge فقط؛ BLOCKED للعرض؛ باك منفصل بإذن. |
| R-D7-GOOGLE | `GOOGLE_CLIENT_ID`/GIS script غير مقرر. | G3 يبقى email-only؛ Google مشروط بـG4. |
| R-D7-EMAIL | SMTP/dev link/timezone غير مؤكدة. | لا بريد حقيقي؛ لا dev link في production. |
| R-D7-VIS | لا اعتماد بصري مُورَّث. | مصفوفة Day 7 مستقلة؛ 🟡 حتى اعتماد المالك. |
| R-D7-PRIVACY | Cloudinary Private Delivery للإثبات. | Public Delivery مقبول؛ لا تنفيذ Private/signed بلا إذن مالك جديد. |
| R-D7-SEAL | G6 ما زال `NO-GO` لأسباب runtime/browser/env. | لا ختم production أو ترقية 🟢 بالاعتماد الأمني وحده؛ public proof لا يغيّر الحالة. |
| B-BUILD | خطر Turbopack تاريخي. | سجّل أي تكرار؛ لا تغيير tooling. |

---

## 10) قالب تقرير كل Gate

1. Gate / الإذن / البيئة / التاريخ.
2. جدول `Task ID | الحالة | الملف الفعلي | المسؤولية | الدليل`.
3. أوامر + exit codes + مقتطفات بلا tokens.
4. الانحرافات وuntracked/dependencies/باك/DB.
5. المتبقي KS-6/7/8 وكل ID في §6.
6. توصية Astra ثم اعتماد المالك منفصل.
7. آخر سطر `⛔ STOP — Gate N` أو STOP النهائي.

---

## 11) طلب مراجعة Astra والاعتماد

يرجى من Astra مراجعة هذا الملف مقابل `AGENTS.md`، `PROGRESS.md §37/§38`، عقود `backend/src/modules/store/{auth,track,cart}/**` و`customer-claim.service.ts`، اكتمال الـ12 حقلًا لكل Gate، عدم فتح Day 8/لوحة/باك/DB/env، احترام قرار عدم token في route الصفحة، وتوزيع كل مؤجلات Day 6 دون حذف.

**قرار Astra:** النص التاريخي كان «لم يُطلب بعد لهذا الملف». تحديث G6: طُلبت مراجعة مستقلة نهائية للوثائق في §12، والنتيجة `PASS WITH NOTES` ثم `PASS` بعد تصحيح الملاحظات غير الحاجزة في `PROGRESS.md §47`.
**اعتماد المالك:** اعتُمدت تحديثات `PROGRESS.md §37` وإصلاح المصدر (`تمم اعتمدته`) وآخر القرارات في 2026-11-23، ومنها: **Public Cloudinary Delivery لإثبات الدفع مقبول؛ Private Delivery ليس شرطًا لقبول Day 6 ولا يوجد إذن لتنفيذه**. تُصحَّح هذه الصياغة أي إشارة أقدم إلى private proof كشرط أو blocker خارجي، بلا إعادة فتح للنقاش وبلا تغيير تقني. واعتمد المالك فصل خطة Day 7 في هذا الملف المستقل. هذا **لا يعني** اعتماد Day 7 ولا فتح أي Gate.
**الإذن الحالي:** النص التاريخي كان `DAY 7 PLANNING ONLY`. تحديث G6: `G6 — DAY 7 FINAL REVIEW & HANDOFF OPEN — DOCUMENTATION ONLY`.

⛔ STOP — DAY 7 TASK PLAN COMPLETE — OWNER UPDATE/DECISIONS ACCEPTED — NO IMPLEMENTATION AUTHORIZED

---

## 12) G6 — DAY 7 FINAL REVIEW & HANDOFF (2026-11-23)

1. **الإذن والنطاق:** المالك أذن بـ`G6 — DAY 7 FINAL REVIEW & HANDOFF` كمراجعة وثائق وأدلة وتسليم نهائي فقط. GLM منفّذ، Astra مراجع مستقل، والمالك صاحب الاعتماد النهائي. التعديل مقصور على `docs/PROGRESS.md` و`docs/DAY7_TASKS.md`; لا source/backend/API/DB/env/config/deps/deploy/commit، لا Google implementation، لا Production Seal، لا Day 8.
2. **المرجع الكامل:** الجدول التفصيلي G0–G5، الأدلة، أوامر التحقق، الفصل بين API/Browser/Owner، والمخاطر موثّقة في `PROGRESS.md §47` — هذا القسم يلخّص ولا يكرر التأريخ.
3. **حالة Gates المجمّعة:** G0 ACCEPTED (docs-only) · G1 ACCEPTED source/technical · G2 ACCEPTED source-wise مع API/Browser PENDING · G3 ACCEPTED source-wise مع API/Browser PENDING · G4 COMPLETE لكن `PENDING (conditional only)` مع guest API PASS وauthenticated merge NOT TESTED · G5 COMPLETE مع Astra PASS لكن visual OWNER PENDING.
4. **Track (KS-6):** source COMPLETE بلا token في route/canonical/metadata؛ API NOT TESTED؛ Browser NOT TESTED؛ HTTP smoke غير بصري؛ Owner visual PENDING.
5. **Email Account (KS-7):** source COMPLETE لمسار register/verify/login/forgot/reset/me/logout؛ API/Browser NOT TESTED؛ Owner source-wise ACCEPTED وvisual PENDING.
6. **Cart Merge (KS-8) وremediation:** source COMPLETE؛ guest cart API PASS؛ authenticated merge NOT TESTED؛ Browser NOT TESTED؛ G4 acceptance مشروط؛ لا endpoint لقراءة سلة العميل بعد merge.
7. **G5 visual:** source COMPLETE وAstra PASS بعد التصحيح؛ كل مصفوفة المتصفح/الاعتماد البصري PENDING؛ لا ترقية إلى visually accepted.
8. **Automated evidence:** lint/check/tsc/build/package-diff/diff-check/HTTP smoke مُسجَّلة بأرقامها وexit codes في `PROGRESS.md §47.6`; لم تُعَد أوامر implementation داخل هذه الـGate لأنها documentation-only.
9. **Deferred:** `DEFERRED — NOT PART OF G6 — NO IMPLEMENTATION AUTHORIZED` — Google Login. لا أسرار ولا بيانات دخول مطلوبة أو معروضة؛ أي عمل مستقبلي يحتاج scope وإذنًا منفصلين.
10. **Production readiness:** `NOT READY / NOT SEALED`. لا ختم إنتاج، لا ترقية Day 7 إلى حالة `ACCEPTED`، لا فتح Day 8 أو Dashboard، لا تغيير قرارات المالك السابقة.
11. **التوصية:** اعتماد `DAY 7 — PARTIAL HANDOFF` كما هو، ثم تحديد بيئة مأذونة لاحقًا للـbrowser matrix وauthenticated merge وOwner visual review. هذا لا يفتح Gate جديدة.
12. **STOP نهائي:** `⛔ STOP — G6 COMPLETE / PARTIAL — DAY 7 HANDOFF READY — WAITING FOR OWNER FINAL REVIEW`.

⛔ STOP — G6 COMPLETE / PARTIAL — DAY 7 HANDOFF READY — WAITING FOR OWNER FINAL REVIEW
