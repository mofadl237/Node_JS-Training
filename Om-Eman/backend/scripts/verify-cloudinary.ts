import "dotenv/config";
import { createHash } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { UploadsService } from "../src/modules/uploads/service.js";
import { ForbiddenError } from "../src/shared/errors.js";

// Verification script for the direct-upload signing setup (Cloudinary 6.2).
// Run: npx tsx scripts/verify-cloudinary.ts
// Never prints the API_SECRET. Prints pass/fail lines only.

const results: Array<{ test: string; pass: boolean; detail: string }> = [];
const record = (test: string, pass: boolean, detail = ""): void => {
  results.push({ test, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${test}${detail ? ` — ${detail}` : ""}`);
};

const mask = (signature: string): string => `${signature.slice(0, 6)}…`;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? "";
const apiKey = process.env.CLOUDINARY_API_KEY ?? "";
const apiSecret = process.env.CLOUDINARY_API_SECRET ?? "";

record(
  "config present in environment",
  Boolean(cloudName && apiKey && apiSecret),
  `cloudName=${cloudName ? "set" : "MISSING"}, apiKey=${apiKey ? "set" : "MISSING"}, apiSecret=${apiSecret ? "set" : "MISSING"}`,
);

if (cloudName && apiKey && apiSecret) {
  const ALLOWED_FORMATS = "jpg,jpeg,png,webp";
  const folders = ["om-eman/products", "om-eman/categories", "om-eman/banners", "om-eman/proofs"];
  const service = new UploadsService();

  // 1) Service-level signing for every catalog kind.
  const kinds = ["product", "category", "banner"] as const;
  const signed = new Map<string, { timestamp: number; signature: string }>();
  for (const kind of kinds) {
    const result = service.signCatalogAsset(kind);
    signed.set(result.folder, { timestamp: result.timestamp, signature: result.signature });
    record(`sign (${kind})`, result.folder.length > 0 && result.signature.length === 40, `folder=${result.folder}, signature=${mask(result.signature)}`);
  }

  // 2) Independent recomputation of the documented Cloudinary SHA-1 algorithm.
  const check = signed.get("om-eman/products");
  if (check) {
    const params = `allowed_formats=${ALLOWED_FORMATS}&folder=om-eman/products&timestamp=${check.timestamp}`;
    const expected = createHash("sha1").update(params + apiSecret).digest("hex");
    record("signature matches independent SHA-1 recomputation", expected === check.signature, `sha1=${mask(expected)}`);
  } else {
    record("signature matches independent SHA-1 recomputation", false, "product signature missing");
  }

  // 3) Real end-to-end upload into the products folder, then cleanup.
  const tinyPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
  const product = signed.get("om-eman/products");
  let publicId = "";
  if (product) {
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(tinyPng)], { type: "image/png" }), "verify.png");
    form.append("api_key", apiKey);
    form.append("timestamp", String(product.timestamp));
    form.append("signature", product.signature);
    form.append("folder", "om-eman/products");
    form.append("allowed_formats", ALLOWED_FORMATS);
    const upload = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: form });
    const body = (await upload.json()) as { public_id?: string; secure_url?: string; error?: { message: string } };
    const ok = upload.ok && Boolean(body.public_id?.startsWith("om-eman/products/"));
    publicId = body.public_id ?? "";
    record("signed upload into om-eman/products", ok, ok ? `public_id=${body.public_id}` : `status=${upload.status}, error=${body.error?.message ?? ""}`);
  } else {
    record("signed upload into om-eman/products", false, "signature missing");
  }

  // 4) Cleanup: destroy the uploaded asset with its own signed call.
  if (publicId) {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request({ public_id: publicId, timestamp }, apiSecret);
    const form = new FormData();
    form.append("public_id", publicId);
    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp));
    form.append("signature", signature);
    const destroy = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, { method: "POST", body: form });
    const body = (await destroy.json()) as { result?: string };
    record("cleanup (destroy test asset)", body.result === "ok", `result=${body.result ?? ""}`);
  }

  // 5) Tampered signature must be rejected by Cloudinary.
  if (product) {
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(tinyPng)], { type: "image/png" }), "bad.png");
    form.append("api_key", apiKey);
    form.append("timestamp", String(product.timestamp));
    form.append("signature", `0${product.signature.slice(1)}`);
    form.append("folder", "om-eman/products");
    const bad = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: form });
    const body = (await bad.json()) as { error?: { message: string } };
    record("tampered signature rejected", !bad.ok, `status=${bad.status}, error=${body.error?.message ?? ""}`);
  }

  // 6) allowed_formats enforcement: a text file must fail.
  if (product) {
    const form = new FormData();
    form.append("file", new Blob(["not an image"], { type: "text/plain" }), "verify.txt");
    form.append("api_key", apiKey);
    form.append("timestamp", String(product.timestamp));
    form.append("signature", product.signature);
    form.append("folder", "om-eman/products");
    form.append("allowed_formats", ALLOWED_FORMATS);
    const text = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: form });
    const body = (await text.json()) as { error?: { message: string } };
    record("text file rejected by allowed_formats", !text.ok, `status=${text.status}, error=${body.error?.message ?? ""}`);
  }

  // 7) Proof signing authorization: a wrong order/token pair must be denied.
  try {
    await service.signProof({ orderId: "does-not-exist", trackingToken: "a".repeat(43) });
    record("signProof denies unknown order", false, "no error thrown");
  } catch (error) {
    const denied = error instanceof ForbiddenError && error.code === "ORDER_ACCESS_DENIED";
    record("signProof denies unknown order", denied, denied ? "ForbiddenError ORDER_ACCESS_DENIED" : "wrong error");
  }
}

const failed = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - failed}/${results.length} passed${failed > 0 ? `, ${failed} FAILED` : ""}`);
process.exit(failed > 0 ? 1 : 0);
