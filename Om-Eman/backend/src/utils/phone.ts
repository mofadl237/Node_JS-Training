import { BadRequestError } from "../shared/errors.js";

// Phone is normalized before every lookup/store so "010 1234 5678" and
// "+201012345678" map to the same customer. Keep this in one place.
export function normalizePhone(phone: string): string {
  const normalized = phone.replace(/[\s()-]/g, "").trim();
  if (!/^\+?\d{8,15}$/.test(normalized)) {
    throw new BadRequestError(
      "Invalid phone number format",
      "INVALID_PHONE_FORMAT",
    );
  }
  return normalized;
}
