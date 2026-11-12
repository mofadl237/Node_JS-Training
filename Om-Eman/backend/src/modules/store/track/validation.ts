import { z } from "zod";

// Tracking tokens are base64url of 32 random bytes (43 chars). Keep the
// validation strict so garbage never reaches the database.
export const trackingTokenParamSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{43,64}$/, "tracking token is invalid");
