import {
  ECartStatus,
  ECustomerStatus,
  EAuthProvider,
} from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { BadRequestError, ConflictError, NotFoundError } from "../shared/errors.js";
import type { ITransactionClient } from "./document-number.service.js";
import { recalculateCustomerStats } from "./customer-stats.service.js";
import { normalizePhone } from "./guest-checkout.service.js";

// ---------------------------------------------------------------------------
// Claim & merge security model
// ---------------------------------------------------------------------------

// CLAIM is allowed ONLY on an identity the user just proved:
//   - a Google account (the email is verified by Google), or
//   - an email/password registration AFTER the verification link is clicked
//     (emailVerifiedAt set).
// A phone number typed in a form is NOT proof of ownership: anyone can type any
// Egyptian phone number. Claiming on unverified phones would let an attacker
// register with a victim's number and silently receive the victim's order
// history, full name, and addresses. Phone-based claim therefore requires
// phoneVerifiedAt (an OTP flow that the MVP does not implement yet); the guard
// below throws until that exists, so nobody can "just enable it" by accident.

export interface IAuthProviderIdentity {
  provider: EAuthProvider;
  providerAccountId: string;
  email: string;
}

export interface IClaimResult {
  customerId: string;
  claimed: boolean;
  merged: boolean;
}

// Finds the customer for an authenticated external identity and claims or
// merges a guest record when safe. Runs in one transaction.
//
// Decision table:
//   1. AuthAccount(provider, providerAccountId) exists -> log that customer in.
//   2. Registered (non-guest) customer with the same email -> attach the
//      AuthAccount to it.
//   3. Guest customer with the same email AND emailVerifiedAt set -> claim:
//      attach the AuthAccount, flip isGuest off. Orders stay attached for free.
//   4. Otherwise -> create a fresh registered customer.
// A guest's phone is NEVER copied as a verified phone; phoneVerifiedAt stays
// null until an OTP flow exists.
export async function resolveCustomerForAuthIdentity(
  identity: IAuthProviderIdentity,
): Promise<IClaimResult> {
  const email = identity.email.toLowerCase().trim();

  return prisma.$transaction(async (tx) => {
    const existingAccount = await tx.authAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: identity.provider,
          providerAccountId: identity.providerAccountId,
        },
      },
      select: { customerId: true },
    });

    if (existingAccount) {
      await tx.customer.update({
        where: { id: existingAccount.customerId },
        data: { lastLoginAt: new Date() },
      });
      return { customerId: existingAccount.customerId, claimed: false, merged: false };
    }

    const registered = await tx.customer.findFirst({
      where: { email, isGuest: false, status: ECustomerStatus.ACTIVE },
      select: { id: true },
    });

    if (registered) {
      await tx.authAccount.create({
        data: {
          customerId: registered.id,
          provider: identity.provider,
          providerAccountId: identity.providerAccountId,
          email,
        },
      });
      await tx.customer.update({
        where: { id: registered.id },
        data: { lastLoginAt: new Date() },
      });
      return { customerId: registered.id, claimed: false, merged: false };
    }

    // Claim path: only a guest whose email was verified can be claimed. For
    // PASSWORD registrations this function must be called after the
    // verification token has been consumed, never before.
    const guest = await tx.customer.findFirst({
      where: {
        email,
        isGuest: true,
        status: ECustomerStatus.ACTIVE,
        emailVerifiedAt: { not: null },
      },
      select: { id: true },
    });

    if (guest) {
      await tx.authAccount.create({
        data: {
          customerId: guest.id,
          provider: identity.provider,
          providerAccountId: identity.providerAccountId,
          email,
        },
      });
      await tx.customer.update({
        where: { id: guest.id },
        data: {
          isGuest: false,
          claimedAt: new Date(),
          lastLoginAt: new Date(),
        },
      });
      return { customerId: guest.id, claimed: true, merged: false };
    }

    const created = await tx.customer.create({
      data: {
        email,
        isGuest: false,
        emailVerifiedAt: identity.provider === EAuthProvider.GOOGLE ? new Date() : null,
        claimedAt: new Date(),
        lastLoginAt: new Date(),
        authAccounts: {
          create: {
            provider: identity.provider,
            providerAccountId: identity.providerAccountId,
            email,
          },
        },
      },
    });

    return { customerId: created.id, claimed: false, merged: false };
  });
}

// Phone-based claim. Blocked until an OTP flow sets phoneVerifiedAt, because an
// unverified phone proves nothing about ownership (see the security note above).
export async function claimGuestByVerifiedPhone(
  customerId: string,
): Promise<IClaimResult> {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { id: true, phone: true, phoneVerifiedAt: true, isGuest: true },
  });

  if (!customer) {
    throw new NotFoundError("Customer not found", "CUSTOMER_NOT_FOUND");
  }
  if (!customer.isGuest && customer.phoneVerifiedAt) {
    // Registered and verified: nothing to claim here, caller should merge.
    throw new ConflictError(
      "Customer already registered",
      "CUSTOMER_ALREADY_REGISTERED",
    );
  }
  if (!customer.phoneVerifiedAt) {
    throw new ConflictError(
      "Phone claim requires phoneVerifiedAt (OTP). No OTP flow exists in the MVP.",
      "PHONE_NOT_VERIFIED",
    );
  }

  const guest = await prisma.customer.findFirst({
    where: {
      phone: customer.phone,
      isGuest: true,
      status: ECustomerStatus.ACTIVE,
      id: { not: customer.id },
    },
    select: { id: true },
  });

  if (!guest) {
    return { customerId: customer.id, claimed: false, merged: false };
  }

  return prisma.$transaction(async (tx) => {
    await mergeCustomers(tx, guest.id, customer.id);
    return { customerId: customer.id, claimed: false, merged: true };
  });
}

// ---------------------------------------------------------------------------
// Merge two accounts into one
// ---------------------------------------------------------------------------

// Moves everything with business meaning from `source` into `target`, marks
// source MERGED (never deleted - PromotionRedemption and AuditLog reference it
// with Restrict and history must stay intact), and recalculates target stats.
// Append-only rows (redemptions, search logs, marketing events, status
// histories) are intentionally left pointing at the source: rewriting history
// would falsify promotion usage and audit trails.
export async function mergeCustomers(
  tx: ITransactionClient,
  sourceId: string,
  targetId: string,
): Promise<void> {
  if (sourceId === targetId) {
    throw new BadRequestError(
      "Cannot merge a customer into itself",
      "MERGE_SAME_CUSTOMER",
    );
  }

  const [source, target] = await Promise.all([
    tx.customer.findUnique({ where: { id: sourceId } }),
    tx.customer.findUnique({ where: { id: targetId } }),
  ]);

  if (!source || !target) {
    throw new NotFoundError("Customer not found", "CUSTOMER_NOT_FOUND");
  }
  if (source.status === ECustomerStatus.MERGED || source.mergedIntoCustomerId) {
    throw new ConflictError(
      "Source customer was already merged",
      "CUSTOMER_ALREADY_MERGED",
    );
  }

  // 1. Orders: the business payload.
  await tx.order.updateMany({
    where: { customerId: sourceId },
    data: { customerId: targetId },
  });

  // 2. Addresses: clear the source defaults first so the partial unique index
  //    on (customerId) WHERE isDefault AND isActive cannot reject the move.
  await tx.customerAddress.updateMany({
    where: { customerId: sourceId, isDefault: true },
    data: { isDefault: false },
  });
  await tx.customerAddress.updateMany({
    where: { customerId: sourceId },
    data: { customerId: targetId },
  });

  // 3. Carts: merge source ACTIVE carts into the target ACTIVE cart (or
  //    promote one source cart to be the target cart).
  await mergeCartsInTransaction(tx, sourceId, targetId);

  // 4. Wishlist: skip duplicates.
  const targetWishlist = await tx.wishlistItem.findMany({
    where: { customerId: targetId },
    select: { productPackageId: true },
  });
  const targetPackageIds = new Set(targetWishlist.map((item) => item.productPackageId));
  const sourceWishlist = await tx.wishlistItem.findMany({
    where: { customerId: sourceId },
  });
  const toInsert = sourceWishlist.filter(
    (item) => !targetPackageIds.has(item.productPackageId),
  );
  if (toInsert.length) {
    await tx.wishlistItem.createMany({
      data: toInsert.map((item) => ({
        customerId: targetId,
        productPackageId: item.productPackageId,
      })),
    });
  }

  // 5. AuthAccounts: move; drop duplicates the target already has.
  const sourceAccounts = await tx.authAccount.findMany({
    where: { customerId: sourceId },
  });
  for (const account of sourceAccounts) {
    const duplicate = await tx.authAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        },
      },
      select: { customerId: true },
    });
    if (duplicate) continue;
    await tx.authAccount.update({
      where: { id: account.id },
      data: { customerId: targetId },
    });
  }

  // 6. Coupons assigned to the source.
  await tx.coupon.updateMany({
    where: { customerId: sourceId },
    data: { customerId: targetId },
  });

  // 7. Kill the source's live sessions and verification tokens.
  await tx.session.deleteMany({ where: { customerId: sourceId } });
  await tx.authVerificationToken.deleteMany({ where: { customerId: sourceId } });

  // 8. Close the source record.
  await tx.customer.update({
    where: { id: sourceId },
    data: {
      status: ECustomerStatus.MERGED,
      mergedIntoCustomerId: targetId,
      isGuest: false,
      claimedAt: source.claimedAt ?? new Date(),
    },
  });

  // 9. Cached stats on target must be recalculated after the order move.
  await recalculateCustomerStats(targetId, tx);

  // 10. Audit trail for the sensitive operation, in the same transaction.
  await tx.auditLog.create({
    data: {
      actorCustomerId: targetId,
      action: "CUSTOMER_MERGE",
      module: "customer",
      entityType: "Customer",
      entityId: sourceId,
      result: "SUCCESS",
      newValues: { mergedIntoCustomerId: targetId },
    },
  });
}

export async function mergeCustomersStandalone(
  sourceId: string,
  targetId: string,
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await mergeCustomers(tx, sourceId, targetId);
  });
}

// ---------------------------------------------------------------------------
// Guest cart merge after login
// ---------------------------------------------------------------------------

// Merges the ACTIVE guest cart identified by guestToken into the customer's
// ACTIVE cart (creating it if needed). Duplicate lines are summed. The guest
// cart ends as MERGED with mergedIntoCartId pointing at the survivor, exactly
// what ECartStatus.MERGED exists for.
export async function mergeGuestCart(
  customerId: string,
  guestToken: string,
): Promise<{ mergedCartId: string | null }> {
  return prisma.$transaction(async (tx) => {
    const guestCart = await tx.cart.findUnique({
      where: { guestToken },
      select: {
        id: true,
        status: true,
        items: { select: { productPackageId: true, quantity: true } },
      },
    });

    if (!guestCart) {
      throw new NotFoundError("Guest cart not found", "CART_NOT_FOUND");
    }
    if (guestCart.status !== ECartStatus.ACTIVE) {
      // Already checked out or merged: nothing to do, this is not an error.
      return { mergedCartId: null };
    }

    let targetCart = await tx.cart.findFirst({
      where: { customerId, status: ECartStatus.ACTIVE },
      select: { id: true },
    });

    if (!targetCart) {
      targetCart = await tx.cart.create({
        data: { customerId, status: ECartStatus.ACTIVE },
        select: { id: true },
      });
    }

    if (guestCart.id === targetCart.id) {
      return { mergedCartId: targetCart.id };
    }

    for (const item of guestCart.items) {
      const existing = await tx.cartItem.findUnique({
        where: {
          cartId_productPackageId: {
            cartId: targetCart.id,
            productPackageId: item.productPackageId,
          },
        },
      });
      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity.add(item.quantity) },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: targetCart.id,
            productPackageId: item.productPackageId,
            quantity: item.quantity,
          },
        });
      }
    }

    await tx.cart.update({
      where: { id: guestCart.id },
      data: {
        status: ECartStatus.MERGED,
        mergedIntoCartId: targetCart.id,
      },
    });

    return { mergedCartId: targetCart.id };
  });
}

// Shared helper used by mergeCustomers (inside an existing transaction).
async function mergeCartsInTransaction(
  tx: ITransactionClient,
  sourceId: string,
  targetId: string,
): Promise<void> {
  const targetCart = await tx.cart.findFirst({
    where: { customerId: targetId, status: ECartStatus.ACTIVE },
    select: { id: true },
  });

  const sourceCarts = await tx.cart.findMany({
    where: { customerId: sourceId, status: ECartStatus.ACTIVE },
    select: { id: true, items: { select: { productPackageId: true, quantity: true } } },
  });

  if (!sourceCarts.length) return;

  const survivorId = targetCart
    ? targetCart.id
    : sourceCarts[0]!.id;

  if (!targetCart && sourceCarts[0]) {
    await tx.cart.update({
      where: { id: sourceCarts[0].id },
      data: { customerId: targetId },
    });
  }

  for (const sourceCart of sourceCarts) {
    if (sourceCart.id === survivorId) continue;

    for (const item of sourceCart.items) {
      const existing = await tx.cartItem.findUnique({
        where: {
          cartId_productPackageId: {
            cartId: survivorId,
            productPackageId: item.productPackageId,
          },
        },
      });
      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity.add(item.quantity) },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: survivorId,
            productPackageId: item.productPackageId,
            quantity: item.quantity,
          },
        });
      }
    }

    await tx.cart.update({
      where: { id: sourceCart.id },
      data: { status: ECartStatus.MERGED, mergedIntoCartId: survivorId },
    });
  }
}

// Convenience for normalizing a registration phone input before storing it.
export { normalizePhone };
