# Changelog

## [0.5.0] - 2026-11-03

### Added

- `POST /api/products/import` for multipart CSV product import
  (`csv-parser` + `multer` memory storage, OWNER/ADMIN only, 5 MB limit).
- Optional `ProductPackage` creation per CSV row when `sku` is present.
- Per-row validation and error reporting, duplicate checks for `slug`, `sku`,
  and `barcode`, and automatic Arabic search-field normalization.
- `docs/examples/products-import.csv` template and Arabic import documentation.

### Changed

- `npm run modules:generate` now preserves `src/modules/productImport/` and
  mounts it at `/products/import`.
- Swagger now documents the import endpoint (79 paths, 181 operations, 123
  schemas).
- Manual `POST /api/products` remains unchanged and fully supported.

## [0.4.0] - 2026-11-01

### Added

- Auth module (`POST /api/auth/login`, `GET /api/auth/me`) with JWT, bcrypt,
  and `Employee` status validation.
- `scripts/generate-modules.ts` generating 38 CRUD modules from
  `prisma/schema.prisma` with controller/service/router/validation/types files.
- `src/modules/index.ts` mounting Auth and all generated modules under `/api`.
- Shared helpers: `ApiResponse`, pagination, Zod validation middleware, JWT and
  password utilities, and `IAuthPayload`.
- Public read access for catalog/content models and `authenticate` +
  `authorize(OWNER, ADMIN)` for all writes.
- Append-only modules reject update/delete and expose read/create only.
- `Employee` and `Customer` accept `password` and persist `passwordHash`.
- `npm run modules:generate` script.
- `src/modules/module-metadata.ts`, generated from the Prisma schema, used to
  build the OpenAPI paths and schemas.
- Swagger UI at `/api/docs` and raw OpenAPI JSON at `/api/docs.json`
  (78 paths, 180 operations, 119 schemas).
- `docs/PROJECT_OVERVIEW_AR.md`, a complete Arabic project guide.

### Changed

- `src/app.ts` now mounts the `/api` router and Swagger UI.
- Helmet CSP allows the inline assets required by Swagger UI.
- Zod, JWT, and bcrypt are now active rather than planned.
- README and AGENTS.md document the generated API surface and Swagger.

### Notes

- Generated modules are generic CRUD; business rules (transactions, audit,
  transitions, totals, snapshots) still require manual implementation.
- No migration or seed was added.

## [0.3.0] - 2026-10-31

### Added

- MVP Prisma schema promoted to `prisma/schema.prisma` (38 models, 25 enums)
  with catalog, carts, wishlist, orders, invoices, payments, shipping,
  promotions, marketing events, content, notifications, settings, and document
  sequences.
- Full 133-model schema archived at `prisma/legacy/full-schema.prisma` as
  reference only; Prisma CLI and the application do not use it.
- `prisma/mvp/manual_constraints.sql` with Arabic normalization, trigram search
  functions, append-only triggers, bundle rules, CHECK constraints, GIN indexes,
  and reporting views.
- `prisma/mvp/dry-run.sql` with idempotent sample data and search/view smoke
  tests.
- `src/utils/arabic/normalize-arabic.ts` with normalization, tokenization, and
  exported normalization/tokenization test cases.
- `prisma/mvp/README.md` with the MVP changelog, decisions, commands, reporting
  views, open questions, and next steps.

### Changed

- MVP payment status is cached on `Order`, while `Payment` remains the source of
  truth.
- MVP customer order statistics are cached from delivered orders and audited by
  the `customer_order_stats_drift` view.
- Promotion usage and display are based on `PromotionRedemption`; the MVP has no
  separate `OrderDiscount` model.
- Bundle components carry no price; bundle savings are computed and snapshotted
  at checkout.
- All Prisma enums use the `E` prefix (for example `ELanguage`, `EOrderStatus`,
  `EPaymentStatus`), matching the TypeScript `E`/`I` naming convention.

### Notes

- `prisma/schema.prisma` is now the active MVP schema.
- `prisma/legacy/full-schema.prisma` is the archived full schema and is not used.
- No MVP migration, seed, or API endpoint was created.
- `prisma7.config.ts` points to the active MVP schema and `prisma/migrations`.

## [0.2.0] - 2026-10-30

### Added

- Typed environment configuration (`IEnvConfig`) with `EEnvironment`, JWT,
  bcrypt, SMTP, timezone, currency, and logging settings.
- File-based logger writing to `logs/app.log` (configurable via `LOG_FILE`),
  with JSON output in production and human-readable output in development.
- Logger lifecycle `close()` called during graceful shutdown.
- Morgan HTTP logs and Prisma error/warn/query logs routed through the logger.
- `src/config/email.ts` with `IEmailMessage`, `isEmailConfigured`, and
  `sendEmail`.
- `src/config/swagger.ts` with shared OpenAPI components, tags, and an empty
  `paths` object. Swagger UI is intentionally not mounted.
- `src/enums/EEnvironment.ts`, `src/enums/ELogLevel.ts`,
  `src/interfaces/logger/ILogger.ts`, and `src/interfaces/email/IEmailMessage.ts`.
- `logs/.gitkeep` and `logs/app.log`.
- Arabic `README.md` and `FEEDBACK.md` work log.

### Changed

- `src/app.ts` no longer registers `/health` or `/`; the app contains
  infrastructure middleware and error handling only.
- `src/config/prisma.ts` routes Prisma logs through the application logger.
- `.env.example` documents all current environment variables.
- `.gitignore` ignores `logs/*.log` while keeping `logs/.gitkeep`.
- `AGENTS.md` updated with the new configuration, logging, and no-endpoint state.

### Fixed

- `JWT_SECRET` is now optional only outside production; production refuses to
  start without it.

## [0.1.0] - 2026-10-30

### Added

- Complete Prisma schema for Om Eman (133 models, 72 enums), covering identity,
  customers, catalog, units, inventory, production, procurement, sales,
  invoicing, payments, returns, shipping, fulfillment, promotions, finance,
  authorized resellers, content, notifications, and attachments.
- Authorized reseller module:
  - public discovery by governorate/city/district/street/GPS;
  - product/package assortment and separate reported vs confirmed availability;
  - custody stock ledger separate from Om Eman inventory;
  - reseller account ledger, payments, allocations, and reconciliation;
  - partner-assisted fulfillment confirmation.
- Express 5 application bootstrap (`src/app.ts`) with Helmet, CORS, body
  parsing, Morgan logging, health/root endpoints, and central error handling.
- Server bootstrap (`src/server.ts`) with Prisma connection and graceful
  shutdown.
- Environment configuration, Prisma client with `@prisma/adapter-pg`, error
  hierarchy, Prisma error mapper, and logger.
- ERD diagrams split by domain.
- Documentation: architecture, entity inventory, integrity rules, index/query
  plan, migration plan, business-rule coverage, reseller module, assumptions,
  and AI-readable project memory (`AGENTS.md`).

### Changed

- `package.json` is now ESM (`"type": "module"`) with build/dev/database scripts.
- `tsconfig.json` is configured for NodeNext, strict TypeScript, and `dist/`
  output.

### Notes

- No business API endpoints were implemented by design.
- No migration has been generated or applied.
- No seed or fake production data was created.
