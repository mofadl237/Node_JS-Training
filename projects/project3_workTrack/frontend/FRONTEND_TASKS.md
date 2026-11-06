# خطة الفرونت - WorkTrack HR

## الهدف
نبني MVP بالترتيب ده: **Auth → App Shell → Departments → Employees → Attendance → Dashboard**.

## قواعد ثابتة
- Next.js 16 App Router + TypeScript + Tailwind.
- الـ API: `http://localhost:3000`
- الأدوار: `ADMIN | HR | MANAGER`
- مفيش User Management.
- أي طلب محمي يمر عبر API client موحد.
- المرجع التفصيلي: `FRONTEND_API_GUIDE.md`

---

## ابدأ من هنا بالترتيب

### 1. الأساس
- [ ] **1. Environment + Types**
  - `NEXT_PUBLIC_API_URL`
  - أنواع `AuthUser`, `AuthResponse`, `PaginatedResponse`, والـ enums.

- [ ] **2. API Client**
  - GET / POST / PATCH / DELETE.
  - Query builder.
  - Error normalization.
  - `401` → Refresh مرة واحدة → إعادة الطلب.
  - التعامل مع `429` و `Retry-After`.

- [ ] **3. Auth State**
  - حفظ ومسح `accessToken` و `refreshToken`.
  - Hydration عند فتح التطبيق.
  - `useAuth` / Auth Context.
  - Logout يستدعي `/api/auth/logout` ثم يمسح الجلسة.

### 2. الدخول والهيكل
- [ ] **4. Login Page**
  - Validation + loading + error.
  - بعد النجاح: توجيه حسب الدور.

- [ ] **5. Guards**
  - حماية الصفحات.
  - إخفاء عناصر التنقل غير المسموحة.

- [ ] **6. App Shell**
  - Sidebar + Topbar + User Menu.
  - Loading / Empty / Error / Forbidden states.

### 3. أول CRUD
- [ ] **7. Departments**
  - List + Create + Edit + Delete.
  - دي أول وحدة نختبر فيها الجداول والفورمات والـ pagination.

- [ ] **8. Employees List**
  - Filters + pagination + sorting.

- [ ] **9. Employee Form + Details**
  - Create / Edit.
  - صفحة تفاصيل الموظف.

### 4. الحضور
- [ ] **10. Attendance Logs**
  - List + filters.

- [ ] **11. Attendance Records**
  - List + filters + create/update/delete.

- [ ] **12. Attendance Process**
  - زر manual process.
  - عرض حالة النجاح/الفشل.

- [ ] **13. Uploads CSV**
  - Employee import.
  - Attendance import.
  - عرض الأخطاء لكل صف.

### 5. الباقي
- [ ] **14. Shifts + Assignments**

- [ ] **15. Leaves**

- [ ] **16. Dashboard Summary**
  - Cards + trend + recent audit logs.
  - `MANAGER` مقيد بقسمه.

- [ ] **17. HR KPI**
  - Department KPI + top late employees.

- [ ] **18. Audit Logs**
  - Read-only list + filters + details.

- [ ] **19. Polish**
  - Responsive.
  - Skeletons.
  - Permission-aware buttons.
  - تجربة كل دور: `ADMIN`, `HR`, `MANAGER`.

---

## Definition of Done لأي Task
- Loading + Empty + Error states موجودة.
- الشاشة شغالة بالـ role المسموح له.
- مفيش console errors.
- `npm run lint` و `npm run build` ناجحين.

## أول 3 Tasks بالتفصيل
1. **Types + Env**: جهز `NEXT_PUBLIC_API_URL` وكل الـ types المشتركة.
2. **API Client**: مركّز فيه على Refresh + 401 + 429 قبل أي شاشة.
3. **Auth State + Login**: بعدها تقدر تبدأ App Shell بأمان.

> متبدأش Dashboard قبل ما تخلص Departments و Employees.
