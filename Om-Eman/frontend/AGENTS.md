# AGENTS.md — Personal Engineering Standards

> Read this file before writing or modifying any code.
> These are my conventions, not suggestions. Follow them unless I explicitly ask otherwise.

I build **React + TypeScript** applications (mostly **Next.js App Router**) with a strong focus on:
clean architecture, **small files**, domain-based organization, strict typing, explicit validation,
predictable state, and intentional performance/caching.

**The most important rule: I split everything.** A 500-line file with a table, a modal, a form,
an API call, validation, and types inside it is a failure. Every file must have one clear job.
If you are an AI reading this: do not dump a feature into one file. Split it first, then write it.

---

## 0. How to apply this file

1. Read this file before planning.
2. Follow the existing project first if it already has a convention (casing, UI library, folder names).
   Never break the file-size, typing, validation, and splitting rules, even if the project does.
3. Before writing code, list the files you will create or modify and what each one owns.
4. Implement in small pieces. Stop and split when a file crosses the limits.
5. Run `npm run lint` and `npm run build` before saying you are done.
6. When two solutions are possible, choose the one with more small files, not the one with fewer big files.

If a file starts mixing **UI + state + API + validation + types + helpers**, it is already wrong.
Split it before adding anything else.

---

## 1. Non-negotiable rules

1. **Never create a large file.** Soft limit **150 lines**, hard limit **200 lines**. Split before you reach the hard limit.
2. **One responsibility per file.** One component, one hook, one schema, one slice, one API service, one helper.
3. **Everything is typed.** No `any`, no implicit `any`, no `@ts-ignore`, no `as` casts to silence real type errors.
4. **Every data contract has an interface.** Interfaces start with `I`. Type aliases/unions start with `T`.
5. **Every form and every external payload is validated** before it is sent or trusted.
6. **Separate server state from client state.**
   - Server data -> RTK Query (preferred here) or TanStack Query.
   - Cross-app client state -> Redux Toolkit.
   - Local UI state -> `useState`.
7. **Handle all UI states:** loading (skeleton), error, empty, success, and mutation feedback.
8. **Pages are thin.** A page composes sections/components. No business logic, no big JSX, no fetch code inside a page.
9. **Components never call APIs or storage directly.** Use an RTK Query hook, a custom hook, or a helper from `lib/`.
10. **Reusable UI must be reused.** Never duplicate the same markup or Tailwind class block. Use `components/ui/` or `components/shared/`.
11. **Reuse before adding a dependency.** Do not install a library if the current stack already solves the problem.
12. **No dead code.** No unused imports, no commented-out blocks, no `console.log`, no leftover files.
13. **Follow the project import style.** This repo uses the `@/*` alias. In projects without an alias, use relative imports.
14. **No new comments** except the numbered section markers (`// 1- state`) and short public API documentation.
15. **Run `npm run lint` and `npm run build` before finishing.**

---

## 2. Default stack

This repository is the reference implementation:

| Concern | Choice |
|---|---|
| Framework | Next.js 15 App Router + React 19 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui + `class-variance-authority` |
| Routing | Next.js App Router (`app/[locale]`) + `next-intl` |
| Global client state | Redux Toolkit (`createSlice`) |
| Server state | **RTK Query** (`createApi` + `fetchBaseQuery`) |
| Forms | React Hook Form + `zodResolver` |
| Validation | **Zod** schemas |
| i18n | `next-intl` (`en`, `ar`, RTL support) |
| Toasts | `sonner` |
| Icons | `lucide-react` |
| Animation | `framer-motion` wrappers |
| Charts | `recharts` |
| Email/server | Next.js Route Handlers + `resend` |
| Utilities | `clsx` + `tailwind-merge` via `cn` |

Rules:

- Environment variables are read from `process.env`; only `NEXT_PUBLIC_*` may reach the client.
- If a project is **React + Vite** instead of Next.js, use React Router v7, `VITE_*` env vars, and
  `src/pages` + `src/router`; keep every other rule in this file unchanged.
- If a project already uses TanStack Query or Axios, keep it and follow the same separation rules.
  Do not add a second query library without a real reason.

---

## 3. Canonical folder structure

### 3.1 Next.js App Router (this repo)

```txt
app/
├── [locale]/
│   ├── (Dashboard)/dashboard/    # route group, one folder per route
│   │   ├── layout.tsx
│   │   └── <page>/page.tsx
│   ├── e-commerce/
│   │   ├── layout.tsx
│   │   ├── <page>/page.tsx
│   │   └── [productID]/page.tsx  # dynamic route
│   ├── layout.tsx                # root layout: html/body/providers
│   ├── error.tsx                 # route error boundary
│   └── page.tsx
└── api/
    └── <endpoint>/route.ts       # route handler, validate + type payloads
components/
├── ui/                 # shadcn primitives (treat as library, do not restructure)
├── shared/             # composed cross-feature UI (create when needed)
├── Action/             # per-row table actions + mutations
├── Animation/          # framer-motion wrappers
├── Card/               # presentational cards
├── DataAnalysis/       # dashboard analysis sections
├── ECommerce/          # e-commerce sections
├── Model/              # dialogs: add/edit forms ("Model" = modal in this repo)
├── Render/             # data-driven sections that compose cards/tables
├── Skelton/            # loading skeletons matching real layout
├── Statiscs/           # charts/statistics
└── Table/              # table layout only, actions delegated to Action/
hooks/                  # custom hooks (useAppDispatch, useX, ...)
interface/              # shared interfaces + barrel index.ts
lib/                    # utils.ts: cn + storage helpers
Providers/              # ReduxProvider, ThemeProvider, ...
store/
├── store.ts            # configureStore + typed RootState/AppDispatch
├── <Domain>/<name>Slice.ts
└── services/<domain>Api.ts
validation/             # Zod schemas + barrel index.ts
i18n/                   # routing.ts, navigation.ts, request.ts
messages/               # en.json, ar.json
middleware.ts           # next-intl middleware
```

Casing rules:

- **PascalCase** for component/route folders and component files (`components/Table/CattleTable.tsx`).
- **lowercase/camelCase** for non-component folders (`store`, `hooks`, `validation`, `interface`,
  `lib`, `i18n`, `messages`, `services`).
- This repo uses the singular `interface/` folder. Keep that name in this repo; do not rename it.
- Keep `Model/` for dialogs if the project already uses it. In a new project, prefer `Modal/`.
- `components/ui/` is generated/library code. Do not add business logic there. Prefer feature folders.

### 3.2 React + Vite variant

```txt
src/
├── app/                # Redux store + slices + RTK Query services
├── components/         # UI + shared + feature folders (same grouping idea)
├── pages/              # one route-level component per file
├── router/             # createBrowserRouter
├── hooks/
├── interface/ or interfaces/
├── types/
├── validation/
├── lib/ or utilities/
├── services/           # storage/cookie services
├── Providers/
├── App.tsx
├── main.tsx
└── index.css
```

---

## 4. Architecture principles (SOLID in practice)

- **S — Single Responsibility**
  A file should be describable in one sentence. A modal is not a form; a form is not a field group;
  a table is not a row action; a page is not a feature. Create a file per responsibility.
  Example: `AddEvent` (dialog shell) + `EventForm` + `EventFields` + `useAddEvent` + `eventSchema`.

- **O — Open/Closed**
  Extend UI through props and variants (`cva`, `className`, `size`, `variant`). Do not edit a shared
  primitive and add boolean flags for every feature. Build new wrappers instead of changing old ones.

- **L — Liskov Substitution**
  Components that share a contract must be swappable. A `Card` takes a typed domain object and
  action slots; do not create card variants that require different prop shapes for the same role.

- **I — Interface Segregation**
  `IProps` must contain only what the component uses. Extend native attributes instead of
  re-declaring them. Pass a typed domain object (`farm`, `request`, `cattle`) instead of 10 primitive props.

- **D — Dependency Inversion**
  UI depends on abstractions: hooks, services, schemas, and interfaces. A card must not know the API URL.
  A form must not know `localStorage`. A page must not know how data is fetched.

Feature boundaries:

- `ECommerce` and `Dashboard` components must not import from each other. Share only through
  `components/ui`, `components/shared`, `interface`, `lib`, `hooks`, and `store/services`.
- API details live in `store/services`. Validation lives in `validation`. Types live in `interface`.
- If you need a helper in two places, move it to `lib/` instead of duplicating it.

---

## 5. File size and splitting playbook

### 5.1 Limits and tests

- **Soft limit: 150 lines. Hard limit: 200 lines.** A new file above 200 lines is not accepted.
- **One-sentence test:** if you cannot say "this file does X" without "and", split it.
- **Import test:** if a file imports UI primitives, API hooks, validation, and type contracts all at once,
  it is probably doing too much.
- **JSX test:** if the `return` block is longer than ~80 lines, extract subcomponents.

### 5.2 Splitting order (use this exact order)

1. Presentational subcomponents -> same feature folder (`components/Model/Event/EventFields.tsx`).
2. Logic/state -> custom hook in `hooks/` (`useAddEvent.ts`).
3. Pure transformations -> `lib/` or `utilities/` (`calculateCartTotal.ts`).
4. Schemas -> `validation/` (`eventSchema.ts`).
5. Types/interfaces -> `interface/` or `types/`.
6. API calls -> `store/services/<domain>Api.ts`.
7. Constants/static options -> `data/` or a colocated `constants.ts`.

### 5.3 Worked example: the 400-line modal

Bad:

```txt
components/Model/AddEvent.tsx   (419 lines: dialog + form + 8 conditional fields + API + types + toasts)
```

Good:

```txt
components/Model/AddEvent.tsx            # dialog shell only: open state + trigger + footer
components/Model/Event/EventForm.tsx     # react-hook-form + submit
components/Model/Event/EventFields.tsx   # conditional fields by event type
components/Model/Event/EventFooter.tsx   # submit/cancel buttons + loading
hooks/useAddEvent.ts                     # mutation + reset + close + toast
validation/event.schema.ts               # Zod schema + inferred type
interface/index.ts                       # IEvent, IAddEventPayload
```

The dialog shell should look like this:

```tsx
"use client";

const AddEvent = () => {
  // 1- state
  const [isOpen, setIsOpen] = useState(false);

  // 2- handlers
  const closeModal = useCallback(() => setIsOpen(false), []);

  // 3- render
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><Plus /> New Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Event</DialogTitle></DialogHeader>
        <EventForm onSuccess={closeModal} />
      </DialogContent>
    </Dialog>
  );
};

export default memo(AddEvent);
```

### 5.4 Never combine these in one file

- Table + modal + form + API mutation + validation + types.
- Page + fetch + business logic + full JSX.
- Card + API call + delete/edit dialogs.
- Store slice + selectors + API service + components.
- A full dashboard with every chart and query inline.

### 5.5 Composition rules

- A **page** only imports and composes sections. Target under 30 lines.
- A **Render** component fetches/derives data for a section and passes typed props down.
- A **Table** renders headers/rows only; row actions come from `Action/`.
- A **Card** is presentational and memoized; it receives data and callbacks.
- A **Model** is the dialog shell; the form lives in its own file if it grows.
- A **Skelton** mirrors the real layout and is reused by all loading states.

---

## 6. Naming conventions

### Types and interfaces

- Interfaces: `I` prefix, always. `IProps`, `IFarm`, `IEvent`, `ICattle`, `IUserResponse`, `IJwtPayload`.
- Paginated API responses: `IPaginated<Entity>Response` or `<Entity>Response`.
  This repo has `PaginatedCattleResponse`; new code must use `IPaginatedCattleResponse`.
- Type aliases and unions: `T` prefix. `TAlertCategory`, `TNavLinkProps`, `TLoginFormValues`.
  Existing types without `T` may stay; all new ones use `T`.
- Generic helper types: `TNullable<T>`, `TApiResponse<T>`.
- Form value types: `type TLoginForm = z.infer<typeof loginSchema>`.

### Files and symbols

- Components and their files: `PascalCase` (`CattleTable.tsx`, `FarmCard.tsx`).
- Hooks: `useSomething.ts` exporting `useSomething`.
- Redux slices: `<name>Slice.ts`; actions exported from the slice.
- RTK Query: `<domain>Api.ts`; `reducerPath` lowercase; `tagTypes` PascalCase; export the reducer
  default plus generated hooks.
- Zod schemas: camelCase domain name (`loginSchema`, `workerSchema`, `eventSchema`).
- Handlers: `handleX` or `onX` (`handleSubmit`, `onDelete`, `openEditModal`).
- Booleans: `isLoading`, `isOpen`, `hasError`, `isAllowed`, `isClient`.
- Constants: `UPPER_SNAKE_CASE` for primitives; `PascalCase` for config arrays (`FormRegisterData`);
  `camelCase` for default objects (`defaultProduct`).
- No unnecessary abbreviations. Keep domain words intact (`productID`, `farmID`, `imageUrl`).

---

## 7. Component conventions

- One component per file, default export for feature components. `components/ui/` keeps its
  library convention (named exports).
- Props interface is `IProps`, or `I<Component>Props` when the component is reused.
- Extend native element attributes instead of re-declaring them.

```tsx
interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}
```

- Use `forwardRef` for inputs and anything that must expose a DOM ref.
- Use `memo` for cards, rows, and pure presentational components.
- Wrap handlers passed to memoized children in `useCallback`.
- Keep JSX clean. Move conditional render trees into variables or subcomponents.
- Use the numbered-section layout inside every component:

```tsx
const FarmCard = ({ farm }: IProps) => {
  // 1- state

  // 2- handlers

  // 3- render
  return <div>{farm.name}</div>;
};

export default memo(FarmCard);
```

- `"use client"` only when the file uses hooks, state, effects, browser APIs, or event handlers.
  Keep the client boundary as low as possible; server components are the default.
- Feature component roles:
  - `Render/*` — data-driven sections. May use RTK Query hooks and derive props.
  - `Table/*` — table structure only. No mutations.
  - `Action/*` — per-row edit/delete/add actions and their mutations.
  - `Model/*` — dialog shell + trigger. Form pieces go in `Model/<Feature>/`.
  - `Card/*` — presentational, memoized, no API calls.
  - `Skelton/*` — loading placeholders matching the final layout.
  - `Animation/*` — motion wrappers only.
- Never put business logic directly in JSX. Compute first, render second.
- Never hardcode user-facing text in components. Use `next-intl`.

---

## 8. Types and interfaces — exact rules

- Shared domain and API contracts live in `interface/index.ts` (barrel). Local props stay in the
  component file. Complex reusable aliases go in `types/`.
- Every API request body, API response, component prop bag, and store state has an interface.
- Naming:

```ts
export interface IFarm {
  id: number;
  name: string;
  manager: {
    id: number;
    name: string;
    email: string;
  };
}

export interface IAddFarmPayload {
  name: string;
}

export interface IPaginatedEventResponse {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  data: IEvent[];
}

export interface IErrorResponse {
  message: string;
}

export type TAlertCategory = "success" | "error";

export type TLoginForm = z.infer<typeof loginSchema>;
```

- Use `interface` for object shapes and `type` for unions, aliases, mapped types, and `z.infer`.
- Use `import type { ... }` for type-only imports.
- Prefer literal unions over `string` for constrained values.
- Reuse native types: `InputHTMLAttributes`, `ButtonHTMLAttributes`, `ChangeEvent`, `ReactNode`.
- Never use `any`. Use `unknown` and narrow with a type guard or a schema.
- Normalize API dates deliberately. Do not let `Date` and `string` mix in the same contract; pick one
  for the API boundary and convert at the edge.
- Optional fields (`?`) only when the API truly omits them, not to silence errors.
- Keep default objects (`defaultProduct`, `initialCart`) typed next to their interface.

---

## 9. Validation

- Every form is validated with **Zod** before submit.
- Every external payload is validated before it is trusted (route handlers, storage, JWT payloads).
- One domain schema per file in `validation/`; export through `validation/index.ts`.
- Schema names are camelCase: `loginSchema`, `registerSchema`, `workerSchema`, `cattleSchema`.
- Use `zodResolver` with React Hook Form and infer the form type:

```ts
export const eventSchema = z.object({
  eventType: z.string().min(2, { message: "Event type is required." }),
  tagNumber: z.number({ message: "Tag number must be a number." }),
  weight: z.number().optional(),
  notes: z.string().min(2, { message: "Notes are required." }).optional(),
});

export type TEventForm = z.infer<typeof eventSchema>;
```

```tsx
const form = useForm<TEventForm>({
  resolver: zodResolver(eventSchema),
  defaultValues: defaultEvent,
});

const onSubmit = (values: TEventForm) => {
  addEvent(values);
  form.reset();
};
```

- Validation messages must be clear and user-facing.
- Field errors render through the shared form components, not inline ad-hoc markup.
- If a form library is not used, write a pure validator returning a typed error object.
- Never bypass validation because the input is "controlled".

---

## 10. State and data

### 10.1 Global client state (Redux Toolkit)

Use Redux only for truly global client state: cart, auth/session flags, theme, editor state.

- Store is configured in `store/store.ts`.
- Export typed `RootState` and `AppDispatch`.
- Prefer typed hooks (`useAppDispatch`, `useAppSelector`) in `hooks/`.
- Slice template:

```ts
interface ICartState {
  count: number;
  items: ICartItem[];
}

const initialState: ICartState = { count: 0, items: [] };

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ICartItem>) => {
      state.items.push(action.payload);
      state.count = state.items.length;
    },
  },
});

export const { addItem } = cartSlice.actions;
export default cartSlice.reducer;
```

- Hydrate from `localStorage` only with an SSR guard (`typeof window !== "undefined"`), and prefer
  reading it inside an effect or a lazy initializer to avoid hydration mismatches.
- Keep derived totals in selectors or pure helpers. Do not copy the same `reduce` block into every
  reducer (this repo currently repeats it; do not repeat the mistake in new code).
- Mutation feedback -> toast + invalidation. Reset the form and close the modal on success.

### 10.2 Server state (RTK Query)

- One API slice per domain in `store/services/<domain>Api.ts`.
- Define `reducerPath`, `tagTypes`, `baseQuery`, `providesTags`, and `invalidatesTags` for every
  query/mutation.
- Export the reducer as default and the generated hooks as named exports.
- Register every reducer and middleware in `store/store.ts`.
- Use `isLoading` for the first load and `isFetching` for background refetch indicators.

### 10.3 Static data

- Mock/static content, form options, and default objects live in `data/` or a colocated
  `constants.ts` inside the feature folder.
- Form field configs are typed arrays:

```ts
export const FormRegisterData: IInputRegister[] = [
  { name: "username", type: "text", placeholder: "User Name" },
];
```

---

## 11. HTTP and API

### 11.1 RTK Query service template

```ts
import type { IFarm, IAddFarmPayload } from "@/interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const FarmApiSlice = createApi({
  reducerPath: "farm",
  tagTypes: ["Farms", "Manager"],
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (build) => ({
    getFarms: build.query<IFarm[], void>({
      query: () => ({ url: "/Farms/All" }),
      providesTags: ["Farms"],
    }),
    addFarm: build.mutation<void, IAddFarmPayload>({
      query: (body) => ({ url: "/Farms/add", method: "POST", body }),
      invalidatesTags: ["Farms", "Manager"],
    }),
    deleteFarm: build.mutation<void, number>({
      query: (id) => ({ url: `/Farms/delete/${id}`, method: "DELETE" }),
      invalidatesTags: ["Farms", "Manager"],
    }),
  }),
});

export default FarmApiSlice.reducer;
export const { useGetFarmsQuery, useAddFarmMutation, useDeleteFarmMutation } = FarmApiSlice;
```

Rules:

- The base URL comes from `config/` or `process.env.NEXT_PUBLIC_API_URL`, not repeated in every service.
- Tag every mutation so lists refresh automatically. Never refetch manually when tags can do it.
- Type both the response and the argument of every endpoint.

### 11.2 Axios (only when the project already uses it)

- Create one instance in `config/` with `baseURL` and `timeout`.
- Never call `axios` directly inside components.
- Type errors explicitly:

```ts
interface IAxiosError {
  error: { message?: string };
}

const errorObj = error as AxiosError<IAxiosError>;
const message = errorObj.response?.data.error.message ?? "Unexpected error";
```

### 11.3 Next.js route handlers

- Located at `app/api/<endpoint>/route.ts`.
- Validate the body with Zod before using it.
- Return typed JSON with the correct status code.
- Never expose server secrets to the client. Server-only env vars are not `NEXT_PUBLIC_*`.
- Keep business logic in a service/helper, not inside the route body.

---

## 12. Next.js App Router rules

- Server components are the default. Add `"use client"` only at the smallest boundary that needs it.
- Pages are thin composition only:

```tsx
import { CattleTable } from "@/components/Table/CattleTable";
import { AddCattle } from "@/components/Model/AddCatle";

const Page = () => (
  <div className="mt-8 w-full space-y-6">
    <AddCattle />
    <CattleTable />
  </div>
);

export default Page;
```

- Next.js 15 `params` are async: `params: Promise<{ id: string }>` and `await params`.
- One root layout owns `<html>`, `<body>`, fonts, providers, and global metadata. Nested layouts only
  wrap their segment. Do not duplicate `<html>`/`<body>` in nested layouts.
- Route groups (`(Dashboard)`) group layouts without changing the URL.
- Every route segment gets `metadata` when it is a real page.
- Add `error.tsx`, `not-found.tsx`, and `loading.tsx` where the segment needs them.
- Use `next/image` and `next/link`, never raw `<img>` or `<a>` for internal navigation.
- Providers live in `Providers/` and are mounted once in the root layout.
- Keep `components/ui/*` untouched except design tokens. Business code goes in feature folders.

---

## 13. Routing, auth, and i18n

- `i18n/routing.ts` defines locales (`en`, `ar`) and the default locale.
- `i18n/navigation.ts` exports the localized `Link`, `redirect`, `usePathname`, `useRouter`.
- `middleware.ts` uses the `next-intl` middleware with the correct matcher.
- Messages live in `messages/<locale>.json`. Never hardcode user-facing strings.
- Use `useTranslations("Namespace")` and `useLocale()` in client components.
- Do not hardcode `/en/` in links. Build localized paths with the active locale or the navigation helpers.
- Set `dir` from the locale (`ar` -> `rtl`, otherwise `ltr`) once in the root layout.
- Use logical Tailwind utilities (`ms-*`, `me-*`, `start-*`, `end-*`) and `rtl:` modifiers, not
  left/right assumptions.
- Auth guard pattern:
  - Client: read the token through `lib/` helpers, decode with `jwtDecode<IJwtPayload>`, and redirect
    to the localized login route.
  - Server: prefer validating the token in middleware or a layout before rendering protected pages.
  - Role-based UI derives from the decoded role (`admin`, `manager`, `Worker`), not from a hardcoded page.
  - Protected route component contract:

```tsx
interface IProps {
  isAllowed: boolean;
  redirectPath: string;
  children: ReactNode;
}

const ProtectedRoute = ({ isAllowed, redirectPath, children }: IProps) =>
  isAllowed ? children : <Navigate to={redirectPath} replace />;
```

- Never trust the JWT payload for authorization on the server without verification. Decoding is not
  verification.

---

## 14. Styling and UI

- Tailwind utility-first, mobile-first (`sm:`, `md:`, `lg:`).
- Conditional classes through `cn(...)` (clsx + tailwind-merge).
- Variant styling with `cva` when variants multiply. Do not create boolean prop explosions.
- Use the project design tokens. This repo uses a green primary, dark mode, and neutral surfaces.
  Follow the existing palette; do not introduce random colors.
- Shared primitives: `Button`, `Input`, `Card`, `Dialog`, `Table`, `Select`, `Paginator`, `Skeleton`.
  Extend them with `className`/variants; do not duplicate them.
- Icons: `lucide-react`.
- Toasts: `sonner` only (`toast.success`, `toast.error`).
- Animations: `framer-motion` wrappers (`AnimatedSection`, `AnimatedHeader`, `AnimatedImage`).
- `components/ui/` is shadcn-generated. Change tokens and class variants, not component architecture.
- Every new UI must be responsive and RTL-safe.
- Never leave the same long Tailwind class block copied in multiple files. Extract a component.

---

## 15. Performance and caching

- Use `memo` for pure/presentational components, cards, and table rows.
- Use `useCallback` for handlers passed to memoized children.
- Use `useMemo` for derived or expensive calculations.
- Do not memoize everything; only where it prevents real re-renders.
- Keep state as local as possible; lift only when shared.
- Cache server data with RTK Query. Do not duplicate the same request in multiple components.
- Invalidate tags after mutations instead of refetching manually.
- Use skeletons that match the layout, not layout-shifting spinners.
- Prefer stable keys (`id`) over array index.
- Lazy-load heavy widgets (charts, editors, PDF tools) when they are not needed on first paint.

---

## 16. Loading, error, and empty states

Every data-driven view must implement all of these:

1. **Loading** -> matching skeleton (`components/Skelton/*`) or a spinner.
2. **Error** -> route `error.tsx` or an inline message.
3. **Empty** -> friendly message (e.g. `No Requests Yet !!`).
4. **Success** -> render the data.
5. **Mutation feedback** -> toast + invalidate/refetch + reset the form + close the modal.

```tsx
if (isLoading) return <SkeletonList count={3} />;
if (isError) return <ErrorHandler />;
if (!data?.length) return <EmptyState />;
```

- Never render an empty table or a blank section without an empty state.
- Never leave a failed mutation silent. Always show feedback.

---

## 17. Do / Don't

**Do**

- Split files before they grow; extract subcomponents, hooks, schemas, and services early.
- Type every prop, payload, response, and state.
- Put shared contracts in `interface/`, validation in `validation/`, API in `store/services/`.
- Keep pages thin and components focused.
- Use RTK Query hooks and tags for server data.
- Use skeletons, error boundaries, and empty states.
- Reuse existing UI primitives, hooks, and helpers before writing new ones.
- Follow the numbered `state / handlers / render` sections.
- Use `next-intl` for every visible string.
- Verify with `npm run lint` and `npm run build`.

**Don't**

- Don't write a 200+ line file. Don't put a whole feature in one file.
- Don't use `any`, `@ts-ignore`, or `as` casts to silence type errors.
- Don't duplicate markup or Tailwind class blocks.
- Don't put business logic in JSX or pages.
- Don't call APIs or `localStorage` directly in presentational components.
- Don't store server data in Redux when RTK Query is available.
- Don't bypass validation.
- Don't add a library the stack already covers.
- Don't leave `console.log`, commented code, or unused files.
- Don't hardcode `/en/` routes or user-facing text.
- Don't edit `components/ui/*` for feature-specific behavior.

---

## 18. Anti-patterns this repo must not repeat

- 400-line add/edit modal files: split into dialog shell, form, fields, hook, schema, and types.
- Duplicated `<html>`/`<body>` in nested layouts: only the root layout owns them.
- Hardcoded locale prefixes (`/en/dashboard`) instead of localized navigation.
- Repeating the same cart-total `reduce` block in every reducer: use one selector/helper.
- Hardcoded API base URLs in every service: use one config/env value.
- `console.log` left in event handlers.
- Selectors typed ad hoc in components instead of the typed `useAppSelector` hook.
- Large generated/sidebar files mixed with business logic: keep generated UI isolated.
- Commented-out code blocks left in source.
- Reading `localStorage` during render without an SSR guard.

---

## 19. Definition of done

Before declaring a task finished:

- [ ] `npm run lint` passes.
- [ ] `npm run build` passes (Next.js build includes type checking).
- [ ] No TypeScript errors, no `any`, no `@ts-ignore`, no unused imports.
- [ ] No file exceeds ~200 lines; every file has one responsibility.
- [ ] Pages are thin and only compose components.
- [ ] All new props, state, API contracts, and payloads are typed and named correctly (`I`/`T` prefix).
- [ ] Forms and external payloads are validated with Zod.
- [ ] Loading, error, and empty states are handled.
- [ ] Mutations show feedback, reset forms, close modals, and invalidate tags.
- [ ] All new UI is responsive and RTL-safe.
- [ ] Reusable pieces are extracted into `components/ui` or `components/shared`.
- [ ] Server data uses RTK Query caching and tag invalidation.
- [ ] Handlers passed to memoized components use `useCallback`; expensive derived values use `useMemo`.
- [ ] No dead code, no commented code, no `console.log`, no unused files.
- [ ] The final structure matches this document.

---

## 20. AI execution protocol

When you are asked to build or change a feature:

1. **Explore first.** Find the domain folder, existing components, services, schemas, and interfaces.
2. **Plan the file list.** Write down each file and its single responsibility before coding.
3. **Split by default.** If a planned file would mix UI, state, API, validation, and types, split it now.
4. **Implement in order:** interfaces -> schemas -> services/slice -> hooks -> small components -> page composition.
5. **Reuse.** Check `components/ui`, `components/shared`, `hooks`, `lib`, and `store/services` first.
6. **Verify.** Run `npm run lint` and `npm run build`. Fix everything you introduced.
7. **Report.** Summarize the files created/changed and how they map to this architecture.

If a request would require breaking these rules, split the work and explain the structure.
Do not produce a giant file "to save time". The smaller, split solution is always the expected answer.
بحب ال Animation جدا الحركات انه ميكونش موقع عادي ومالوف لا فوق الخيال زي مثلا اضافه للسله يطير للسله كدا يبقا فيه Fly لحد السله بشكل ملحوظ في Animation في الارقام بيطلع كدا اي نوع انيميشن تريند وكويس اعمله انا بحبه ومهم بالنسبالي انا بعمل انه يكون في خط كدا بيزيد مع ال scroll مع زرار بيطلعني لفوق مع progressive كدا حواليه بنزلت قد اي في الصفحه لو في زرار تواصل معنا علي ال واتس يبقي حواليه انيميشن 
بارضه ال Card ذات نفسه عليه زي اضاءه كدا او خطوط كدا متحركه كل شويه تشد الانتباه يبقي موقع حلو اوي فاهمني انا مبسوط ونا بسكرول فيه ومشدو بالانيميشن عندي مثلا ك اقسام وانا بعمل action or scroll الانيميشن كدا بيتحرك بينهم بشكل smmothy جدا ومريح وحلو كدا انا مبسوط وانا بيتعملي دا صفحه ال Checkout تبقي كلها انمشن وحركات لو دخل ال Coupon غلط يبقي انيميشن زعل وهكذا الليله دي كلها 
انا مجنون انيميشن عموما يعني ادي في الانيميشن احبك متبقاش كئيب في الالوان تبقي قريبه للبهارات والعطاره واللوجو بتاعنا متقعدش تهبدلنا بحجات بعيده عنه حافظ واستخدم الوان ثابته عشان نبقي عارفين عاوزين الوان لل card تبقي مميزه له 


مبحبش تعمل كل حاجه لا هنبني ال Arcitecture and fiels وبعدين انا وانت نحدد ا لStyules and animation لاني بحبه عالي اوي ودا لازم باذن الله يبقي اجمد بروجكت عندي دا الواجهه اصلا 

هاوزك تستخدم الAnimation في كل حاجه حتي لو في حاجه بسيطه زي hover علي card او button او اي حاجه في الموقع لازم يكون فيها انيميشن حتي لو بسيط جدا بس يكون فيه احساس بالحركه والانتقال السلس بين العناصر

عاوزك تستخدم ال TailwndCSS مش تقعد تستخدم ال SAssعمال علي بطال كدا وخلي عندك Variable and styles ثابتة في TailwindCSS عشان نقدر نتحكم في الTheme والColors بسهولة ونخلي كل حاجة متناسقة مع اللوجو والهوية البصرية للموقع.

الالوان والهويه هنحددها في Variables عشان نقدر نغيره بسهوله وهيبقي فيه كدا اكتر من لون المستخدم يبدل بينهم كدا ويكون لكل واحد الالوان المميز بيه واللي يقدر يختاره من الTheme بتاعنا.
