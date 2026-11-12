import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { ECartStatus, ECustomerStatus, EOrderStatus, EPaymentStatus } from "@prisma/client";
import { prisma, isDatabaseUp } from "../helpers/db.js";
import { createGuestOrder, normalizePhone } from "../../src/services/guest-checkout.service.js";
import { refreshOrderPaymentStatus } from "../../src/services/order-payment-status.service.js";
import { markOrderDelivered } from "../../src/services/order-payment-status.service.js";
import {
  claimGuestByVerifiedPhone,
  mergeCustomersStandalone,
  mergeGuestCart,
  resolveCustomerForAuthIdentity,
} from "../../src/services/customer-claim.service.js";
import { recalculateCustomerStatsStandalone } from "../../src/services/customer-stats.service.js";
import { generateOpaqueToken } from "../../src/utils/secure-token.js";

const isDbUp = await isDatabaseUp();

// Unique-per-run identifiers keep parallel runs isolated and cleanup simple.
const runId = `${Date.now()}`.slice(-9);
const phone = `01${runId}0`;
const email = `test-${runId}@om-eman.test`;

const createdCustomerIds: string[] = [];
const createdProductIds: string[] = [];
let categorySetup = false;
let categoryId = "";

async function seedCatalog(): Promise<{ packageId: string; price: number }> {
  let category = await prisma.category.findFirst({
    where: { isActive: true },
    select: { id: true, subcategories: { take: 1, select: { id: true } } },
  });

  if (!category) {
    const created = await prisma.category.create({
      data: {
        nameAr: "اختبار",
        slug: `test-cat-${runId}`,
      },
      include: { subcategories: true },
    });
    category = { id: created.id, subcategories: created.subcategories };
    categoryId = created.id;
    categorySetup = true;
  }

  let subcategoryId = category.subcategories[0]?.id;
  if (!subcategoryId) {
    const sub = await prisma.subcategory.create({
      data: {
        categoryId: category.id,
        nameAr: "اختبار",
        slug: `test-sub-${runId}-${Date.now()}`,
      },
    });
    subcategoryId = sub.id;
  }

  const product = await prisma.product.create({
    data: {
      primarySubcategoryId: subcategoryId,
      nameAr: `منتج اختبار ${runId}`,
      slug: `test-product-${runId}-${Date.now()}`,
      status: "ACTIVE",
      packages: {
        create: {
          sku: `TST-${runId}-${Date.now()}`,
          sizeValue: 1,
          sizeUnit: "PIECE",
          sellingPrice: 100,
          isActive: true,
          isPublished: true,
        },
      },
    },
    include: { packages: true },
  });
  createdProductIds.push(product.id);

  return { packageId: product.packages[0]!.id, price: 100 };
}

describe.skipIf(!isDbUp)("guest checkout, delivery, claim and merge (integration)", () => {
  let packageId: string;
  let orderId: string;
  let trackingToken: string;

  beforeAll(async () => {
    const seeded = await seedCatalog();
    packageId = seeded.packageId;
  });

  afterAll(async () => {
    // Tests clean up after themselves: no fake data may survive, per AGENTS.md.
    const orders = createdCustomerIds.length
      ? await prisma.order.findMany({
          where: { customerId: { in: createdCustomerIds } },
          select: { id: true },
        })
      : [];
    await prisma.order.deleteMany({
      where: { id: { in: orders.map((order) => order.id) } },
    });
    await prisma.customer.deleteMany({ where: { id: { in: createdCustomerIds } } });
    await prisma.product.deleteMany({ where: { id: { in: createdProductIds } } });
    if (categorySetup) {
      await prisma.subcategory.deleteMany({ where: { categoryId: categoryId } });
      await prisma.category.deleteMany({ where: { id: categoryId } });
    }
  });

  it("creates a guest order with snapshots, address and tracking token", async () => {
    const result = await createGuestOrder({
      phone,
      recipientName: "عميل ضيف",
      address: {
        governorate: "Cairo",
        city: "Nasr City",
        street: "Street 10",
      },
      items: [{ productPackageId: packageId, quantity: 2 }],
      clientIp: "127.0.0.1",
    });

    orderId = result.orderId;
    trackingToken = result.trackingToken;

    expect(result.orderNumber).toMatch(/^ORD-\d{4}-\d{6}$/);
    expect(trackingToken.length).toBeGreaterThanOrEqual(40);

    const order = await prisma.order.findUniqueOrThrow({
      where: { id: result.orderId },
      include: { items: true, addressSnapshot: true, customer: true },
    });
    createdCustomerIds.push(order.customerId);

    expect(order.customer.isGuest).toBe(true);
    expect(order.customer.phone).toBe(normalizePhone(phone));
    expect(order.subtotal.toString()).toBe("200.0000");
    expect(order.grandTotal.toString()).toBe("200.0000");
    expect(order.items[0]!.skuSnapshot).toBeTruthy();
    expect(order.items[0]!.productNameArSnapshot).toContain("اختبار");
    expect(order.addressSnapshot!.recipientName).toBe("عميل ضيف");
  });

  it("reuses the same guest customer for a second order on the same phone", async () => {
    const first = await prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      select: { customerId: true },
    });

    const result = await createGuestOrder({
      phone,
      recipientName: "عميل ضيف",
      address: { governorate: "Cairo", city: "Nasr City", street: "Street 10" },
      items: [{ productPackageId: packageId, quantity: 1 }],
    });
    createdCustomerIds.push(
      (
        await prisma.order.findUniqueOrThrow({
          where: { id: result.orderId },
          select: { customerId: true },
        })
      ).customerId,
    );

    const second = await prisma.order.findUniqueOrThrow({
      where: { id: result.orderId },
      select: { customerId: true },
    });
    expect(second.customerId).toBe(first.customerId);
  });

  it("derives paymentStatus from Payment rows", async () => {
    const payment = await prisma.payment.create({
      data: {
        orderId,
        method: "ONLINE_TRANSFER",
        status: EPaymentStatus.PROOF_UPLOADED,
        amount: 200,
        proofImageUrl: "/proofs/test.jpg",
      },
    });

    expect(await refreshOrderPaymentStatus(orderId)).toBe(
      EPaymentStatus.PROOF_UPLOADED,
    );

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: EPaymentStatus.CONFIRMED, confirmedAt: new Date() },
    });
    expect(await refreshOrderPaymentStatus(orderId)).toBe(
      EPaymentStatus.CONFIRMED,
    );
  });

  it("markOrderDelivered updates cached customer stats in the same transaction", async () => {
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      select: { customerId: true },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { status: EOrderStatus.SHIPPED, shippedAt: new Date() },
    });

    await markOrderDelivered({ orderId });

    const [customer, refreshed] = await Promise.all([
      prisma.customer.findUniqueOrThrow({
        where: { id: order.customerId },
        select: {
          completedOrdersCount: true,
          totalSpent: true,
          firstOrderAt: true,
          lastOrderAt: true,
        },
      }),
      prisma.order.findUniqueOrThrow({
        where: { id: orderId },
        select: { status: true },
      }),
    ]);

    expect(refreshed.status).toBe(EOrderStatus.DELIVERED);
    expect(customer.completedOrdersCount).toBe(1);
    expect(customer.totalSpent.toString()).toBe("200.0000");
    expect(customer.firstOrderAt).not.toBeNull();
    expect(customer.lastOrderAt).not.toBeNull();
  });

  it("recalculateCustomerStats fixes drift after manual edits", async () => {
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      select: { customerId: true },
    });

    // Simulate drift, then heal it.
    await prisma.customer.update({
      where: { id: order.customerId },
      data: { totalSpent: 999 },
    });
    await recalculateCustomerStatsStandalone(order.customerId);

    const customer = await prisma.customer.findUniqueOrThrow({
      where: { id: order.customerId },
      select: { totalSpent: true, completedOrdersCount: true },
    });
    expect(customer.totalSpent.toString()).toBe("200.0000");
    expect(customer.completedOrdersCount).toBe(1);
  });

  it("claims a verified guest by email and keeps the old orders", async () => {
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      select: { customerId: true },
    });

    await prisma.customer.update({
      where: { id: order.customerId },
      data: { email, emailVerifiedAt: new Date() },
    });

    const result = await resolveCustomerForAuthIdentity({
      provider: "GOOGLE",
      providerAccountId: `google-sub-${runId}`,
      email,
    });

    expect(result.claimed).toBe(true);
    expect(result.customerId).toBe(order.customerId);
    createdCustomerIds.push(result.customerId);

    const claimed = await prisma.customer.findUniqueOrThrow({
      where: { id: result.customerId },
      select: { isGuest: true, claimedAt: true },
    });
    expect(claimed.isGuest).toBe(false);
    expect(claimed.claimedAt).not.toBeNull();

    const orders = await prisma.order.count({
      where: { customerId: result.customerId },
    });
    expect(orders).toBeGreaterThanOrEqual(2);
  });

  it("rejects phone-based claim without phoneVerifiedAt", async () => {
    const guest = await prisma.customer.create({
      data: { phone: `019${runId}`, isGuest: true },
    });
    const registered = await prisma.customer.create({
      data: { phone: `019${runId}`, isGuest: false, email: `r-${runId}@om-eman.test` },
    });
    createdCustomerIds.push(guest.id, registered.id);

    await expect(claimGuestByVerifiedPhone(registered.id)).rejects.toThrow(
      /phoneVerifiedAt/i,
    );
  });

  it("merges a duplicate account: orders, addresses, carts, wishlist move; source is MERGED", async () => {
    const target = await prisma.customer.findFirstOrThrow({
      where: { email },
      select: { id: true },
    });

    const source = await prisma.customer.create({
      data: {
        phone: `018${runId}`,
        isGuest: true,
        addresses: {
          create: {
            governorate: "Giza",
            city: "Dokki",
            street: "Tahrir",
            isDefault: true,
          },
        },
        carts: {
          create: {
            status: ECartStatus.ACTIVE,
            items: { create: { productPackageId: packageId, quantity: 3 } },
          },
        },
        wishlistItems: { create: { productPackageId: packageId } },
      },
      include: { carts: true },
    });
    createdCustomerIds.push(source.id);

    await mergeCustomersStandalone(source.id, target.id);

    const mergedSource = await prisma.customer.findUniqueOrThrow({
      where: { id: source.id },
      select: { status: true, mergedIntoCustomerId: true },
    });
    expect(mergedSource.status).toBe(ECustomerStatus.MERGED);
    expect(mergedSource.mergedIntoCustomerId).toBe(target.id);

    const movedOrders = await prisma.order.count({ where: { customerId: target.id } });
    expect(movedOrders).toBeGreaterThanOrEqual(2);

    const movedAddresses = await prisma.customerAddress.findMany({
      where: { customerId: target.id },
    });
    expect(movedAddresses.length).toBe(1);
    // Source defaults were cleared so the partial unique index stays satisfied.
    expect(movedAddresses[0]!.isDefault).toBe(false);

    const mergedCarts = await prisma.cart.findFirst({
      where: { id: source.carts[0]!.id },
      select: { status: true, mergedIntoCartId: true },
    });
    expect(mergedCarts!.status).toBe(ECartStatus.MERGED);

    const wishlist = await prisma.wishlistItem.findFirst({
      where: { customerId: target.id, productPackageId: packageId },
    });
    expect(wishlist).not.toBeNull();

    const targetStats = await prisma.customer.findUniqueOrThrow({
      where: { id: target.id },
      select: { completedOrdersCount: true },
    });
    expect(targetStats.completedOrdersCount).toBeGreaterThanOrEqual(2);
  });

  it("merges an ACTIVE guest cart into the customer ACTIVE cart by token", async () => {
    const customer = await prisma.customer.findFirstOrThrow({
      where: { email },
      select: { id: true },
    });

    const guestToken = generateOpaqueToken();
    const guestCart = await prisma.cart.create({
      data: {
        guestToken,
        status: ECartStatus.ACTIVE,
        items: { create: { productPackageId: packageId, quantity: 1 } },
      },
    });

    const result = await mergeGuestCart(customer.id, guestToken);
    expect(result.mergedCartId).not.toBeNull();

    const survivor = await prisma.cart.findUniqueOrThrow({
      where: { id: result.mergedCartId! },
      include: { items: true },
    });
    const totalQuantity = survivor.items
      .filter((item) => item.productPackageId === packageId)
      .reduce((sum, item) => sum + Number(item.quantity), 0);
    expect(totalQuantity).toBeGreaterThanOrEqual(1);

    const closed = await prisma.cart.findUniqueOrThrow({
      where: { id: guestCart.id },
      select: { status: true, mergedIntoCartId: true },
    });
    expect(closed.status).toBe(ECartStatus.MERGED);
    expect(closed.mergedIntoCartId).toBe(result.mergedCartId);
  });
});
