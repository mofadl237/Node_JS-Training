type TOpenApiSchema = Record<string, unknown>;

const ref = (name: string): TOpenApiSchema => ({ $ref: `#/components/schemas/${name}` });
const responseRef = (name: string): TOpenApiSchema => ({
  $ref: `#/components/responses/${name}`,
});

// Generic success/data envelope used by every store endpoint.
const ok = (summary: string, data: TOpenApiSchema): TOpenApiSchema => ({
  description: summary,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
          data,
        },
      },
    },
  },
});

const bearerSecurity = [{ bearerCustomerAuth: [] }];
const employeeSecurity = [{ bearerAuth: [] }];

function path(
  tag: string,
  summary: string,
  operationId: string,
  data: TOpenApiSchema,
  options: {
    method?: "get" | "post" | "put" | "patch" | "delete";
    authenticated?: boolean;
    security?: TOpenApiSchema[];
    body?: TOpenApiSchema;
    query?: TOpenApiSchema;
    errors?: string[];
  } = {},
): Record<string, TOpenApiSchema> {
  // Default: a body means POST, otherwise GET. Override with method when the
  // live route does not follow that pattern (e.g. logout is POST without a body).
  const method = options.method ?? (options.body ? "post" : "get");
  const responses: Record<string, TOpenApiSchema> = {
    "200": ok(`${summary} successful.`, data),
    ...Object.fromEntries(
      (options.errors ?? []).map((code) => [code, responseRef(code)]),
    ),
    "500": responseRef("InternalError"),
  };
  if (options.body) responses["400"] = responseRef("ValidationError");
  const op: TOpenApiSchema = {
    tags: [tag],
    summary,
    operationId,
    security: options.security ?? (options.authenticated ? bearerSecurity : []),
    responses,
  };
  if (options.body) {
    op.requestBody = {
      required: true,
      content: { "application/json": { schema: options.body } },
    };
  }
  if (options.query) {
    op.parameters = Object.entries(options.query.properties ?? {}).map(
      ([name, schema]) => ({ name, in: "query", schema }),
    );
  }
  return { [method]: op };
}

// Storefront + uploads API documentation. Hand-written because these modules
// are business modules, not generated CRUD (see AGENTS.md section 11).
export function buildStorePaths(): Record<string, TOpenApiSchema> {
  return {
    "/store/auth/register": path("Store Auth", "Register a customer", "storeRegister", ref("StoreAuthSession"), {
      body: { $ref: "#/components/schemas/StoreRegisterInput" },
      errors: ["ValidationError", "Conflict"],
    }),
    "/store/auth/verify-email": path("Store Auth", "Verify email with OTP", "storeVerifyEmail", ref("StoreAuthSession"), {
      body: { $ref: "#/components/schemas/StoreVerifyEmailInput" },
      errors: ["ValidationError", "Unauthorized"],
    }),
    "/store/auth/resend-verification": path("Store Auth", "Resend the email verification link", "storeResendVerification", { type: "object", nullable: true }, {
      body: { $ref: "#/components/schemas/StoreForgotPasswordInput" },
      errors: ["ValidationError"],
    }),
    "/store/auth/login": path("Store Auth", "Login with email and password", "storeLogin", ref("StoreAuthSession"), {
      body: { $ref: "#/components/schemas/StoreLoginInput" },
      errors: ["ValidationError", "Unauthorized"],
    }),
    "/store/auth/google": path("Store Auth", "Login with a Google ID token", "storeGoogleLogin", ref("StoreAuthSession"), {
      body: { $ref: "#/components/schemas/StoreGoogleInput" },
      errors: ["ValidationError", "Unauthorized"],
    }),
    "/store/auth/forgot-password": path("Store Auth", "Request a password reset OTP", "storeForgotPassword", { type: "object", nullable: true }, {
      body: { $ref: "#/components/schemas/StoreForgotPasswordInput" },
      errors: ["ValidationError"],
    }),
    "/store/auth/reset-password": path("Store Auth", "Reset password with OTP", "storeResetPassword", { type: "object", nullable: true }, {
      body: { $ref: "#/components/schemas/StoreResetPasswordInput" },
      errors: ["ValidationError", "Unauthorized"],
    }),
    "/store/auth/logout": path("Store Auth", "Revoke the current session", "storeLogout", { type: "object", nullable: true }, {
      method: "post",
      authenticated: true,
      errors: ["Unauthorized"],
    }),
    "/store/auth/me": path("Store Auth", "Get the authenticated customer", "storeMe", ref("StoreCustomer"), {
      authenticated: true,
      errors: ["Unauthorized"],
    }),
    "/store/checkout": path("Store", "Create a guest order", "guestCheckout", ref("CheckoutResult"), {
      body: { $ref: "#/components/schemas/CheckoutInput" },
      errors: ["ValidationError", "NotFound"],
    }),
    "/store/track/{trackingToken}": {
      get: {
        tags: ["Store"],
        summary: "Track an order with its tracking token",
        operationId: "trackOrder",
        security: [],
        parameters: [{ name: "trackingToken", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": ok("Tracking snapshot returned.", ref("TrackingSnapshot")),
          "404": responseRef("NotFound"),
          "500": responseRef("InternalError"),
        },
      },
    },
    "/store/cart": path("Store Cart", "Get or create the session cart", "getCart", ref("StoreCart"), {
      query: { properties: { guestToken: { type: "string" } } },
    }),
    "/store/cart/merge": path("Store Cart", "Merge a guest cart into the customer cart", "mergeCart", ref("StoreCart"), {
      authenticated: true,
      body: { $ref: "#/components/schemas/CartMergeInput" },
      errors: ["ValidationError", "Unauthorized"],
    }),
    "/store/cart/{guestToken}": {
      get: {
        tags: ["Store Cart"],
        summary: "Get a guest cart by token",
        operationId: "getGuestCart",
        security: [],
        parameters: [{ name: "guestToken", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": ok("Cart returned.", ref("StoreCart")),
          "404": responseRef("NotFound"),
          "500": responseRef("InternalError"),
        },
      },
    },
    "/store/cart/{guestToken}/items": {
      post: {
        tags: ["Store Cart"],
        summary: "Add a package to the cart",
        operationId: "addCartItem",
        security: [],
        parameters: [{ name: "guestToken", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CartAddItemInput" } } } },
        responses: {
          "200": ok("Item added.", ref("StoreCart")),
          "400": responseRef("ValidationError"),
          "404": responseRef("NotFound"),
          "500": responseRef("InternalError"),
        },
      },
    },
    "/store/cart/{guestToken}/items/{itemId}": {
      patch: {
        tags: ["Store Cart"],
        summary: "Change an item quantity",
        operationId: "updateCartItem",
        security: [],
        parameters: [
          { name: "guestToken", in: "path", required: true, schema: { type: "string" } },
          { name: "itemId", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CartUpdateItemInput" } } } },
        responses: {
          "200": ok("Item updated.", ref("StoreCart")),
          "400": responseRef("ValidationError"),
          "404": responseRef("NotFound"),
          "500": responseRef("InternalError"),
        },
      },
      delete: {
        tags: ["Store Cart"],
        summary: "Remove an item",
        operationId: "removeCartItem",
        security: [],
        parameters: [
          { name: "guestToken", in: "path", required: true, schema: { type: "string" } },
          { name: "itemId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": ok("Item removed.", ref("StoreCart")),
          "404": responseRef("NotFound"),
          "500": responseRef("InternalError"),
        },
      },
    },
    "/store/payments/proof": path("Store Payments", "Submit a transfer proof image URL", "submitProof", ref("PaymentView"), {
      body: { $ref: "#/components/schemas/ProofInput" },
      errors: ["ValidationError", "Forbidden"],
    }),
    "/store/products": path("Store Catalog", "List storefront product cards", "listStoreProducts", {
      type: "object",
      properties: { items: { type: "array", items: ref("StoreProductCard") }, meta: ref("PaginationMeta") },
    }, {
      query: {
        properties: {
          page: { type: "integer", default: 1 },
          limit: { type: "integer", maximum: 48, default: 12 },
          category: { type: "string" },
          subcategory: { type: "string" },
          featured: { type: "string", enum: ["true", "false"] },
          inStock: { type: "string", enum: ["true", "false"] },
          minPrice: { type: "number" },
          maxPrice: { type: "number" },
          sort: { type: "string", enum: ["newest", "price_asc", "price_desc", "name"] },
        },
      },
      errors: ["ValidationError"],
    }),
    "/store/products/{slug}": {
      get: {
        tags: ["Store Catalog"],
        summary: "Get a product detail page payload",
        operationId: "getStoreProduct",
        security: [],
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": ok("Product returned.", ref("StoreProductDetail")),
          "404": responseRef("NotFound"),
          "500": responseRef("InternalError"),
        },
      },
    },
    "/store/categories": path("Store Catalog", "Category tree with product counts", "getStoreCategories", {
      type: "array", items: ref("StoreCategory"),
    }),
    "/store/settings": path("Store", "Public store settings", "getStoreSettings", ref("StoreSettings")),
    "/store/banners": path("Store Content", "Active banners", "getStoreBanners", { type: "array", items: ref("StoreBanner") }),
    "/store/faqs": path("Store Content", "Active FAQs", "getStoreFaqs", { type: "array", items: ref("StoreFaq") }),
    "/store/pages/{slug}": {
      get: {
        tags: ["Store Content"],
        summary: "Get a published static page",
        operationId: "getStorePage",
        security: [],
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": ok("Page returned.", ref("StorePage")),
          "404": responseRef("NotFound"),
          "500": responseRef("InternalError"),
        },
      },
    },
    "/store/sitemap": path("Store", "Slug + updatedAt index for SEO", "getStoreSitemap", ref("StoreSitemap")),
    "/store/shipping/areas": path("Store Shipping", "Shipping areas (governorates/cities)", "getShippingAreas", {
      type: "array", items: ref("ShippingArea"),
    }),
    "/store/shipping/quote": path("Store Shipping", "Shipping cost + ETA for an address", "getShippingQuote", ref("ShippingQuote"), {
      query: {
        properties: {
          governorate: { type: "string" },
          city: { type: "string" },
        },
      },
      errors: ["ValidationError"],
    }),
    "/store/coupons/validate": path("Store", "Validate a coupon code without redeeming", "validateCoupon", ref("CouponValidation"), {
      body: { $ref: "#/components/schemas/CouponValidateInput" },
      errors: ["ValidationError", "NotFound"],
    }),
    "/store/search": path("Store", "Four-tier Arabic product search", "storeSearch", ref("SearchResult"), {
      query: {
        properties: {
          q: { type: "string" },
          limit: { type: "integer", maximum: 20, default: 10 },
        },
      },
      errors: ["ValidationError"],
    }),
    "/uploads/sign": path("Uploads", "Sign a direct Cloudinary upload (employee)", "signUpload", ref("UploadSignature"), {
      body: { $ref: "#/components/schemas/UploadSignInput" },
      errors: ["ValidationError", "Unauthorized", "Forbidden"],
    }),
    "/uploads/sign-proof": path("Uploads", "Sign a payment-proof upload (public, token-checked)", "signProofUpload", ref("UploadSignature"), {
      body: { $ref: "#/components/schemas/ProofSignInput" },
      errors: ["ValidationError", "Forbidden"],
    }),
  };
}

// OWNER/ADMIN read-only reports over the reporting SQL views. The rows come
// straight from the views, so the item shape is documented as open objects.
const reportRows = (view: string): TOpenApiSchema => ({
  type: "array",
  items: { type: "object", additionalProperties: true, description: `Row of the ${view} SQL view.` },
});

export function buildReportsPaths(): Record<string, TOpenApiSchema> {
  return {
    "/reports/sales-daily": path("Reports", "Daily sales aggregates", "reportSalesDaily", reportRows("report_sales_daily"), {
      security: employeeSecurity,
      errors: ["Unauthorized", "Forbidden"],
    }),
    "/reports/top-products": path("Reports", "Best-selling products", "reportTopProducts", reportRows("report_top_products"), {
      security: employeeSecurity,
      errors: ["Unauthorized", "Forbidden"],
    }),
    "/reports/top-products-monthly": path("Reports", "Best-selling products per month", "reportTopProductsMonthly", reportRows("report_top_products_monthly"), {
      security: employeeSecurity,
      errors: ["Unauthorized", "Forbidden"],
    }),
    "/reports/customers-summary": path("Reports", "Customer KPI summary", "reportCustomersSummary", reportRows("report_customers_summary"), {
      security: employeeSecurity,
      errors: ["Unauthorized", "Forbidden"],
    }),
    "/reports/customer-segments": path("Reports", "Customer segmentation", "reportCustomerSegments", reportRows("report_customer_segments"), {
      security: employeeSecurity,
      errors: ["Unauthorized", "Forbidden"],
    }),
    "/reports/payments-pending": path("Reports", "Payments awaiting review", "reportPaymentsPending", reportRows("report_payments_pending"), {
      security: employeeSecurity,
      errors: ["Unauthorized", "Forbidden"],
    }),
    "/reports/promotions-performance": path("Reports", "Promotion and coupon performance", "reportPromotionsPerformance", reportRows("report_promotions_performance"), {
      security: employeeSecurity,
      errors: ["Unauthorized", "Forbidden"],
    }),
    "/reports/zero-result-searches": path("Reports", "Searches that matched nothing", "reportZeroResultSearches", reportRows("report_zero_result_searches"), {
      security: employeeSecurity,
      errors: ["Unauthorized", "Forbidden"],
    }),
    "/reports/top-searches": path("Reports", "Most frequent search terms", "reportTopSearches", reportRows("report_top_searches"), {
      security: employeeSecurity,
      errors: ["Unauthorized", "Forbidden"],
    }),
    "/reports/cod-awaiting-settlement": path("Reports", "COD orders awaiting settlement", "reportCodAwaitingSettlement", reportRows("cod_awaiting_settlement"), {
      security: employeeSecurity,
      errors: ["Unauthorized", "Forbidden"],
    }),
  };
}

export const storeSchemas: Record<string, TOpenApiSchema> = {
  StoreAuthSession: {
    type: "object",
    properties: {
      customer: ref("StoreCustomer"),
      token: { type: "string" },
      expiresAt: { type: "string", format: "date-time" },
    },
  },
  StoreCustomer: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      email: { type: "string" },
      phone: { type: "string", nullable: true },
    },
  },
  StoreRegisterInput: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { type: "string" },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 },
      phone: { type: "string" },
    },
  },
  StoreVerifyEmailInput: {
    type: "object",
    required: ["email", "code"],
    properties: { email: { type: "string", format: "email" }, code: { type: "string" } },
  },
  StoreLoginInput: {
    type: "object",
    required: ["email", "password"],
    properties: { email: { type: "string", format: "email" }, password: { type: "string" } },
  },
  StoreGoogleInput: {
    type: "object",
    required: ["credential"],
    properties: { credential: { type: "string" } },
  },
  StoreForgotPasswordInput: {
    type: "object",
    required: ["email"],
    properties: { email: { type: "string", format: "email" } },
  },
  StoreResetPasswordInput: {
    type: "object",
    required: ["email", "code", "password"],
    properties: {
      email: { type: "string", format: "email" },
      code: { type: "string" },
      password: { type: "string", minLength: 8 },
    },
  },
  CheckoutInput: {
    type: "object",
    required: ["paymentMethod"],
    properties: {
      guestToken: { type: "string" },
      couponCode: { type: "string" },
      paymentMethod: { type: "string", enum: ["COD", "ONLINE_TRANSFER"] },
      items: {
        type: "array",
        items: {
          type: "object",
          required: ["packageId", "quantity"],
          properties: {
            packageId: { type: "string" },
            quantity: { type: "integer", minimum: 1 },
          },
        },
      },
      customer: {
        type: "object",
        properties: {
          name: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
        },
      },
      address: {
        type: "object",
        properties: {
          governorate: { type: "string" },
          city: { type: "string" },
          street: { type: "string" },
          buildingNumber: { type: "string" },
          floor: { type: "string" },
          apartment: { type: "string" },
          landmark: { type: "string" },
        },
      },
      notes: { type: "string" },
    },
  },
  CheckoutResult: {
    type: "object",
    properties: {
      orderId: { type: "string" },
      orderNumber: { type: "string" },
      trackingToken: { type: "string" },
      paymentMethod: { type: "string", enum: ["COD", "ONLINE_TRANSFER"] },
      paymentId: { type: "string", nullable: true },
      totals: ref("OrderTotals"),
    },
  },
  OrderTotals: {
    type: "object",
    properties: {
      subtotal: { type: "string" },
      discountTotal: { type: "string" },
      shippingTotal: { type: "string" },
      taxTotal: { type: "string" },
      grandTotal: { type: "string" },
      currency: { type: "string", example: "EGP" },
    },
  },
  TrackingSnapshot: {
    type: "object",
    properties: {
      orderNumber: { type: "string" },
      status: { type: "string" },
      paymentStatus: { type: "string" },
      placedAt: { type: "string", format: "date-time" },
      history: { type: "array", items: { type: "object" } },
    },
  },
  StoreCart: {
    type: "object",
    properties: {
      id: { type: "string" },
      guestToken: { type: "string", nullable: true },
      itemsCount: { type: "integer" },
      items: { type: "array", items: ref("StoreCartItem") },
    },
  },
  StoreCartItem: {
    type: "object",
    properties: {
      id: { type: "string" },
      quantity: { type: "integer" },
      unitPrice: { type: "string" },
      lineTotal: { type: "string" },
      isAvailable: { type: "boolean" },
      package: {
        type: "object",
        properties: {
          id: { type: "string" },
          sku: { type: "string" },
          sizeValue: { type: "string" },
          sizeUnit: { type: "string" },
          sellingPrice: { type: "string" },
          compareAtPrice: { type: "string", nullable: true },
          stockStatus: { type: "string" },
        },
      },
      product: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          nameAr: { type: "string" },
          nameEn: { type: "string", nullable: true },
          imageUrl: { type: "string", nullable: true },
        },
      },
    },
  },
  CartMergeInput: {
    type: "object",
    required: ["guestToken"],
    properties: { guestToken: { type: "string" } },
  },
  CartAddItemInput: {
    type: "object",
    required: ["packageId", "quantity"],
    properties: {
      packageId: { type: "string" },
      quantity: { type: "integer", minimum: 1 },
    },
  },
  CartUpdateItemInput: {
    type: "object",
    required: ["quantity"],
    properties: { quantity: { type: "integer", minimum: 0 } },
  },
  ProofInput: {
    type: "object",
    required: ["orderId", "trackingToken", "proofImageUrl"],
    properties: {
      orderId: { type: "string" },
      trackingToken: { type: "string" },
      proofImageUrl: { type: "string", format: "uri" },
    },
  },
  PaymentView: {
    type: "object",
    properties: {
      id: { type: "string" },
      status: { type: "string" },
      method: { type: "string" },
      amount: { type: "string" },
      proofImageUrl: { type: "string", nullable: true },
    },
  },
  StoreProductCard: {
    type: "object",
    properties: {
      id: { type: "string" },
      slug: { type: "string" },
      nameAr: { type: "string" },
      nameEn: { type: "string", nullable: true },
      productType: { type: "string", enum: ["FINISHED", "PREDEFINED_BUNDLE"] },
      isFeatured: { type: "boolean" },
      primaryImageUrl: { type: "string", nullable: true },
      fromPrice: { type: "string" },
      compareAtFrom: { type: "string", nullable: true },
      saleEndsAt: { type: "string", format: "date-time", nullable: true },
      packageCount: { type: "integer" },
      inStock: { type: "boolean" },
      category: {
        type: "object",
        properties: { slug: { type: "string" }, nameAr: { type: "string" }, nameEn: { type: "string", nullable: true } },
      },
      subcategory: {
        type: "object",
        properties: { slug: { type: "string" }, nameAr: { type: "string" }, nameEn: { type: "string", nullable: true } },
      },
    },
  },
  StoreProductDetail: {
    type: "object",
    properties: {
      card: ref("StoreProductCard"),
      descriptionAr: { type: "string", nullable: true },
      descriptionEn: { type: "string", nullable: true },
      aliases: { type: "array", items: { type: "string" } },
      images: { type: "array", items: { type: "object" } },
      packages: { type: "array", items: { type: "object" } },
      bundleComponents: { type: "array", items: { type: "object" } },
      related: { type: "array", items: ref("StoreProductCard") },
    },
  },
  StoreCategory: {
    type: "object",
    properties: {
      slug: { type: "string" },
      nameAr: { type: "string" },
      nameEn: { type: "string", nullable: true },
      productsCount: { type: "integer" },
      subcategories: { type: "array", items: { type: "object" } },
    },
  },
  StoreSettings: {
    type: "object",
    properties: {
      currency: { type: "string", example: "EGP" },
      taxRate: { type: "string", nullable: true },
      freeShippingThreshold: { type: "string", nullable: true },
      contact: { type: "object", nullable: true },
      social: { type: "object", nullable: true },
    },
  },
  StoreBanner: {
    type: "object",
    properties: {
      slug: { type: "string" },
      titleAr: { type: "string" },
      imageUrl: { type: "string" },
      mobileImageUrl: { type: "string", nullable: true },
      linkUrl: { type: "string", nullable: true },
      sortOrder: { type: "integer" },
    },
  },
  StoreFaq: {
    type: "object",
    properties: {
      questionAr: { type: "string" },
      answerAr: { type: "string" },
      sortOrder: { type: "integer" },
    },
  },
  StorePage: {
    type: "object",
    properties: {
      slug: { type: "string" },
      titleAr: { type: "string" },
      bodyAr: { type: "string" },
      seoTitle: { type: "string", nullable: true },
      seoDescription: { type: "string", nullable: true },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  StoreSitemap: {
    type: "object",
    properties: {
      products: { type: "array", items: { type: "object" } },
      categories: { type: "array", items: { type: "object" } },
      subcategories: { type: "array", items: { type: "object" } },
      pages: { type: "array", items: { type: "object" } },
    },
  },
  ShippingArea: {
    type: "object",
    properties: {
      governorate: { type: "string" },
      city: { type: "string", nullable: true },
    },
  },
  ShippingQuote: {
    type: "object",
    properties: {
      cost: { type: "string" },
      etaMinDays: { type: "integer" },
      etaMaxDays: { type: "integer" },
    },
  },
  CouponValidateInput: {
    type: "object",
    required: ["code", "subtotal"],
    properties: {
      code: { type: "string" },
      subtotal: { type: "string" },
    },
  },
  CouponValidation: {
    type: "object",
    properties: {
      valid: { type: "boolean" },
      discount: { type: "string" },
      message: { type: "string", nullable: true },
    },
  },
  SearchResult: {
    type: "object",
    properties: {
      results: {
        type: "array",
        items: {
          allOf: [ref("StoreProductCard")],
          type: "object",
          properties: {
            matchTier: { type: "integer" },
            score: { type: "number" },
            matchedTerm: { type: "string", nullable: true },
          },
        },
      },
      suggestions: { type: "array", items: ref("StoreProductCard") },
    },
  },
  UploadSignature: {
    type: "object",
    properties: {
      cloudName: { type: "string" },
      apiKey: { type: "string" },
      timestamp: { type: "integer" },
      signature: { type: "string" },
      folder: { type: "string" },
      allowedFormats: { type: "string", example: "jpg,jpeg,png,webp" },
      uploadUrl: { type: "string", format: "uri" },
    },
  },
  UploadSignInput: {
    type: "object",
    required: ["kind"],
    properties: { kind: { type: "string", enum: ["product", "category", "banner"] } },
  },
  ProofSignInput: {
    type: "object",
    required: ["orderId", "trackingToken"],
    properties: {
      orderId: { type: "string" },
      trackingToken: { type: "string" },
    },
  },
  PaginationMeta: {
    type: "object",
    properties: {
      page: { type: "integer" },
      limit: { type: "integer" },
      total: { type: "integer" },
      totalPages: { type: "integer" },
    },
  },
};
