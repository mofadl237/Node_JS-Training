# Business Rule Coverage

> This document describes the archived full schema at
> `prisma/legacy/full-schema.prisma`. The active schema is the 38-model MVP at
> `prisma/schema.prisma`; see `prisma/mvp/README.md`.

This document maps the requested business capabilities to the schema. It is a
coverage map, not an API specification.

## 1. Identity, access, and audit

| Requirement | Schema coverage |
| --- | --- |
| Employees and roles | `Employee`, `Role`, `EmployeeRole` |
| Fine-grained permissions | `Permission`, `RolePermission` |
| Backend-enforced authorization | Permission model stored; enforcement belongs to services/middleware (future) |
| Login attempt tracking | `LoginAttempt` |
| Protected audit trail | `AuditLog` with actor, module, entity, old/new values, result, IP, user agent |
| Multiple roles per employee | `EmployeeRole` unique per employee/role |

## 2. Customers and accounts

| Requirement | Schema coverage |
| --- | --- |
| Customer profile | `Customer` |
| Multiple addresses | `CustomerAddress` |
| Cart and abandoned cart | `Cart`, `CartItem`, `CartItemBundleComponent` |
| Wishlist | `WishlistItem` |
| Activity tracking | `CustomerActivityEvent` |
| Loyalty levels and events | `LoyaltyLevel`, `CustomerLoyalty`, `LoyaltyQualification`, `LoyaltyEvent` |

## 3. Catalog

| Requirement | Schema coverage |
| --- | --- |
| Categories and subcategories | `Category`, `Subcategory`, `ProductSubcategory` |
| Product identity | `Product` |
| Sellable packages/SKUs | `ProductPackage` |
| Barcodes | `ProductPackage.barcode` |
| Multiple images | `ProductImage` |
| Search aliases (Arabic/English) | `ProductAlias`, normalized search columns |
| Attributes | `ProductAttribute`, `ProductAttributeValue` |
| Bundles | `ProductBundleComponent`, `OrderItemBundleComponent`, `CartItemBundleComponent` |
| Product status/publication | `ProductStatus`, `publishedAt`, `archivedAt` |

## 4. Units, tax, currency, numbering

| Requirement | Schema coverage |
| --- | --- |
| Units and conversions | `UnitOfMeasure`, `UnitConversion` |
| Currency | `Currency`, `Order.currencyId`, `Invoice.currencyId` |
| Effective tax rates | `TaxRate` with `effectiveFrom` / `effectiveTo` |
| Tax snapshots | `OrderItem.taxRateSnapshot`, `Invoice.taxRateSnapshot` |
| Document numbering | `DocumentSequence` |

## 5. Inventory

| Requirement | Schema coverage |
| --- | --- |
| Raw materials, packaging, finished goods | `InventoryItem.itemType` |
| Warehouses and locations | `Warehouse`, `WarehouseLocation` |
| Lots and expiry | `InventoryLot`, `ExpiryAlert` |
| On-hand/reserved balances | `StockBalance` |
| Immutable movements | `StockMovement`, `StockMovementLine` |
| Reversals | `StockMovement.reversalOfId` |
| Reservations | `StockReservation` |
| Transfers | `StockTransfer`, `StockTransferLine` |
| Counts | `StockCountSession`, `StockCountLine` |
| Losses | `StockLoss` |
| Reorder policy | `ReorderPolicy` |
| Cost reference | `InventoryItemCostReference` |
| FIFO support | Lot `receivedAt`, `remainingQuantity`, `unitCost` |
| Production/assembly | `ProductionBatch`, `ProductionInputLine`, `ProductionOutputLine`, `ProductionLossLine` |

## 6. Purchasing and suppliers

| Requirement | Schema coverage |
| --- | --- |
| Supplier profile and contacts | `Supplier`, `SupplierContact` |
| Supplier-specific items/prices | `SupplierItem` |
| Purchase orders | `PurchaseOrder`, `PurchaseOrderLine` |
| Goods receipt | `GoodsReceipt`, `GoodsReceiptLine` |
| Lot creation on receipt | `InventoryLot.goodsReceiptLineId` unique |
| Supplier invoices | `SupplierInvoice`, `SupplierInvoiceLine` |
| Additional/landed costs | `PurchaseAdditionalCost`, `LandedCostAllocation` |
| Invoice discrepancies | `SupplierInvoiceDiscrepancy` |
| Supplier returns | `SupplierReturn`, `SupplierReturnLine` |
| Supplier payables ledger | `SupplierLedgerEntry` |
| Supplier payments and allocation | `SupplierPayment`, `SupplierPaymentAllocation` |
| Proof attachments | `Attachment`, `SupplierPayment.proofAttachmentId` |

## 7. Orders and sales

| Requirement | Schema coverage |
| --- | --- |
| Order header | `Order` |
| Order lines with snapshots | `OrderItem` |
| Bundle component snapshots | `OrderItemBundleComponent` |
| Status history | `OrderStatusHistory` |
| Address snapshot | `OrderAddressSnapshot` |
| Discounts | `OrderDiscount` |
| Separate order/payment/shipment status | `Order.status`, `Order.paymentStatus`, `Shipment.status` |
| Invoice | `Invoice`, `InvoiceLine` |
| Invoice status | `InvoiceStatus` |
| Payment attempts | `PaymentAttempt` |
| Payment proof | `PaymentProof` |
| Refunds | `Refund` |
| Customer returns | `CustomerReturn`, `CustomerReturnItem` |
| Return restock link | `CustomerReturnItem.restockMovementId` |
| Replacement order link | `Order.replacementForReturnId` |
| Cancellation | `Order.canceledAt`, status history |
| COGS snapshot | `Order.cogsTotal`, `OrderItem.unitCostSnapshot` |

## 8. Shipping

| Requirement | Schema coverage |
| --- | --- |
| Carriers | `ShippingCarrier` |
| Tariffs | `ShippingTariff` |
| Shipment | `Shipment` |
| Shipment history | `ShipmentStatusHistory` |
| Delivery attempts | `ShipmentDeliveryAttempt` |
| Carrier remittance | `CarrierRemittance`, `CarrierRemittanceLine` |
| Carrier receivables/settlement | Remittance lines + `FinancialAccountEntry` |

## 9. Fulfillment

| Requirement | Schema coverage |
| --- | --- |
| Fulfillment plan | `OrderFulfillment` |
| Allocation to warehouse or reseller | `OrderFulfillmentAllocation` |
| Partner-assisted fulfillment | `ResellerFulfillmentConfirmation` |
| Confirmation terms | `agreedPrice`, `commercialTerms` snapshot |
| Separate from availability | Availability tables are not used as committed stock |

## 10. Promotions

| Requirement | Schema coverage |
| --- | --- |
| Promotion rules | `Promotion` |
| Targets | `PromotionTarget` |
| Coupons | `Coupon` |
| Redemptions | `PromotionRedemption` |
| Discount snapshots on order | `OrderDiscount` |

## 11. Finance

| Requirement | Schema coverage |
| --- | --- |
| Cash/bank/wallet accounts | `FinancialAccount` |
| Append-only account entries | `FinancialAccountEntry` |
| Transfers | `FinancialTransfer` |
| Expense categories | `ExpenseCategory` |
| Expenses | `Expense` |
| Expense payments | `ExpensePayment` |
| Recurring expenses | `RecurringExpense`, `RecurringExpenseOccurrence` |
| Revenue/expense reporting | Entries + expense dates |
| Payment/refund links | `Payment.financialAccountEntryId`, `Refund.financialAccountEntryId` |

## 12. Authorized resellers — discovery and assortment

| Requirement | Schema coverage |
| --- | --- |
| Authorized reseller profile | `Reseller` with `status`, `authorizationStart/End` |
| Public listing control | `listingStatus`, `publicVisibility` |
| Public discovery by governorate/city/district/street | `ResellerAddress` |
| GPS discovery | `ResellerAddress.latitude/longitude` |
| Multiple addresses with validity | `ResellerAddress.validFrom/validTo/isCurrent/isPublic` |
| Product assortment | `ResellerProduct` |
| Package-level reported availability | `ResellerPackageAvailability` |
| Reported vs confirmed availability | `availabilityStatus` (`REPORTED_IN_STOCK` vs `CONFIRMED_IN_STOCK`), `reportedQuantity`, `confirmedQuantity`, `lastReportedAt`, `lastConfirmedAt` |
| Availability history | `ResellerAvailabilityHistory` |
| Avoid inventing stock | No automatic Om Eman inventory mutation from availability |
| Active/public filtering | Indexed status/listing/visibility + service filters |

## 13. Authorized resellers — custody, ledger, reconciliation

| Requirement | Schema coverage |
| --- | --- |
| Supply/consignment/wholesale transaction | `ResellerSupply`, `ResellerSupplyLine`, `ResellerTransactionType` |
| Om Eman-owned vs reseller-owned vs wholesale | `transactionType` + dedicated custody tables |
| Custody stock movement ledger | `ResellerStockMovement` |
| Custody balance | `ResellerStockBalance` |
| Lot/cost traceability | `lotId`, `unitCost`, `transferPrice` |
| Reseller account ledger | `ResellerAccountEntry` |
| Reseller payments | `ResellerPayment` |
| Payment allocation | `ResellerPaymentAllocation` |
| Stock reconciliation | `ResellerStockReconciliation`, `ResellerStockReconciliationLine` |
| Adjustment movement link | `ResellerStockReconciliationLine.adjustmentMovementId` |
| Future partner-assisted fulfillment | `OrderFulfillment`, `OrderFulfillmentAllocation`, `ResellerFulfillmentConfirmation` |
| Commissions/wholesale terms | Stored as configurable snapshots (see `agreedPrice` and `commercialTerms`), not invented defaults |

## 14. Content, notifications, files

| Requirement | Schema coverage |
| --- | --- |
| Homepage sections/banners | `HomepageSection`, `Banner` |
| Static pages | `StaticPage` |
| FAQs | `Faq` |
| Articles | `Article` |
| Notifications | `Notification` |
| Delivery attempts | `NotificationDeliveryAttempt` |
| Attachments/versioning | `Attachment`, `AttachmentVersion` |

## 15. Deliberately not covered yet

- Business-rule layer beyond generated CRUD.
- Refresh-token and fine-grained permission implementation.
- Payment gateway integration.
- Carrier API integration.
- Email templates and scheduling.
- Frontend.
- Commission/credit-term business defaults.
- PostGIS-based radius search.
