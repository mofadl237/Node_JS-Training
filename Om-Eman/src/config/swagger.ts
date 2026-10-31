import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.js";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: `${env.APP_NAME} API`,
      version: "1.0.0",
      description:
        "REST API for Om Eman, an Egyptian store for herbs, spices, and natural products. " +
        "The API is not implemented yet. This specification is prepared for the next phase " +
        "and currently contains shared components only.",
      contact: {
        name: "Om Eman API Support",
        email: "support@om-eman.local",
      },
      license: {
        name: "Private",
      },
    },
    servers: [
      {
        url: "/",
        description: "Current server",
      },
      {
        url: "http://localhost:3000",
        description: "Local development",
      },
    ],
    tags: [
      { name: "Health", description: "Service health and readiness" },
      { name: "Auth", description: "Authentication and sessions" },
      { name: "Employees", description: "Employee and role administration" },
      { name: "Customers", description: "Customer accounts and addresses" },
      { name: "Catalog", description: "Categories, products, packages, and bundles" },
      { name: "Inventory", description: "Warehouses, lots, stock, and movements" },
      { name: "Purchasing", description: "Suppliers, purchase orders, and receipts" },
      { name: "Orders", description: "Orders, invoices, payments, and returns" },
      { name: "Shipping", description: "Carriers, shipments, and remittances" },
      { name: "Fulfillment", description: "Order fulfillment and partner confirmation" },
      { name: "Resellers", description: "Authorized resellers, availability, custody, and reconciliation" },
      { name: "Finance", description: "Accounts, expenses, and transfers" },
      { name: "Content", description: "Pages, banners, articles, and FAQs" },
      { name: "Notifications", description: "Notifications and delivery attempts" },
    ],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT access token issued by the authentication module.",
        },
      },
      schemas: {
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
              description: "Optional structured error details.",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          required: ["success", "message"],
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation completed successfully" },
            data: {
              type: "object",
              nullable: true,
              description: "Response payload.",
            },
          },
        },
        PaginationMeta: {
          type: "object",
          required: ["page", "limit", "total", "totalPages"],
          properties: {
            page: { type: "integer", minimum: 1, example: 1 },
            limit: { type: "integer", minimum: 1, maximum: 100, example: 20 },
            total: { type: "integer", minimum: 0, example: 0 },
            totalPages: { type: "integer", minimum: 0, example: 0 },
          },
        },
      },
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
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Unauthorized: {
          description: "Authentication is required or the token is invalid/expired.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Forbidden: {
          description: "The authenticated user does not have permission.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        NotFound: {
          description: "Resource not found.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Conflict: {
          description: "The request conflicts with existing data.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        InternalError: {
          description: "Unexpected server error.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    paths: {},
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
