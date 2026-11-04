# Entity Inventory

> This document describes the archived full schema at
> `prisma/legacy/full-schema.prisma`. The active schema is the 38-model MVP at
> `prisma/schema.prisma`; see `prisma/mvp/README.md`.

The archived full schema contains **133 models**. Models are grouped below by
responsibility.
Every model has `id String @id @default(cuid())` unless it is a pure join table,
and most mutable models have `createdAt` / `updatedAt`.

## Identity, access, and audit

| Model | Purpose |
| --- | --- |
| `Employee` | Staff account and profile. |
| `Role` | Named role assigned to employees. |
| `Permission` | Atomic permission code. |
| `RolePermission` | Role-to-permission join. |
| `EmployeeRole` | Employee-to-role join. |
| `LoginAttempt` | Login attempt history and lockout evidence. |
| `AuditLog` | Protected audit trail for sensitive actions. |

## Customers, cart, loyalty, reviews

| Model | Purpose |
| --- | --- |
| `Customer` | Customer account and contact identity. |
| `CustomerAddress` | Saved customer addresses. |
| `CustomerActivityEvent` | Behavioral/activity event stream. |
| `WishlistItem` | Customer wishlist entry. |
| `Cart` | Active or abandoned cart. |
| `CartItem` | Cart line referencing a product/package. |
| `CartItemBundleComponent` | Bundle component snapshot inside a cart line. |
| `LoyaltyLevel` | Loyalty tier definition. |
| `CustomerLoyalty` | Customer loyalty state. |
| `LoyaltyQualification` | Evidence that a customer qualifies for a level. |
| `LoyaltyEvent` | Append-only loyalty points/events. |
| `ProductReview` | Product review with moderation state. |
| `StoreReview` | Store-level review with moderation state. |
| `ReviewModerationHistory` | Review moderation history. |

## Catalog

| Model | Purpose |
| --- | --- |
| `Category` | Top-level catalog category. |
| `Subcategory` | Subcategory under a category. |
| `Product` | Commercial product identity. |
| `ProductSubcategory` | Additional subcategory cross-listing. |
| `ProductImage` | Product image and ordering. |
| `ProductAlias` | Arabic/English search alias. |
| `ProductPackage` | Sellable package/SKU with size and price. |
| `ProductBundleComponent` | Bundle definition: component package and quantity. |
| `ProductAttribute` | Attribute definition (e.g. origin, form). |
| `ProductAttributeValue` | Attribute value for a product. |

## Units, currency, tax, settings, numbering

| Model | Purpose |
| --- | --- |
| `UnitOfMeasure` | Unit definition and precision. |
| `UnitConversion` | Conversion factor between units. |
| `Currency` | Currency definition. |
| `TaxRate` | Effective-dated tax rate. |
| `SystemSetting` | JSON system configuration. |
| `DocumentSequence` | Per-document-type/year number generator. |

## Warehouses, inventory, production

| Model | Purpose |
| --- | --- |
| `Warehouse` | Physical warehouse. |
| `WarehouseLocation` | Bin/shelf/location inside a warehouse. |
| `InventoryItem` | Stock-keeping unit (raw material, packaging, or finished item). |
| `InventoryItemCostReference` | Last/highest purchase price reference. |
| `ReorderPolicy` | Reorder point, safety stock, lead time. |
| `InventoryLot` | Received lot with cost, expiry, and remaining quantity. |
| `StockBalance` | On-hand and reserved quantity per item/location. |
| `StockMovement` | Immutable stock movement header, supports reversals. |
| `StockMovementLine` | Item/lot/quantity/cost line of a stock movement. |
| `StockReservation` | Reservation of stock for an order item. |
| `StockTransfer` | Warehouse-to-warehouse transfer. |
| `StockTransferLine` | Transfer line. |
| `StockCountSession` | Physical stock count session. |
| `StockCountLine` | Counted quantity and adjustment. |
| `StockLoss` | Damage/loss record linked to a movement line. |
| `ProductionBatch` | Production/assembly batch. |
| `ProductionInputLine` | Consumed input lot/quantity. |
| `ProductionOutputLine` | Produced output package/quantity. |
| `ProductionLossLine` | Production loss/waste. |
| `ExpiryAlert` | Expiry warning linked to a lot and notification. |

## Procurement and supplier finance

| Model | Purpose |
| --- | --- |
| `Supplier` | Supplier identity and terms. |
| `SupplierContact` | Supplier contact person. |
| `SupplierItem` | Supplier-specific item/package and cost. |
| `PurchaseOrder` | Purchase order header. |
| `PurchaseOrderLine` | Purchase order line. |
| `SupplierInvoice` | Supplier invoice header. |
| `SupplierInvoiceLine` | Supplier invoice line. |
| `PurchaseAdditionalCost` | Freight/customs/handling cost. |
| `LandedCostAllocation` | Allocation of additional cost to lines/lots. |
| `GoodsReceipt` | Goods receipt header. |
| `GoodsReceiptLine` | Received line and lot creation. |
| `SupplierInvoiceDiscrepancy` | Quantity/price mismatch resolution. |
| `SupplierReturn` | Return to supplier. |
| `SupplierReturnLine` | Supplier return line. |
| `SupplierLedgerEntry` | Append-only supplier payable/receivable entry. |
| `SupplierPayment` | Payment to supplier. |
| `SupplierPaymentAllocation` | Payment allocation to supplier invoices. |

## Sales, invoicing, payments, returns

| Model | Purpose |
| --- | --- |
| `Order` | Order header with separate order/payment statuses. |
| `OrderItem` | Order line with price/name/SKU/cost snapshots. |
| `OrderItemBundleComponent` | Bundle component snapshot in an order. |
| `OrderStatusHistory` | Append-only order status history. |
| `OrderDiscount` | Order-level or line-level discount snapshot. |
| `OrderAddressSnapshot` | Frozen delivery address at order time. |
| `Invoice` | Invoice header with seller/customer/tax snapshots. |
| `InvoiceLine` | Invoice line snapshot. |
| `Payment` | Confirmed/expected customer payment. |
| `PaymentAttempt` | Payment gateway/manual attempt. |
| `PaymentProof` | Uploaded proof of payment. |
| `Refund` | Refund header linked to order/payment. |
| `CustomerReturn` | Customer return header. |
| `CustomerReturnItem` | Returned order item and disposition. |

## Shipping and fulfillment

| Model | Purpose |
| --- | --- |
| `ShippingCarrier` | Carrier definition. |
| `ShippingTariff` | Effective-dated carrier tariff. |
| `Shipment` | Shipment header. |
| `ShipmentStatusHistory` | Shipment status history. |
| `ShipmentDeliveryAttempt` | Delivery attempt outcome. |
| `CarrierRemittance` | Carrier settlement/remittance header. |
| `CarrierRemittanceLine` | Shipment-level remittance line. |
| `OrderFulfillment` | Fulfillment plan/header. |
| `OrderFulfillmentAllocation` | Allocation of an order item to warehouse/reseller source. |
| `ResellerFulfillmentConfirmation` | Reseller confirmation/terms for partner-assisted fulfillment. |

## Promotions

| Model | Purpose |
| --- | --- |
| `Promotion` | Promotion rules and validity. |
| `PromotionTarget` | Product/package/category target. |
| `Coupon` | Coupon code and usage limits. |
| `PromotionRedemption` | Redemption record linked to order/item. |

## Finance

| Model | Purpose |
| --- | --- |
| `FinancialAccount` | Cash/bank/wallet account. |
| `FinancialAccountEntry` | Append-only account entry. |
| `FinancialTransfer` | Transfer between accounts. |
| `ExpenseCategory` | Expense classification. |
| `Expense` | Expense header. |
| `ExpensePayment` | Payment of an expense. |
| `RecurringExpense` | Recurring expense template. |
| `RecurringExpenseOccurrence` | Generated occurrence of a recurring expense. |

## Resellers

| Model | Purpose |
| --- | --- |
| `Reseller` | Authorized reseller/local shop profile and visibility. |
| `ResellerAddress` | Public/private address with GPS and validity. |
| `ResellerProduct` | Reseller product assortment. |
| `ResellerPackageAvailability` | Reported/confirmed package availability. |
| `ResellerAvailabilityHistory` | Append-only availability changes. |
| `ResellerSupply` | Supply/consignment/wholesale transaction header. |
| `ResellerSupplyLine` | Supply line with item, lot, quantity, cost. |
| `ResellerStockMovement` | Custody stock movement ledger. |
| `ResellerStockBalance` | Custody stock balance per reseller/item. |
| `ResellerAccountEntry` | Append-only reseller account entry. |
| `ResellerPayment` | Payment from/to reseller. |
| `ResellerPaymentAllocation` | Payment allocation to account entries. |
| `ResellerStockReconciliation` | Custody reconciliation header. |
| `ResellerStockReconciliationLine` | Counted vs. system quantity and adjustment. |

## Content, notifications, files

| Model | Purpose |
| --- | --- |
| `HomepageSection` | Homepage section configuration. |
| `Banner` | Banner inside a homepage section. |
| `StaticPage` | CMS static page. |
| `Faq` | FAQ entry. |
| `Article` | Blog/article content. |
| `Notification` | Notification record with idempotency key. |
| `NotificationDeliveryAttempt` | Per-channel delivery attempt. |
| `Attachment` | Generic attachment metadata. |
| `AttachmentVersion` | Versioned file metadata. |
