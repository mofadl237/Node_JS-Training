# Migration Plan

> This document describes the archived full schema at
> `prisma/legacy/full-schema.prisma`. The active schema is the 38-model MVP at
> `prisma/schema.prisma`; see `prisma/mvp/README.md` for MVP next steps.

## Current state

No migration has been generated yet. The schema is valid and the Prisma client
has been generated, but no PostgreSQL database has been migrated from this
repository in this task.

`prisma7.config.ts` defines:

- schema: `prisma/schema.prisma`
- migrations: `prisma/migrations`
- datasource URL: `process.env["DATABASE_URL"]`

## Prerequisites

1. A reachable PostgreSQL database (local, Docker, or hosted).
2. `DATABASE_URL` in `.env` pointing to that database.
3. Prisma CLI available through the project (`npx prisma`).

## First migration

```bash
npx prisma format
npx prisma validate
npx prisma migrate dev --name init
npx prisma generate
```

`migrate dev` will create the initial SQL migration and apply it to the
development database. Review the generated SQL before committing it.

## Production deployment

```bash
npx prisma migrate deploy
npx prisma generate
```

Never run `migrate dev` or `db push` against production.

## Recommended migration order after the initial schema

1. **Identity and settings** — employees, roles, permissions, units, currencies,
   tax rates, document sequences.
2. **Catalog** — categories, products, packages, attributes.
3. **Warehouses and inventory** — warehouses, locations, inventory items, lots,
   stock balances.
4. **Procurement** — suppliers, purchase orders, receipts, supplier invoices,
   ledger, payments.
5. **Sales** — orders, invoices, payments, refunds, returns, shipping.
6. **Fulfillment and resellers** — fulfillment, reseller profiles, assortment,
   custody, ledger, reconciliation.
7. **Finance and content** — accounts, expenses, promotions, CMS, notifications.

The initial schema should be created as one migration; the order above matters for
future data migrations and for understanding dependencies.

## Data migration cautions

- Backfill `InventoryItem` rows before linking `ProductPackage.inventoryItemId`.
- Backfill `DocumentSequence` before issuing any business document numbers.
- If importing legacy orders, preserve original order numbers and create
  historical snapshots rather than recalculating from current catalog data.
- If importing stock, create opening `InventoryLot` rows and a single opening
  `StockMovement` per item/location; do not insert `StockBalance` without the
  corresponding movement.
- For reseller custody imports, use `ResellerStockMovement` opening entries and
  keep them separate from Om Eman `StockMovement`.
- Never backfill audit logs with fabricated actors; use a documented system actor
  or leave the actor nullable with an explicit reason.

## Rollback policy

- Development: reset with `npx prisma migrate reset` only when data loss is
  acceptable.
- Production: use forward-only corrective migrations. Do not edit an applied
  migration file.
- For destructive changes, use a multi-step migration (add new column, backfill,
  switch reads/writes, then drop old column).

## Verification checklist

- [ ] `npx prisma validate` passes.
- [ ] `npx prisma format` leaves the file unchanged.
- [ ] `npx prisma generate` succeeds.
- [ ] `npx tsc --noEmit` succeeds.
- [ ] Migration SQL reviewed for unintended drops.
- [ ] Seed/setup data is explicit and documented.
- [ ] Backup taken before production migration.
