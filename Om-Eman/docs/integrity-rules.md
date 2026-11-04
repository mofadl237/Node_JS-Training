# Integrity & Transaction Rules

> This document describes the archived full schema at
> `prisma/legacy/full-schema.prisma`. The active schema is the 38-model MVP at
> `prisma/schema.prisma`; see `prisma/mvp/README.md` and
> `prisma/mvp/manual_constraints.sql`.

This document defines the invariants that future services must preserve. It is
part of the schema contract; changing these rules requires a schema review.

## 1. General rules

1. **No destructive history edits.** Stock movements, ledger entries, status
   histories, loyalty events, audit logs, and reseller custody movements are
   append-only.
2. **Corrections are reversals.** A wrong movement is reversed by a linked
   `StockMovement.reversalOfId`; a wrong ledger entry is corrected by an
   opposite entry. Never `UPDATE` or `DELETE` the original.
3. **Money and quantities use `Decimal`.** Never use floating point arithmetic
   for business values.
4. **Historical snapshots are mandatory.** Order/invoice lines must keep names,
   SKU, price, tax rate, and unit cost snapshots.
5. **All multi-table writes happen in one transaction.** If any step fails, the
   whole operation rolls back.
6. **Document numbers come from `DocumentSequence`.** Do not use timestamps or
   random strings as business document numbers.
7. **Audit sensitive actions.** Create/update/delete/approve/void actions must
   write `AuditLog` inside the same transaction.
8. **Idempotency.** Payment webhooks, notifications, and external callbacks
   should use idempotency keys (`PaymentAttempt`, `Notification.idempotencyKey`,
   or a dedicated external reference).

## 2. Purchase receipt flow

```text
PurchaseOrder (APPROVED)
  -> GoodsReceipt (DRAFT -> RECEIVED)
       -> GoodsReceiptLine per item
       -> InventoryLot created with unitCost, receivedAt, expiryDate
       -> StockMovement (RECEIPT) + StockMovementLine (+quantity)
       -> StockBalance upsert (+onHandQuantity)
       -> InventoryItemCostReference update
  -> SupplierInvoice
       -> SupplierInvoiceLine
       -> optional PurchaseAdditionalCost + LandedCostAllocation
       -> SupplierLedgerEntry (purchase charge)
       -> optional SupplierInvoiceDiscrepancy
```

Rules:

- A lot cannot be created without an `InventoryItem` and `Warehouse`.
- `InventoryLot.remainingQuantity` starts at `originalQuantity` and is reduced
  only through stock movement lines.
- `GoodsReceiptLine.goodsReceiptLineId` is unique on `InventoryLot`, preventing
  duplicate lot creation for one receipt line.
- Landed cost allocations must sum to the additional cost total; this is
  enforced in the service transaction.
- A supplier invoice may be matched to a goods receipt; discrepancies are
  recorded, not silently overwritten.

## 3. Supplier payment flow

```text
SupplierPayment (PENDING -> CONFIRMED)
  -> optional FinancialAccountEntry (money out)
  -> SupplierPaymentAllocation(s) against SupplierInvoice(s)
  -> SupplierLedgerEntry entries updated/linked
```

Rules:

- Sum of allocations cannot exceed the payment amount.
- A payment cannot allocate to another supplier’s invoice.
- Confirmed payments must have a financial account or an explicitly documented
  cash settlement method.
- Voiding a payment creates reversal entries; it does not delete allocations.

## 4. Order lifecycle

```text
Order (RECEIVED)
  -> stock reservation (optional but recommended)
  -> OrderStatusHistory rows
  -> OrderFulfillment + OrderFulfillmentAllocation
  -> StockMovement (SALE/ISSUE) or reseller custody movement
  -> Invoice
  -> Payment(s)
  -> Shipment + ShipmentStatusHistory
  -> Delivery
```

Rules:

- `Order.status` and `Order.paymentStatus` are independent. A delivered order
  may still be unpaid (COD), and a paid order may still be unfulfilled.
- Reserved quantity must never exceed available stock; release reservations when
  an order is canceled or expires.
- Issuing stock consumes reservations and writes a movement with a cost snapshot.
- `OrderAddressSnapshot` is frozen at order placement.
- `OrderItem` keeps product/package snapshots even if the catalog row is later
  archived.
- Invoice numbers are generated per year/type through `DocumentSequence`.
- An invoice is one-to-one with an order (`Invoice.orderId @unique`).

## 5. Payments and refunds

Rules:

- `Payment` is the confirmed/expected money record; `PaymentAttempt` records
  gateway or manual attempts; `PaymentProof` stores evidence.
- Only confirmed payments update `Order.paidTotal` and invoice `paidTotal`.
- A refund references the original order and optionally the original payment.
- `Order.refundedTotal`, `Invoice.refundedTotal`, and `Refund` records must stay
  consistent in one transaction.
- Refund amounts cannot exceed captured/confirmed payments for the order.
- Payment proofs and refund evidence are attachments, not inline blobs.

## 6. Customer returns

Rules:

- `CustomerReturnItem` references the original `OrderItem`.
- Return disposition decides whether stock is restocked, scrapped, or sent for
  inspection.
- Restocking creates a `StockMovement` and links it through
  `CustomerReturnItem.restockMovementId`.
- A replacement order uses `Order.replacementForReturnId`; it is a new order, not
  an edit of the original.
- Refund and return status are separate; a return can be completed without a
  refund (e.g. exchange) and vice versa only with explicit approval.

## 7. Shipping and carrier settlement

Rules:

- `Shipment.status` is independent of `Order.status`.
- Delivery attempts are append-only.
- `CarrierRemittance` records money collected/owed by the carrier.
- `CarrierRemittanceLine` links a remittance to a shipment and cannot duplicate
  the same shipment in one remittance.
- Carrier remittance reconciliation writes `FinancialAccountEntry` and updates
  the remittance status, never deletes lines.

## 8. Stock count, transfers, losses, production

Rules:

- `StockCountLine` records system quantity, counted quantity, and variance.
- Approval of a count creates adjustment movements; it does not directly edit
  `StockBalance`.
- `StockTransfer` moves stock between locations/warehouses with paired movement
  lines; in-transit state must be explicit if the transfer is not immediate.
- `StockLoss` must link to a movement line and a reason.
- `ProductionBatch` consumes input lots and produces output lots/packages;
  waste is recorded separately in `ProductionLossLine`.
- Expiry alerts are generated from lots; they do not mutate lot status by
  themselves.

## 9. Reseller custody and ownership

Rules:

- `ResellerStockBalance` and `ResellerStockMovement` are the source of truth for
  stock physically held by a reseller.
- Reseller custody stock is **not** included in Om Eman `StockBalance` or
  inventory valuation by default.
- `ResellerSupply.transactionType` must make ownership explicit
  (consignment, wholesale, return, adjustment, etc.).
- Only an explicit ownership transfer/consignment workflow may create Om Eman
  inventory movements from reseller stock.
- `ResellerPackageAvailability` is a **reported/confirmed availability signal**,
  not a reservation. It must not be used as committed stock. Reported quantity
  and Om Eman-confirmed quantity are separate fields.
- Committed fulfillment is represented by `OrderFulfillmentAllocation` and
  `ResellerFulfillmentConfirmation`, not by availability status.
- Public discovery must require: active reseller, public visibility, valid
  authorization window, current public address, and active assortment.
- Availability changes are append-only through `ResellerAvailabilityHistory`.
- Reseller reconciliation compares system custody quantity with reported count;
  approval creates an adjustment `ResellerStockMovement` linked from the
  reconciliation line.
- Reseller account entries are append-only. Payments allocate against entries;
  they do not edit balances directly.
- No commission rate, wholesale price, credit limit, or due date is invented by
  the schema. Such values must come from explicit configuration/business input
  and, where needed, be stored as snapshots on the transaction.

## 10. Finance

Rules:

- `FinancialAccountEntry` is append-only and must reference an account.
- Transfers create paired entries (out/in) and a `FinancialTransfer` record.
- Expenses are separate from supplier invoices and reseller payments; each has
  its own ledger/payment path.
- Recurring expenses generate occurrences and expense records; editing the
  template must not rewrite already generated expenses.
- Revenue is recognized from confirmed sales/invoices, not from order placement.

## 11. Permissions and audit

Rules:

- Every employee action that changes business state must be authorized by a
  backend permission check.
- `AuditLog` records actor, action, entity, before/after payload, IP, user agent,
  and result.
- Audit logs are protected: no normal update/delete endpoint; retention and
  export are separate privileged operations.
- Failed logins are recorded in `LoginAttempt`; repeated failures feed lockout
  policy in the service layer.

## 12. Concurrency and locking

Future services should:

- use `SELECT ... FOR UPDATE` (or Prisma interactive transactions with
  serializable isolation where appropriate) when updating stock balances;
- update `StockBalance` and `ResellerStockBalance` in deterministic order to
  avoid deadlocks;
- use unique constraints as the final guard for duplicates (e.g. one lot per
  receipt line, one invoice per order, one reconciliation line per item);
- re-read totals after writes and assert invariants before commit.
