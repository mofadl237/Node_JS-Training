# Reseller Module

> This document describes the archived full schema at
> `prisma/legacy/full-schema.prisma`. The reseller module is not part of the
> active 38-model MVP at `prisma/schema.prisma`.

This document explains the reseller/local-shop module and the boundary between
reseller stock and Om Eman stock. It complements `docs/integrity-rules.md`.

## 1. Goals

- Authorize local shops/resellers to sell Om Eman products.
- Let customers discover active, public resellers by location (governorate,
  city, district, street, GPS).
- Track which products/packages each reseller lists and what availability they
  report.
- Track stock physically held by a reseller without polluting Om Eman inventory.
- Track money owed between Om Eman and the reseller.
- Reconcile physical custody stock against the system.
- Support future partner-assisted fulfillment without pretending availability is
  a commitment.

## 2. Core distinction: four different things

| Concept | Model | Meaning |
| --- | --- | --- |
| Assortment | `ResellerProduct` | This reseller lists this product. |
| Reported availability | `ResellerPackageAvailability` | The reseller says/confirmed a package is available; this is a signal. |
| Custody stock | `ResellerStockBalance` / `ResellerStockMovement` | Physical stock held by the reseller; separate ledger. |
| Committed fulfillment | `OrderFulfillmentAllocation` / `ResellerFulfillmentConfirmation` | Om Eman has allocated an order item to this reseller and the reseller confirmed. |

Never collapse these into one status or one quantity.

## 3. Discovery

Eligibility for public discovery:

1. `Reseller.status = ACTIVE`.
2. `Reseller.listingStatus = PUBLIC`.
3. `Reseller.publicVisibility = true`.
4. Current time is inside `authorizationStart` / `authorizationEnd` when set.
5. `ResellerAddress.isCurrent = true`, `isPublic = true`, and `validTo` is null
   or in the future.
6. Optional filters: governorate, city, district, street, product, package.
7. Optional distance ranking from a customer GPS point.

Search by text uses `ResellerAddress` fields. Radius search currently uses
`latitude`/`longitude` columns; a future PostGIS migration can add proper
geography indexing.

## 4. Assortment and availability

- `ResellerProduct` is unique per `(resellerId, productId)`.
- `ResellerPackageAvailability` is unique per
  `(resellerProductId, productPackageId)`.
- `availabilityStatus` distinguishes reported availability
  (`REPORTED_IN_STOCK`) from Om Eman-confirmed availability
  (`CONFIRMED_IN_STOCK`), plus `LISTED`, `UNAVAILABLE`, and `UNKNOWN`.
- `reportedQuantity` is the reseller's reported count; `confirmedQuantity` is
  the Om Eman-confirmed count when one exists.
- `stockRangeMin/Max` are optional because resellers may report ranges rather
  than exact counts.
- `lastReportedAt` records the last report; `lastConfirmedAt` records when Om
  Eman last confirmed availability.
- Every meaningful change writes `ResellerAvailabilityHistory`.

Availability is **not** a reservation and **must not** decrement Om Eman stock.

## 5. Supply and ownership

`ResellerSupply` records a transfer between Om Eman and a reseller. Its
`transactionType` must make the ownership model explicit. Typical types include
consignment, wholesale sale, return, and adjustment (see
`ResellerTransactionType`).

Rules:

- A supply line references an `InventoryItem`, optional `ProductPackage`, optional
  `InventoryLot`, quantity, unit cost, and optional transfer price.
- Om Eman-owned consignment stock remains Om Eman-owned but is physically at the
  reseller; it is tracked in `ResellerStockBalance`, not `StockBalance`.
- Wholesale stock becomes reseller-owned at the agreed point; it must not remain
  in Om Eman valuation.
- A supply may create `ResellerStockMovement` rows and `ResellerAccountEntry`
  rows in the same transaction.
- No commission, wholesale price, or credit term is assumed by the schema. Use
  explicit values and snapshots.

## 6. Custody ledger

- `ResellerStockMovement` is append-only and supports movement types such as
  supply, sale, return, loss, adjustment, and reconciliation (see enum).
- `ResellerStockBalance` is a per-reseller/per-item aggregate for fast reads.
- The movement ledger is the source of truth; the balance is a cache that must
  be rebuildable from movements.
- `ResellerStockBalance` is unique per `(resellerId, inventoryItemId)`.
- Movements can reference a lot, a supply, an attachment, and the responsible
  employee.

## 7. Reseller account ledger

- `ResellerAccountEntry` is append-only and supports charges, payments,
  adjustments, and other entry types.
- `ResellerPayment` records money received/paid and can link to a
  `FinancialAccountEntry`.
- `ResellerPaymentAllocation` allocates a payment to one or more account
  entries; it is unique per `(paymentId, accountEntryId)`.
- Balances are computed from entries, not stored as a single mutable number.
- Due dates are explicit values; no default credit period is invented.

## 8. Reconciliation

`ResellerStockReconciliation` is a session:

1. Snapshot system quantity per item.
2. Record reported/counted quantity.
3. Compute discrepancy.
4. Approve or reject.
5. On approval, create an adjustment `ResellerStockMovement` and link it through
   `ResellerStockReconciliationLine.adjustmentMovementId`.
6. Update `ResellerStockBalance` from the movement.

Rules:

- One line per `(reconciliationId, inventoryItemId)`.
- Reconciliation never edits historical movements.
- Approval must be permission-checked and audited.
- Differences must have a reason; unexplained shrinkage should be flagged.

## 9. Partner-assisted fulfillment

- `OrderFulfillment` can have `source = RESELLER` and a `resellerId`.
- `OrderFulfillmentAllocation` records how much of each order item comes from a
  warehouse or a reseller.
- `ResellerFulfillmentConfirmation` is one-to-one with the fulfillment and
  records the reseller's confirmation, `agreedPrice`, and `commercialTerms`
  snapshot.
- Availability must not be treated as a commitment. Only a confirmed fulfillment
  allocation may trigger reseller-side stock deduction and customer-facing
  promises.

## 10. Suggested service transactions

### Add/update availability

```text
BEGIN
  upsert ResellerProduct
  upsert ResellerPackageAvailability
  insert ResellerAvailabilityHistory
  insert AuditLog
COMMIT
```

### Receive supply from Om Eman

```text
BEGIN
  create ResellerSupply + lines
  for each line:
    create ResellerStockMovement (SUPPLY_IN)
    upsert ResellerStockBalance (+quantity)
  create ResellerAccountEntry (charge) if applicable
  optionally create Om Eman StockMovement (OUT) only if ownership leaves Om Eman
  insert AuditLog
COMMIT
```

### Record reseller payment

```text
BEGIN
  create ResellerPayment
  create FinancialAccountEntry (money in)
  create ResellerPaymentAllocation(s)
  link ResellerAccountEntry payment reference
  insert AuditLog
COMMIT
```

### Reconcile custody stock

```text
BEGIN
  lock ResellerStockBalance rows
  create ResellerStockReconciliation + lines
  for each discrepancy:
    create ResellerStockMovement (ADJUSTMENT)
    update ResellerStockBalance
  mark reconciliation APPROVED
  insert AuditLog
COMMIT
```

## 11. Required future APIs (not implemented)

- `GET /resellers` public discovery with filters and pagination.
- `GET /resellers/:id` public profile with public address and assortment.
- `GET /resellers/:id/availability` public/reported availability.
- Admin CRUD for resellers, addresses, assortment, availability.
- Admin supply, custody movement, account ledger, payment, reconciliation.
- Partner fulfillment confirmation endpoints.

These must be implemented later with permission checks, Zod validation, audit
logging, and transaction boundaries described above.
