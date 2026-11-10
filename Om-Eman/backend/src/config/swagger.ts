import { env } from "./env.js";
import type {
  IModuleFieldMetadata,
  IModuleMetadata,
} from "../modules/module-metadata.js";
import { moduleMetadata } from "../modules/module-metadata.js";

type TOpenApiSchema = Record<string, unknown>;
type TOpenApiResponses = Record<string, unknown>;

const tagDescriptions: Record<string, string> = {
  Auth: "Employee authentication and current-session endpoints.",
  Employees: "Employee accounts, roles, status, and audit trail.",
  Audit: "Append-only audit records.",
  Customers: "Customer accounts and saved addresses.",
  Carts: "Customer carts, cart items, and wishlists.",
  Catalog:
    "Categories, products, packages, aliases, images, bundles, and CSV import.",
  Search: "Arabic search synonyms and search analytics.",
  Orders: "Orders, order items, status history, and address snapshots.",
  Invoices: "Issued invoices and append-only invoice lines.",
  Payments: "Online-transfer and cash-on-delivery payments.",
  Shipping: "Carriers, tariffs, shipments, and shipment status history.",
  Promotions: "Promotions, targets, coupons, and redemptions.",
  Marketing: "Meta Pixel / Conversions API events.",
  Content: "Banners, static pages, and FAQs.",
  Notifications: "Customer and employee notifications.",
  Settings: "System settings and document sequences.",
};

function ref(name: string): TOpenApiSchema {
  return { $ref: `#/components/schemas/${name}` };
}

function parameterRef(name: string): TOpenApiSchema {
  return { $ref: `#/components/parameters/${name}` };
}

function responseRef(name: string): TOpenApiSchema {
  return { $ref: `#/components/responses/${name}` };
}

function jsonResponse(
  description: string,
  schema: TOpenApiSchema,
): TOpenApiSchema {
  return {
    description,
    content: {
      "application/json": { schema },
    },
  };
}

function successEnvelope(
  data: TOpenApiSchema,
  paginated: boolean,
): TOpenApiSchema {
  return {
    type: "object",
    required: ["success", "message"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Operation completed successfully" },
      data: paginated
        ? { type: "array", items: data }
        : data,
      ...(paginated ? { meta: ref("PaginationMeta") } : {}),
    },
  };
}

function fieldSchema(field: IModuleFieldMetadata): TOpenApiSchema {
  if (field.kind === "enum") {
    return {
      type: "string",
      enum: field.enumValues ?? [],
      ...(field.isOptional ? { nullable: true } : {}),
    };
  }

  if (field.isPassword) {
    return {
      type: "string",
      format: "password",
      minLength: 8,
      maxLength: 128,
      ...(field.isOptional ? { nullable: true } : {}),
    };
  }

  const lowerName = field.name.toLowerCase();
  let schema: TOpenApiSchema;

  switch (field.type) {
    case "String":
      schema = { type: "string" };
      if (lowerName.includes("email")) schema.format = "email";
      else if (lowerName.endsWith("url")) schema.format = "uri";
      break;
    case "Boolean":
      schema = { type: "boolean" };
      break;
    case "Int":
      schema = { type: "integer", format: "int32" };
      break;
    case "Float":
      schema = { type: "number", format: "float" };
      break;
    case "Decimal":
      schema = {
        type: "string",
        pattern: "^-?\\d+(?:\\.\\d+)?$",
        example: "0.0000",
      };
      break;
    case "BigInt":
      schema = { type: "string", pattern: "^\\d+$" };
      break;
    case "DateTime":
      schema = { type: "string", format: "date-time" };
      break;
    case "Json":
      schema = { type: "object", additionalProperties: true };
      break;
    case "Bytes":
      schema = { type: "string", format: "byte" };
      break;
    default:
      schema = {};
  }

  if (field.isOptional) schema.nullable = true;
  return schema;
}

function objectSchema(
  fields: IModuleFieldMetadata[],
  mode: "response" | "create" | "update",
): TOpenApiSchema {
  const properties: Record<string, TOpenApiSchema> = {};
  for (const field of fields) {
    properties[field.name] = fieldSchema(field);
  }

  const required =
    mode === "update"
      ? []
      : fields
          .filter((field) =>
            mode === "create"
              ? !field.isOptional && !field.hasDefault
              : !field.isOptional,
          )
          .map((field) => field.name);

  return {
    type: "object",
    properties,
    additionalProperties: false,
    ...(required.length > 0 ? { required } : {}),
  };
}

function securityFor(publicRead: boolean): TOpenApiSchema[] {
  return publicRead ? [] : [{ bearerAuth: [] }];
}

function readErrors(
  publicRead: boolean,
  includeNotFound: boolean,
): TOpenApiResponses {
  return {
    "400": responseRef("ValidationError"),
    ...(publicRead ? {} : { "401": responseRef("Unauthorized") }),
    ...(includeNotFound ? { "404": responseRef("NotFound") } : {}),
    "500": responseRef("InternalError"),
  };
}

function writeErrors(includeNotFound: boolean): TOpenApiResponses {
  return {
    "400": responseRef("ValidationError"),
    "401": responseRef("Unauthorized"),
    "403": responseRef("Forbidden"),
    ...(includeNotFound ? { "404": responseRef("NotFound") } : {}),
    "409": responseRef("Conflict"),
    "500": responseRef("InternalError"),
  };
}

function buildListOperation(meta: IModuleMetadata): TOpenApiSchema {
  return {
    tags: [meta.tag],
    summary: `List ${meta.modelName} records`,
    description: `${meta.description} Supports search, pagination, and sorting.`,
    operationId: `list${meta.modelName}`,
    security: securityFor(meta.publicRead),
    parameters: [
      parameterRef("Page"),
      parameterRef("Limit"),
      {
        name: "q",
        in: "query",
        required: false,
        schema: { type: "string" },
        description: "Case-insensitive search across string fields.",
      },
      {
        name: "sortBy",
        in: "query",
        required: false,
        schema: {
          type: "string",
          enum: meta.sortFields,
          default: meta.defaultSort,
        },
        description: "Field used for sorting.",
      },
      parameterRef("SortOrder"),
    ],
    responses: {
      "200": jsonResponse(
        `${meta.modelName} records fetched successfully.`,
        successEnvelope(ref(`${meta.modelName}Response`), true),
      ),
      ...readErrors(meta.publicRead, false),
    },
  };
}

function buildGetOperation(meta: IModuleMetadata): TOpenApiSchema {
  return {
    tags: [meta.tag],
    summary: `Get ${meta.modelName} by id`,
    description: meta.description,
    operationId: `get${meta.modelName}`,
    security: securityFor(meta.publicRead),
    parameters: [parameterRef("IdPath")],
    responses: {
      "200": jsonResponse(
        `${meta.modelName} fetched successfully.`,
        successEnvelope(ref(`${meta.modelName}Response`), false),
      ),
      ...readErrors(meta.publicRead, true),
    },
  };
}

function buildCreateOperation(meta: IModuleMetadata): TOpenApiSchema {
  return {
    tags: [meta.tag],
    summary: `Create ${meta.modelName}`,
    description: meta.appendOnly
      ? `${meta.description} This model is append-only.`
      : meta.description,
    operationId: `create${meta.modelName}`,
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: ref(`${meta.modelName}Create`),
        },
      },
    },
    responses: {
      "201": jsonResponse(
        `${meta.modelName} created successfully.`,
        successEnvelope(ref(`${meta.modelName}Response`), false),
      ),
      ...writeErrors(false),
    },
  };
}

function buildUpdateOperation(meta: IModuleMetadata): TOpenApiSchema {
  return {
    tags: [meta.tag],
    summary: `Update ${meta.modelName}`,
    description: meta.description,
    operationId: `update${meta.modelName}`,
    security: [{ bearerAuth: [] }],
    parameters: [parameterRef("IdPath")],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: ref(`${meta.modelName}Update`),
        },
      },
    },
    responses: {
      "200": jsonResponse(
        `${meta.modelName} updated successfully.`,
        successEnvelope(ref(`${meta.modelName}Response`), false),
      ),
      ...writeErrors(true),
    },
  };
}

function buildDeleteOperation(meta: IModuleMetadata): TOpenApiSchema {
  return {
    tags: [meta.tag],
    summary: `Delete ${meta.modelName}`,
    description: meta.description,
    operationId: `delete${meta.modelName}`,
    security: [{ bearerAuth: [] }],
    parameters: [parameterRef("IdPath")],
    responses: {
      "200": jsonResponse(
        `${meta.modelName} deleted successfully.`,
        successEnvelope({}, false),
      ),
      ...writeErrors(true),
    },
  };
}

function buildPaths(): Record<string, TOpenApiSchema> {
  const paths: Record<string, TOpenApiSchema> = {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login with employee credentials",
        operationId: "login",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: ref("LoginRequest"),
            },
          },
        },
        responses: {
          "200": jsonResponse(
            "Login successful.",
            successEnvelope(ref("LoginPayload"), false),
          ),
          "400": responseRef("ValidationError"),
          "401": responseRef("Unauthorized"),
          "500": responseRef("InternalError"),
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get the authenticated employee",
        operationId: "getCurrentEmployee",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": jsonResponse(
            "Employee fetched successfully.",
            successEnvelope(ref("AuthEmployee"), false),
          ),
          "401": responseRef("Unauthorized"),
          "404": responseRef("NotFound"),
          "500": responseRef("InternalError"),
        },
      },
    },
    "/products/import": {
      post: {
        tags: ["Catalog"],
        summary: "Import products from a CSV file",
        description:
          "Creates products from CSV rows. Each row may also create one " +
          "ProductPackage when a sku is supplied. Invalid rows are reported " +
          "per row while valid rows are imported.",
        operationId: "importProducts",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "UTF-8 CSV file, maximum 5 MB.",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": jsonResponse(
            "Product import completed.",
            successEnvelope(ref("ProductImportResult"), false),
          ),
          "400": responseRef("ValidationError"),
          "401": responseRef("Unauthorized"),
          "403": responseRef("Forbidden"),
          "500": responseRef("InternalError"),
        },
      },
    },
  };

  for (const meta of moduleMetadata) {
    const collectionPath: TOpenApiSchema = {
      get: buildListOperation(meta),
      post: buildCreateOperation(meta),
    };
    const itemPath: TOpenApiSchema = {
      get: buildGetOperation(meta),
    };

    if (!meta.appendOnly) {
      itemPath.patch = buildUpdateOperation(meta);
      itemPath.delete = buildDeleteOperation(meta);
    }

    paths[`/${meta.route}`] = collectionPath;
    paths[`/${meta.route}/{id}`] = itemPath;
  }

  return paths;
}

function buildModelSchemas(): Record<string, TOpenApiSchema> {
  const schemas: Record<string, TOpenApiSchema> = {};
  for (const meta of moduleMetadata) {
    schemas[`${meta.modelName}Response`] = objectSchema(
      meta.responseFields,
      "response",
    );
    schemas[`${meta.modelName}Create`] = objectSchema(
      meta.createFields,
      "create",
    );
    schemas[`${meta.modelName}Update`] = objectSchema(
      meta.updateFields,
      "update",
    );
  }
  return schemas;
}

const uniqueTags = [
  "Auth",
  ...Array.from(new Set(moduleMetadata.map((meta) => meta.tag))),
];

const schemas: Record<string, TOpenApiSchema> = {
  ErrorResponse: {
    type: "object",
    required: ["success", "message", "code"],
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string", example: "Validation failed" },
      code: {
        type: "string",
        example: "VALIDATION_ERROR",
        description: "Machine-readable application error code.",
      },
      details: {
        type: "object",
        nullable: true,
        additionalProperties: true,
        description: "Optional structured error details.",
      },
    },
  },
  PaginationMeta: {
    type: "object",
    required: [
      "page",
      "limit",
      "total",
      "totalPages",
      "hasNextPage",
      "hasPreviousPage",
    ],
    properties: {
      page: { type: "integer", minimum: 1, example: 1 },
      limit: { type: "integer", minimum: 1, maximum: 100, example: 20 },
      total: { type: "integer", minimum: 0, example: 0 },
      totalPages: { type: "integer", minimum: 0, example: 0 },
      hasNextPage: { type: "boolean", example: false },
      hasPreviousPage: { type: "boolean", example: false },
    },
  },
  LoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        example: "owner@om-eman.local",
      },
      password: { type: "string", format: "password", minLength: 1 },
    },
  },
  AuthEmployee: {
    type: "object",
    required: ["id", "fullName", "email", "phone", "role"],
    properties: {
      id: { type: "string", example: "cm00000000000000000000000" },
      fullName: { type: "string", example: "Om Eman Owner" },
      email: {
        type: "string",
        format: "email",
        example: "owner@om-eman.local",
      },
      phone: { type: "string", nullable: true, example: "01000000000" },
      role: {
        type: "string",
        enum: ["OWNER", "ADMIN", "STAFF"],
        example: "OWNER",
      },
    },
  },
  LoginPayload: {
    type: "object",
    required: ["employee", "token"],
    properties: {
      employee: ref("AuthEmployee"),
      token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
    },
  },
  ProductImportFieldError: {
    type: "object",
    required: ["field", "message"],
    properties: {
      field: { type: "string", example: "sizeUnit" },
      message: { type: "string", example: "Invalid option" },
    },
  },
  ProductImportRowError: {
    type: "object",
    required: ["row", "message"],
    properties: {
      row: { type: "integer", minimum: 2, example: 3 },
      message: {
        type: "string",
        example: "sizeUnit: Invalid option",
      },
      details: {
        type: "array",
        items: ref("ProductImportFieldError"),
      },
    },
  },
  ProductImportCreatedProduct: {
    type: "object",
    required: ["id", "nameAr", "slug", "packageSku"],
    properties: {
      id: { type: "string", example: "cm00000000000000000000000" },
      nameAr: { type: "string", example: "زعتر بلدي" },
      slug: { type: "string", example: "baladi-thyme" },
      packageSku: {
        type: "string",
        nullable: true,
        example: "THYME-100G",
      },
    },
  },
  ProductImportResult: {
    type: "object",
    required: ["totalRows", "created", "failed", "createdProducts", "errors"],
    properties: {
      totalRows: { type: "integer", minimum: 0, example: 2 },
      created: { type: "integer", minimum: 0, example: 1 },
      failed: { type: "integer", minimum: 0, example: 1 },
      createdProducts: {
        type: "array",
        items: ref("ProductImportCreatedProduct"),
      },
      errors: {
        type: "array",
        items: ref("ProductImportRowError"),
      },
    },
  },
  ...buildModelSchemas(),
};

export const swaggerSpec: Record<string, unknown> = {
  openapi: "3.0.3",
  info: {
    title: `${env.APP_NAME} API`,
    version: "1.0.0",
    description:
      "REST API for Om Eman, an Egyptian store for herbs, spices, and natural " +
      "products. It includes employee authentication, 38 generated CRUD " +
      "modules, and CSV product import. Generated modules are generic CRUD; " +
      "business rules still need a dedicated layer.",
    contact: {
      name: "Om Eman API Support",
      email: "support@om-eman.local",
    },
    license: { name: "Private" },
  },
  servers: [
    { url: "/api", description: "Current server" },
    { url: "http://localhost:3000/api", description: "Local development" },
  ],
  tags: uniqueTags.map((name) => ({
    name,
    description: tagDescriptions[name] ?? `${name} endpoints.`,
  })),
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT access token issued by POST /auth/login.",
      },
    },
    schemas,
    parameters: {
      Page: {
        name: "page",
        in: "query",
        schema: { type: "integer", minimum: 1, default: 1 },
        description: "Page number (1-based).",
      },
      Limit: {
        name: "limit",
        in: "query",
        schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
        description: "Page size (maximum 100).",
      },
      SortOrder: {
        name: "sortOrder",
        in: "query",
        schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
        description: "Sort direction.",
      },
      IdPath: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string" },
        description: "Resource identifier (cuid).",
      },
    },
    responses: {
      ValidationError: {
        description: "Request validation failed.",
        content: {
          "application/json": {
            schema: ref("ErrorResponse"),
          },
        },
      },
      Unauthorized: {
        description: "Authentication is required or the token is invalid/expired.",
        content: {
          "application/json": {
            schema: ref("ErrorResponse"),
          },
        },
      },
      Forbidden: {
        description: "The authenticated user does not have permission.",
        content: {
          "application/json": {
            schema: ref("ErrorResponse"),
          },
        },
      },
      NotFound: {
        description: "Resource not found.",
        content: {
          "application/json": {
            schema: ref("ErrorResponse"),
          },
        },
      },
      Conflict: {
        description: "The request conflicts with existing data.",
        content: {
          "application/json": {
            schema: ref("ErrorResponse"),
          },
        },
      },
      InternalError: {
        description: "Unexpected server error.",
        content: {
          "application/json": {
            schema: ref("ErrorResponse"),
          },
        },
      },
    },
  },
  paths: buildPaths(),
};

export default swaggerSpec;
