import type { NextFunction, Request, Response } from "express";
import { ECustomerStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { UnauthorizedError } from "../shared/errors.js";
import { hashToken } from "../utils/secure-token.js";

// Customer requests authenticate with the opaque session token returned by
// /store/auth (never a JWT): the raw token stays with the client, only its
// SHA-256 hash lives in the Session table.
export interface ICustomerAuthRequest extends Request {
  customer?: {
    id: string;
    email: string | null;
    phone: string | null;
    sessionId: string;
  };
}

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  return token || null;
}

async function resolveCustomerFromToken(token: string) {
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      id: true,
      customerId: true,
      expiresAt: true,
      revokedAt: true,
      customer: {
        select: {
          id: true,
          email: true,
          phone: true,
          status: true,
        },
      },
    },
  });

  if (
    !session ||
    session.customerId === null ||
    session.customer === null
  ) {
    return null;
  }
  if (session.revokedAt || session.expiresAt <= new Date()) return null;
  if (session.customer.status !== ECustomerStatus.ACTIVE) return null;

  return {
    id: session.customer.id,
    email: session.customer.email,
    phone: session.customer.phone,
    sessionId: session.id,
  };
}

export async function authenticateCustomer(
  req: ICustomerAuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token = extractBearerToken(req);
  if (!token) {
    throw new UnauthorizedError(
      "Authorization token is required",
      "TOKEN_MISSING",
    );
  }

  const customer = await resolveCustomerFromToken(token);
  if (!customer) {
    throw new UnauthorizedError(
      "Session is invalid, expired, or revoked",
      "SESSION_INVALID",
    );
  }

  req.customer = customer;
  next();
}

// For endpoints that work for both guests and logged-in customers (search logs,
// payment proof). Attaches the customer when a valid token is present and
// never fails the request.
export async function optionalCustomer(
  req: ICustomerAuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token = extractBearerToken(req);
  if (token) {
    const customer = await resolveCustomerFromToken(token);
    if (customer) {
      req.customer = customer;
    }
  }
  next();
}
