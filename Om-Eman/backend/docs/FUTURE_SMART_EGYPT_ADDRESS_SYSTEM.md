# Future Feature: Smart Egypt Address & Location System — Backend Planning

> حالة المستند: **تخطيط مستقبلي فقط — التنفيذ غير مأذون**.
> تاريخ التخطيط: 2026-11-22.
> المرجع الفرونت: `../../frontend/docs/FRONTEND_TASKS_10_DAYS.md` §7.
> المرجع الحالي للشحن: `./STORE_BACKEND_TASKS.md` B9/B10، `../src/services/shipping.service.ts`، `../prisma/schema.prisma`.
> هذا المستند لا يضيف endpoint ولا model ولا migration ولا seed ولا data ولا dependency. كل ما يلي إما **Existing Implementation** أو **Proposed Future Work** أو **Needs Investigation/Owner Approval**.

---

## 1) الهدف وحدود التخطيط

الهدف المستقبلي هو تقليل أخطاء إدخال العنوان المصري داخل checkout، وتقديم إدخال أسرع على الموبايل عبر:

1. قائمة administrative geography صحيحة (محافظة / مدينة / حي) قابلة للإدارة.
2. تحسين اختيار المحافظة والمدينة داخل checkout.
3. إمكانية اختياريّة لاحقة لـ browser geolocation + reverse geocoding.
4. إمكانية اختياريّة لاحقة لـ address autocomplete أو map pin.
5. فصل كامل بين **الجغرافيا الإدارية** و**مناطق التوصيل/التسعير**.

الحدود الحالية:

- لا تنفيذ باك، لا تعديل Prisma schema، لا migration، لا seed، لا SystemSetting جديد، لا endpoints جديدة، لا مفاتيح provider، لا رفع بيانات جغرافية، لا تعديل checkout الحالي.
- لا يُفترض أن أي محافظة/مدينة/حي موجودة كسجلات قابلة للاختيار في الداتابيز اليوم.
- لا يُفترض أن أي منطقة جغرافية قابلة للتوصيل لمجرد أنها موجودة في مصدر خرائط أو قاعدة حدود إدارية.

---

## 2) Existing Implementation — حقائق مؤكدة من الكود الحالي

| الموضوع | الحقيقة الحالية |
| --- | --- |
| عناوين العملاء | `CustomerAddress` في `../prisma/schema.prisma:325-348` يخزّن `governorate` و`city` كـ `String` إلزامي، و`district` و`street` و`building` و`floor` و`landmark` كنصوص، مع `latitude`/`longitude` اختياريين `Decimal(10,7)`. لا جداول/reference data للمحافظات أو المدن أو الأحياء. |
| سناپشوت الطلب | `OrderAddressSnapshot` في `../prisma/schema.prisma:798-819` يخزّن نفس العنوان كنص مع إحداثيات اختيارية و`sourceAddressId`. سجل تاريخي append-only ولا يُعدَّل لاحقًا. |
| مناطق الشحن | `ShippingCarrier` و`ShippingTariff` موجودان؛ `ShippingTariff` يربط `governorate` و`city String?` بـ `baseCost` وETA و`isActive`. المدينة `null` تعني تعريفة على مستوى المحافظة. |
| قاعدة التسعير | `resolveShippingTariff` في `../src/services/shipping.service.ts:19-46` يختار أرخص تعريفة نشطة لنفس المحافظة والمدينة، أو التعريفة ذات `city: null`، بشرط أن تكون شركة الشحن `isActive`. عدم وجود تعريفة ⇒ `SHIPPING_AREA_NOT_CONFIGURED`، وليس شحنًا مجانيًا. |
| قائمة المناطق العامة | `listShippingAreas` في `../src/services/shipping.service.ts:63-102` تعرض فقط التعريفات النشطة لشركات نشطة؛ لذلك القائمة الحالية هي قائمة **مناطق مُعدّة للشحن**، وليست قائمة كل المحافظات/المدن في مصر. |
| Checkout الحالي | الفرونت يقرأ `GET /api/store/shipping/areas` و`GET /api/store/shipping/quote`؛ الحقول نصية مع datalist مبني على التعريفات الموجودة فقط. لا map ولا geolocation ولا geocoding ولا search. |
| القواعد العامة | `backend/AGENTS.md`: لا اختراع قيم أعمال، المال Decimal/نص عشري، السجلات التاريخية append-only، المنطق في service، والاستجابة عبر `ApiResponse`. |

الاستنتاج: الإصدار الحالي يحل مشكلة "السعر للمنطقة الموجودة"، لكنه لا يحل مشكلة "تحسين إدخال عنوان صحيح من البداية".

---

## 3) الفصل الإلزامي: الجغرافيا ≠ قابلية التوصيل

هذه قاعدة معمارية مستقلة عن أي قرار مستقبلي:

```text
Administrative geography        Serviceability / pricing
-----------------------        -------------------------
Governorate / City / District   ShippingCarrier / ShippingTariff / optional future zones
Names, aliases, boundaries      Cost, ETA, active/inactive rules
Reference data                  Commercial rule data
```

القواعد:

1. وجود محافظة أو مدينة أو حي في قاعدة الجغرافيا **لا يعني** أن Om Eman توصّل إليها.
2. اختيار عنوان من خريطة أو reverse geocoding **لا يعني** قبول الطلب؛ لازم يمر عبر قاعدة الشحن الحالية.
3. لا يجوز في أي مرحلة مستقبلية تحويل `SHIPPING_AREA_NOT_CONFIGURED` إلى `shippingTotal = 0`.
4. تبقى قاعدة `resolveShippingTariff` هي المصدر الوحيد لحساب الشحن، أو تُستبدل بنسخة جديدة باختبارات صريحة تتشارك فيها quote وcheckout معًا.
5. الإحداثيات (`latitude/longitude`) مساعدة للسائق/التحقق البشري فقط؛ ليست مدخلًا لحساب السعر ما لم تُصمَّم وتُعتمد قاعدة صريحة جديدة.
6. `OrderAddressSnapshot` يجب أن يظل سناپشوتًا نصيًا كاملًا حتى لو تغيّرت أسماء/reference data لاحقًا.

---

## 4) Proposed Future Data Architecture — يحتاج موافقة منفصلة

هذه نمذجة مقترحة للنقاش فقط؛ ليس تصميمًا معتمدًا ولا يُنفَّذ في هذا التكليف.

### 4.1 مرجع جغرافي إداري (اختياري)

الغرض: توحيد أسماء المحافظات والمدن والأحياء ومنع الأخطاء الإملائية والترادفات.

الكيانات المرشحة:

- `GeographyGovernorate`: code، الاسم العربي، الاسم الإنجليزي، مصدر البيانات، حالة النشاط.
- `GeographyCity`: محافظة أم، أسماء عربية/إنجليزية، aliases، مصدر البيانات.
- `GeographyDistrict`: مدينة أم، أسماء/aliases، مصدر البيانات.
- `GeographyAlias`: نص بديل طبيعي بما في ذلك الهجاء العامي والإنجليزي، مرتبط بالكيان الصحيح.
- `GeographySource`: اسم المصدر، الرخصة، تاريخ الاستيراد، إصدار الداتاسيت.

شروط أي تنفيذ لاحق:

- استيراد idempotent مع `source + externalId` فريد.
- لا حذف فعلي للسجلات المرتبطة بعناوين/طلبات؛ تعطيل `isActive` بدلًا منه.
- لا إدخال بيانات تجريبية أو أسماء متخمّنة؛ تعبئة من مصدر موثّق يوافق عليه المالك.
- مراجعة الأسماء العربية والإنجليزية وRTL/LTR قبل الاعتماد.

### 4.2 ربط الجغرافيا بالشحن (اختياري)

الغرض: السماح بإدارة "منطقة توصيل" مستقرة حتى لو اختلفت أسماء الأحياء.

الخيارات المقترحة للدراسة:

1. **الخيار الحالي:** الإبقاء على `ShippingTariff.governorate/city` نصًا، وتغذية checkout بقائمة reference data مع بقاء `quote` نصيًا. الأقل تكلفة.
2. **مناطق شحن صريحة:** كيانات `ShippingZone` / عضوية محافظة-مدينة-حي / ربط `ShippingTariff` بالمنطقة. أقوى إداريًا لكنه يحتاج migration وواجهة إدارة وقواعد تحقق.
3. **نموذج هجين:** reference data للإدخال + خريطة صريحة إلى zone + `ShippingTariff` كsource of truth للتكلفة والـETA.

القرار مفتوح. في كل الحالات: غياب الربط أو التعريفة = خطأ صريح، لا قيمة افتراضية.

### 4.3 cache مزوّد الخرائط/الـgeocoding (اختياري)

إذا استُخدم مزوّد خارجي مستقبليًا:

- تخزين الاستجابة الطبيعية/المُطبعّة في cache مع `provider`، `requestHash`، `language`، `expiresAt`، لا تخزين مفاتيح API.
- توحيد `normalizeArabic` والـaliases قبل التخزين.
- قواعد rate limit وretry وtimeout في adapter واحد.
- لا تسجيل الإحداثيات الخام أو رقم العميل في logs إلا عند الحاجة التشغيلية.

---

## 5) Candidate API Surface — planning vocabulary only

لا شيء مما يلي موجود حاليًا ولا يُسمح بإنشائه في هذا التكليف. يُعرض لتحديد نطاق التصميم فقط.

### 5.1 Public storefront-facing

| Candidate endpoint | الغرض المقترح | ملاحظات |
| --- | --- | --- |
| `GET /api/store/locations/governorates` | قائمة المحافظات المرجعية النشطة | غير مرتبط بالتوصيل؛ لا يُستخدم وحده للسماح بالطلب. |
| `GET /api/store/locations/cities?governorate=...` | مدن محافظة واحدة | يحتاج Zod وترتيب عربي/إنجليزي ثابت. |
| `GET /api/store/locations/districts?city=...` | أحياء مدينة واحدة | اختياري حسب توفر البيانات. |
| `GET /api/store/locations/search?q=...` | بحث عن عنوان/منطقة وإرجاع مرشّحين منظّمين | إذا استُخدم provider خارجي، يجب أن يكون proxy خلف الباك. |
| `POST /api/store/locations/reverse-geocode` | تحويل إحداثيات المتصفح إلى مرشّح عنوان قابل للمراجعة | يتطلب موافقة المستخدم؛ النتيجة ليست نهائية ولا تُقبل تلقائيًا. |

الردود المقترحة يجب أن تمر عبر `ApiResponse`، وتستخدم `code` ثابت للأخطاء، وتُترجم في الفرونت. لا تُعرض رسائل المزوّد الخام للمستخدم.

### 5.2 Admin/Owner-facing

| Candidate capability | الغرض المقترح |
| --- | --- |
| CRUD/reference import للمحافظات والمدن والأحياء والـaliases | إدارة البيانات المرجعية وتتبّع المصدر. |
| إدارة مناطق الشحن/الـzones وربطها بالتعريفات | فصل الجغرافيا عن قابلية التوصيل. |
| مراجعة اقتراحات reverse geocoding | السماح للموظف بتصحيح الأسماء قبل اعتمادها كمرجع. |
| AuditLog لكل تغيير مرجعي أو تغيير منطقة شحن | حماية التاريخ ومنع التعديل غير الموثّق. |

### 5.3 ما يجب ألا يتغيّر بدون قرار منفصل

- `GET /api/store/shipping/areas` و`GET /api/store/shipping/quote` ما زالا العقد الحالي للcheckout.
- `resolveShippingTariff` لا يُستبدل بمزوّد خارجي أو بمنطقة خريطة.
- `OrderAddressSnapshot` لا يُعاد كتابته بعد الطلب.
- لا endpoint عام يكشف إحداثيات أو عناوين عملاء أخرى.

---

## 6) Administrative Data Sources and Provider Evaluation

المصادر التي رُوجعت في التخطيط؛ لم يُعتمد أي مصدر بعد.

| Source | What it is | Verified limitations / ops notes |
| --- | --- | --- |
| OpenStreetMap / Nominatim | Search + reverse geocoding مفتوح | Policy: https://operations.osmfoundation.org/policies/nominatim — حد أقصى 1 request/sec، User-Agent/Referer صالح، attribution، ODbL، لا bulk/periodic requests، يُفضَّل proxy+caching. Reverse docs: https://nominatim.org/release-docs/develop/api/Reverse — قد يرجع أقرب object غير متوقع، الطرق الصغيرة غير المسماة قد لا تظهر، في المدن الكثيرة قد يختلف الشارع. مناسب للتجربة/الاستخدام التفاعلي المحدود، لكنه ليس SLA إنتاجي. |
| Photon | OSM-based geocoder | https://photon.komoot.io/ — بحث/عكس + `lang`؛ الاستخدام الكثيف قد يُخنق. يحتاج تقييم جودة الأسماء العربية في مصر قبل أي اعتماد. |
| geoBoundaries | حدود إدارية قابلة للتنزيل/API | https://www.geoboundaries.org/api.html — attribution مطلوب، لا ضمان uptime. يغطي مستويات إدارية حسب الدولة/المستوى؛ التغطية الكاملة لمصر وكل الأحياء تحتاج تحقق عملي. |
| GADM | قاعدة حدود إدارية عالمية | https://gadm.org/data.html — الصفحة تعرض الإصدار 4.1 مع ملاحظة إصدار قادمة/متضاربة؛ يجب إعادة التحقق من الإصدار وقت القرار. الترخيص academic/non-commercial؛ التوزيع/الاستخدام التجاري يحتاج إذن، لذلك لا يُختار قبل مراجعة قانونية. |
| Google Maps | Geocoding + Places + Maps | https://developers.google.com/maps/billing-and-pricing/pricing — pay-as-you-go/tiered SKUs؛ التكلفة والشروط مرتبطة بالاستخدام. جودة عالية محتملة لكن قفل مزوّد وتكلفة وقيود تخزين يجب مراجعتها. |
| Mapbox | Geocoding/Search + maps | https://www.mapbox.com/pricing — free tiers/metered usage؛ شروط التخزين والربط بخريطة Mapbox يجب التحقق منها لكل tier قبل الاعتماد. |
| OpenCage | Geocoding SaaS | https://opencagedata.com/pricing — free trial 2,500 requests/day و1 request/sec للتجربة فقط؛ paid plans تسمح تخزينًا دائمًا حسب الشروط. مناسب لـPOC/تجربة قبل قرار شراء. |
| OSM raster tiles | خريطة أساسية إذا لزم الأمر | https://operations.osmfoundation.org/policies/tiles — attribution واضح، User-Agent/Referer صالح، cache ≥7 days، منع bulk/no-cache abuse. |

القرار المطلوب من المالك: self-host مقابل SaaS، الميزانية، رخصة تخزين الأسماء/الحدود، من يملك تحديث البيانات، وهل الخريطة مطلوبة أصلًا أم أن القوائم + prefill تكفي.

---

## 7) Proposed Backend Architecture — عند الإذن فقط

```text
HTTP request
  -> Zod validation
  -> controller
  -> service
       -> geography repository / provider adapter
       -> normalization + cache
       -> serviceability resolver (existing shipping rule)
  -> ApiResponse
  -> Swagger + tests
```

قواعد تنفيذ لاحقة:

- كل موديول جديد يتبع نمط `module/controller/service/router/validation/types` في `src/modules/`، ويُضاف إلى `PRESERVED_MODULE_FOLDERS` في المولّد قبل أي `npm run modules:generate`.
- مفاتيح المزوّد في env فقط ولا تصل إلى الفرونت أو logs أو error messages.
- adapter واحد لكل مزوّد، مع واجهة داخلية موحّدة حتى يمكن استبدال المزوّد دون لمس checkout.
- كل external payload يُتحقق منه بـZod قبل استخدامه.
- Rate limiting:
  - `GET /locations/*`: abuse limiter عام.
  - `POST /locations/reverse-geocode`: limiter أشد + مدخلات إحداثيات محصورة داخل مصر بشكل صريح إن اعتُمد نطاق مصر فقط.
- أخطاء مقترحة تحتاج موافقة: `LOCATION_NOT_FOUND`، `LOCATION_PROVIDER_UNAVAILABLE`، `LOCATION_INVALID_COORDINATES`، `LOCATION_RATE_LIMITED`. لا تُترجم كـ`SHIPPING_AREA_NOT_CONFIGURED`، لأنها ليست نفس الحالة.
- Swagger و`tests/` و`src/config/swagger.ts` و`CHANGELOG.md` و`AGENTS.md` تُحدَّث في نفس المرحلة لو سُمح بالتنفيذ.
- لا `console.log`، لا قيمة أعمال متخمّنة، لا حذف سجلات تاريخية، لا تعديل CRUD مولّد يدويًا.

---

## 8) Phases, Dependencies, Acceptance

| Phase | العمل المقترح | الاعتماديات | معيار القبول المقترح |
| --- | --- | --- | --- |
| 0 — Decisions | اختيار مصدر/مزوّد، مراجعة الرخصة، تثبيت من يملك البيانات، تحديد هل الخريطة مطلوبة | قرار مالك + مراجعة قانونية/تكلفة | مستند قرار موقّع من المالك؛ لا كود. |
| 1 — Reference data | استيراد المحافظات/المدن/الأحياء والـaliases مع provenance | مصدر بيانات صالح وidempotent import | أسماء عربية/إنجليزية صحيحة، لا تكرارات، لا حذف تاريخي، لا تأثير على checkout. |
| 2 — Public lists | قوائم للفرونت تتغذى من reference data | Phase 1 | checkout يقلّل الأخطاء الإملائية؛ لا يزال السعر من `ShippingTariff`. |
| 3 — Serviceability mapping | ربط اختياري بين reference data ومناطق الشحن | موافقة على النمذجة | كل منطقة غير مهيأة تُرجع خطأ صريح؛ quote وcheckout متطابقان. |
| 4 — Location assist | reverse geocode/search عبر proxy مع cache وrate limits | موافقة مزوّد + HTTPS + consent في الفرونت | المستخدم يراجع النتيجة ويعدّلها؛ الفشل لا يمنع الإدخال اليدوي. |
| 5 — Optional map/map pin | خريطة اختيارية تمامًا | قرار مالك + سياسة tiles + أداء/accessibility | لا تعتمد الواجهة على الخريطة؛ manual path يعمل بدون JS/خريطة. |
| 6 — Hardening | observability، مراجعة تكلفة/أداء، اختبارات RTL/ar/en، audit | كل ما سبق | فحوص الباك خضرا، Swagger محدّث، لا مفاتيح/إحداثيات في logs. |

---

## 9) Privacy, Cost, Operations

- Browser geolocation يحتاج HTTPS وإذن صريح من المستخدم؛ الرفض أو عدم الدعم حالة طبيعية وليست خطأ fatal.
- الإحداثيات بيانات شخصية حساسة؛ تُحفظ فقط عند الحاجة، مع مدة احتفاظ واضحة، ولا تُعرض في التتبع العام.
- لا تُرسل إحداثيات المستخدم إلى مزوّد قبل تفعيل واجهة صريحة وشرح مختصر بالعربية والإنجليزية.
- تكاليف SaaS مرتبطة بعدد الطلبات؛ أي cache وتقليل requests يؤثر مباشرة على التكلفة.
- self-host Nominatim يتطلب خادمًا وتحديث بيانات OSM ومراقبة، وليس "مجاني بلا تكلفة تشغيلية".
- OSM tile policy تمنع الاستهلاك الجماعي وتفرض attribution؛ أي استخدام كثيف يحتاج مزوّدًا مدفوعًا أو بنية تحتية خاصة.

---

## 10) Open Decisions for Owner

1. هل نبدأ بالمرجع الجغرافي فقط (الخيار الأرخص) أم ننتقل مباشرة إلى geocoding؟
2. مصدر الأسماء الإدارية المعتمد لمصر، وخصوصًا الأحياء والمناطق الشعبية والقرى.
3. هل تُخزَّن الإحداثيات في `CustomerAddress` فقط أم تُضاف سجلات منفصلة للاقتراحات/المراجعة؟
4. هل نحتاج مناطق شحن صريحة أم يكفي نص `governorate/city` الحالي؟
5. مزوّد الخرائط/الـgeocoding: OSM/Photon/geoBoundaries مقابل Google/Mapbox/OpenCage.
6. من يراجع ويحدّث الأسماء والـaliases، وما هي دورة التحديث؟
7. ما هي مدة الاحتفاظ بالإحداثيات وبيانات الاقتراحات غير المقبولة؟
8. هل الخريطة التفاعلية مطلوبة في الإصدار الأول أم مؤجلة بالكامل؟

---

## 11) Cross-project Reference

- frontend roadmap: `../../frontend/docs/FRONTEND_TASKS_10_DAYS.md` §7.
- frontend progress: `../../frontend/docs/PROGRESS.md` §32.
- existing shipping plan: `./STORE_BACKEND_TASKS.md` B9/B10.
- backend status: `./BACKEND_PROGRESS.md`.
- architecture pointer: `./architecture.md` §9.

**Planning status: DOCUMENTATION ONLY — IMPLEMENTATION NOT AUTHORIZED.**
