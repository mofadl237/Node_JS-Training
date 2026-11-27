import { EAuthProvider, ECustomerStatus, EVerificationPurpose } from "@prisma/client";
import { prisma } from "../../../config/prisma.js";
import { env } from "../../../config/env.js";
import { sendEmail } from "../../../config/email.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../../shared/errors.js";
import { comparePassword, hashPassword } from "../../../utils/password.js";
import { generateOpaqueToken, hashToken } from "../../../utils/secure-token.js";
import { normalizePhone } from "../../../utils/phone.js";
import { resolveCustomerForAuthIdentity } from "../../../services/customer-claim.service.js";
import {
  buildResetEmail,
  buildResetLink,
  buildVerificationEmail,
  buildVerifyLink,
} from "./auth-email.js";
import {
  DEFAULT_AUTH_LOCALE,
  type IMessageResponse,
  type IStoreCustomer,
  type TAuthLocale,
} from "./types.js";

const RESEND_COOLDOWN_MS = 60 * 1000;

const SELECT_CUSTOMER = {
  id: true,
  email: true,
  phone: true,
  firstName: true,
  lastName: true,
  isGuest: true,
  emailVerifiedAt: true,
  status: true,
} as const;

function expiryDate(): Date {
  return new Date(
    Date.now() + env.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  );
}

// The raw token is returned once to the client; only its hash is stored.
async function createCustomerSession(customerId: string): Promise<string> {
  const token = generateOpaqueToken();
  await prisma.session.create({
    data: {
      tokenHash: hashToken(token),
      customerId,
      expiresAt: expiryDate(),
    },
  });
  return token;
}

function toStoreCustomer(row: {
  id: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  isGuest: boolean;
  emailVerifiedAt: Date | null;
  status: ECustomerStatus;
}): IStoreCustomer {
  return row;
}

async function issueEmailVerification(
  customerId: string,
  email: string,
  locale: TAuthLocale,
  name?: string | null,
): Promise<string | null> {
  const token = generateOpaqueToken();
  await prisma.authVerificationToken.create({
    data: {
      purpose: EVerificationPurpose.EMAIL_VERIFY,
      tokenHash: hashToken(token),
      customerId,
      expiresAt: new Date(
        Date.now() + env.EMAIL_VERIFY_TOKEN_TTL_HOURS * 60 * 60 * 1000,
      ),
    },
  });
  const link = buildVerifyLink(locale, token);
  const sent = await sendEmail(
    buildVerificationEmail({ to: email, link, locale, name: name ?? undefined }),
  );
  return sent ? null : link;
}

export class StoreAuthService {
  async register(dto: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    locale?: TAuthLocale | undefined;
  }): Promise<IMessageResponse> {
    const existing = await prisma.customer.findFirst({
      where: { email: dto.email },
      select: {
        id: true,
        isGuest: true,
        passwordHash: true,
        emailVerifiedAt: true,
      },
    });

    if (existing && !existing.isGuest && existing.passwordHash) {
      // Registered but never verified: send the verification link again
      // instead of failing, so the customer is never stuck. The stored
      // password is NOT replaced: anyone could register someone else's email
      // and would otherwise take over the account once the owner verifies it.
      if (existing.emailVerifiedAt === null) {
        return this.resendVerification(dto.email, dto.locale);
      }
      throw new ConflictError(
        "This email is already registered",
        "EMAIL_ALREADY_REGISTERED",
      );
    }

    const passwordHash = await hashPassword(dto.password);
    const phone = dto.phone ? normalizePhone(dto.phone) : null;

    // Claim path: a guest with the same email gets the password attached.
    // The account stays unusable until the email is verified, so an attacker
    // registering with someone else's email gains nothing.
    let customerId: string;
    if (existing?.isGuest) {
      await prisma.customer.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          firstName: dto.firstName ?? null,
          lastName: dto.lastName ?? null,
          ...(phone !== null ? { phone } : {}),
        },
      });
      customerId = existing.id;
    } else {
      const created = await prisma.customer.create({
        data: {
          email: dto.email,
          passwordHash,
          firstName: dto.firstName ?? null,
          lastName: dto.lastName ?? null,
          phone,
          isGuest: false,
        },
      });
      customerId = created.id;
    }

    const devLink = await issueEmailVerification(
      customerId,
      dto.email,
      dto.locale ?? DEFAULT_AUTH_LOCALE,
      dto.firstName,
    );

    // Email delivery failed or is disabled: surface the link in development
    // only so the flow can still be completed locally.
    return devLink && env.NODE_ENV !== "production"
      ? { devVerificationLink: devLink }
      : {};
  }

  // Always answers generically (no account enumeration). Throttled per
  // customer so the endpoint cannot be used to flood someone's inbox.
  async resendVerification(
    email: string,
    locale: TAuthLocale = DEFAULT_AUTH_LOCALE,
  ): Promise<IMessageResponse> {
    const customer = await prisma.customer.findFirst({
      where: {
        email,
        isGuest: false,
        emailVerifiedAt: null,
        passwordHash: { not: null },
        status: ECustomerStatus.ACTIVE,
      },
      select: { id: true, firstName: true },
    });
    if (!customer) return {};

    const latest = await prisma.authVerificationToken.findFirst({
      where: { customerId: customer.id, purpose: EVerificationPurpose.EMAIL_VERIFY },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });
    if (latest && Date.now() - latest.createdAt.getTime() < RESEND_COOLDOWN_MS) {
      return {};
    }

    await prisma.authVerificationToken.updateMany({
      where: {
        customerId: customer.id,
        purpose: EVerificationPurpose.EMAIL_VERIFY,
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });

    const devLink = await issueEmailVerification(
      customer.id,
      email,
      locale,
      customer.firstName,
    );
    return devLink && env.NODE_ENV !== "production"
      ? { devVerificationLink: devLink }
      : {};
  }

  async verifyEmail(token: string): Promise<void> {
    const record = await prisma.authVerificationToken.findUnique({
      where: { tokenHash: hashToken(token) },
      select: {
        id: true,
        usedAt: true,
        expiresAt: true,
        customerId: true,
        purpose: true,
      },
    });

    if (!record || record.purpose !== EVerificationPurpose.EMAIL_VERIFY) {
      throw new BadRequestError("Invalid verification token", "TOKEN_INVALID");
    }
    if (record.usedAt) {
      throw new BadRequestError(
        "Verification token was already used",
        "TOKEN_ALREADY_USED",
      );
    }
    if (record.expiresAt <= new Date()) {
      throw new BadRequestError(
        "Verification token expired",
        "TOKEN_EXPIRED",
      );
    }

    await prisma.$transaction([
      prisma.authVerificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      prisma.customer.update({
        where: { id: record.customerId },
        data: {
          emailVerifiedAt: new Date(),
          isGuest: false,
          claimedAt: new Date(),
        },
      }),
    ]);
  }

  async login(dto: {
    email: string;
    password: string;
  }): Promise<{ customer: IStoreCustomer; token: string }> {
    const customer = await prisma.customer.findFirst({
      where: { email: dto.email, passwordHash: { not: null } },
      select: { ...SELECT_CUSTOMER, passwordHash: true },
    });

    if (!customer || !customer.passwordHash) {
      throw new UnauthorizedError(
        "Invalid email or password",
        "INVALID_CREDENTIALS",
      );
    }
    if (customer.emailVerifiedAt === null) {
      throw new UnauthorizedError(
        "Email is not verified yet",
        "EMAIL_NOT_VERIFIED",
      );
    }
    if (customer.status !== ECustomerStatus.ACTIVE) {
      throw new UnauthorizedError(
        "Customer account is not active",
        "CUSTOMER_UNAVAILABLE",
      );
    }

    const passwordValid = await comparePassword(dto.password, customer.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedError(
        "Invalid email or password",
        "INVALID_CREDENTIALS",
      );
    }

    const token = await createCustomerSession(customer.id);
    const { passwordHash: _ignored, ...safe } = customer;

    return { customer: toStoreCustomer(safe), token };
  }

  // Verifies the Google ID token against Google's public tokeninfo endpoint,
  // validates the audience, then claims/creates the customer. No Google
  // library needed: one HTTPS call and strict audience checking.
  async googleLogin(credential: string): Promise<{
    customer: IStoreCustomer;
    token: string;
  }> {
    if (!env.GOOGLE_CLIENT_ID) {
      throw new BadRequestError(
        "Google sign-in is not configured",
        "GOOGLE_NOT_CONFIGURED",
      );
    }

    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
    );
    if (!response.ok) {
      throw new UnauthorizedError("Invalid Google credential", "GOOGLE_INVALID");
    }

    const payload = (await response.json()) as {
      aud?: string;
      sub?: string;
      email?: string;
      email_verified?: boolean | string;
      exp?: string;
    };

    if (
      !payload.sub ||
      !payload.email ||
      payload.aud !== env.GOOGLE_CLIENT_ID ||
      payload.email_verified !== true
    ) {
      throw new UnauthorizedError("Invalid Google credential", "GOOGLE_INVALID");
    }
    if (payload.exp && Number(payload.exp) * 1000 < Date.now()) {
      throw new UnauthorizedError("Google credential expired", "GOOGLE_EXPIRED");
    }

    const result = await resolveCustomerForAuthIdentity({
      provider: EAuthProvider.GOOGLE,
      providerAccountId: payload.sub,
      email: payload.email,
    });

    const customer = await prisma.customer.findUniqueOrThrow({
      where: { id: result.customerId },
      select: SELECT_CUSTOMER,
    });

    const token = await createCustomerSession(customer.id);
    return { customer: toStoreCustomer(customer), token };
  }

  // Always answers generically: the response must not reveal whether the email
  // exists (account enumeration protection).
  async forgotPassword(
    email: string,
    locale: TAuthLocale = DEFAULT_AUTH_LOCALE,
  ): Promise<void> {
    const customer = await prisma.customer.findFirst({
      where: {
        email,
        isGuest: false,
        emailVerifiedAt: { not: null },
        passwordHash: { not: null },
        status: ECustomerStatus.ACTIVE,
      },
      select: { id: true },
    });

    if (!customer) return;

    const token = generateOpaqueToken();
    await prisma.authVerificationToken.create({
      data: {
        purpose: EVerificationPurpose.PASSWORD_RESET,
        tokenHash: hashToken(token),
        customerId: customer.id,
        expiresAt: new Date(
          Date.now() + env.PASSWORD_RESET_TOKEN_TTL_MINUTES * 60 * 1000,
        ),
      },
    });

    await sendEmail(
      buildResetEmail({ to: email, link: buildResetLink(locale, token), locale }),
    );
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const record = await prisma.authVerificationToken.findUnique({
      where: { tokenHash: hashToken(token) },
      select: {
        id: true,
        usedAt: true,
        expiresAt: true,
        customerId: true,
        purpose: true,
      },
    });

    if (!record || record.purpose !== EVerificationPurpose.PASSWORD_RESET) {
      throw new BadRequestError("Invalid reset token", "TOKEN_INVALID");
    }
    if (record.usedAt) {
      throw new BadRequestError(
        "Reset token was already used",
        "TOKEN_ALREADY_USED",
      );
    }
    if (record.expiresAt <= new Date()) {
      throw new BadRequestError("Reset token expired", "TOKEN_EXPIRED");
    }

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.authVerificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      prisma.customer.update({
        where: { id: record.customerId },
        data: { passwordHash },
      }),
      // Any stolen session dies the moment the password changes.
      prisma.session.updateMany({
        where: { customerId: record.customerId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
  }

  async logout(sessionId: string): Promise<void> {
    await prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  async me(customerId: string): Promise<IStoreCustomer> {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: SELECT_CUSTOMER,
    });
    if (!customer) {
      throw new NotFoundError("Customer not found", "CUSTOMER_NOT_FOUND");
    }
    return toStoreCustomer(customer);
  }
}
