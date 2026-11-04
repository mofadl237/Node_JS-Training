import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

type TFieldKind = "scalar" | "enum" | "relation";

interface IField {
  name: string;
  type: string;
  isList: boolean;
  isOptional: boolean;
  hasDefault: boolean;
  isId: boolean;
  isUpdatedAt: boolean;
  kind: TFieldKind;
  attributes: string;
}

interface IModel {
  name: string;
  fields: IField[];
}

interface IEnum {
  name: string;
  values: string[];
}

const ROOT = process.cwd();
const SCHEMA_PATH = path.join(ROOT, "prisma", "schema.prisma");
const MODULES_PATH = path.join(ROOT, "src", "modules");
const PRESERVED_MODULE_FOLDERS = new Set(["auth", "productImport"]);

const passwordModels = new Set(["Employee", "Customer"]);
const appendOnlyModels = new Set([
  "AuditLog",
  "OrderStatusHistory",
  "ShipmentStatusHistory",
  "InvoiceLine",
  "PromotionRedemption",
  "OrderAddressSnapshot",
]);
const publicReadModels = new Set([
  "Category",
  "Subcategory",
  "Product",
  "ProductImage",
  "ProductAlias",
  "ProductPackage",
  "ProductBundleComponent",
  "SearchSynonym",
  "Banner",
  "StaticPage",
  "Faq",
]);

const modelTags: Record<string, string> = {
  Employee: "Employees",
  AuditLog: "Audit",
  Customer: "Customers",
  CustomerAddress: "Customers",
  Cart: "Carts",
  CartItem: "Carts",
  WishlistItem: "Carts",
  Category: "Catalog",
  Subcategory: "Catalog",
  Product: "Catalog",
  ProductImage: "Catalog",
  ProductAlias: "Catalog",
  ProductPackage: "Catalog",
  ProductBundleComponent: "Catalog",
  SearchSynonym: "Search",
  SearchLog: "Search",
  Order: "Orders",
  OrderItem: "Orders",
  OrderStatusHistory: "Orders",
  OrderAddressSnapshot: "Orders",
  Invoice: "Invoices",
  InvoiceLine: "Invoices",
  Payment: "Payments",
  ShippingCarrier: "Shipping",
  ShippingTariff: "Shipping",
  Shipment: "Shipping",
  ShipmentStatusHistory: "Shipping",
  Promotion: "Promotions",
  PromotionTarget: "Promotions",
  Coupon: "Promotions",
  PromotionRedemption: "Promotions",
  MarketingEvent: "Marketing",
  Banner: "Content",
  StaticPage: "Content",
  Faq: "Content",
  Notification: "Notifications",
  SystemSetting: "Settings",
  DocumentSequence: "Settings",
};

function lowerFirst(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function kebab(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function plural(value: string): string {
  if (value.endsWith("y")) return `${value.slice(0, -1)}ies`;
  if (/(s|x|z|ch|sh)$/.test(value)) return `${value}es`;
  return `${value}s`;
}

function modelRoute(modelName: string): string {
  return plural(kebab(modelName));
}

function isScalarType(type: string): boolean {
  return [
    "String",
    "Boolean",
    "Int",
    "Float",
    "DateTime",
    "Json",
    "Decimal",
    "BigInt",
    "Bytes",
  ].includes(type);
}

function parseSchema(source: string): { models: IModel[]; enums: IEnum[] } {
  const enums: IEnum[] = [];
  const enumRegex = /enum\s+(\w+)\s*\{([\s\S]*?)\n\}/g;
  let enumMatch: RegExpExecArray | null;

  while ((enumMatch = enumRegex.exec(source)) !== null) {
    const name = enumMatch[1];
    const body = enumMatch[2];
    if (!name || !body) continue;

    const values = body
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("//") && !line.startsWith("@@"))
      .map((line) => line.split(/\s+/)[0])
      .filter((value): value is string => Boolean(value));

    enums.push({ name, values });
  }

  const modelBlocks: { name: string; body: string }[] = [];
  const modelRegex = /model\s+(\w+)\s*\{([\s\S]*?)\n\}/g;
  let modelMatch: RegExpExecArray | null;

  while ((modelMatch = modelRegex.exec(source)) !== null) {
    const name = modelMatch[1];
    const body = modelMatch[2];
    if (name && body) modelBlocks.push({ name, body });
  }

  const modelNames = new Set(modelBlocks.map((model) => model.name));
  const enumNames = new Set(enums.map((item) => item.name));

  const models = modelBlocks.map(({ name, body }) => {
    const fields: IField[] = [];

    for (const rawLine of body.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("//") || line.startsWith("@@")) continue;

      const match = line.match(/^(\w+)\s+([A-Za-z_]\w*)(\[\])?(\?)?(?:\s+(.*))?$/);
      if (!match) continue;

      const [, fieldName, fieldType, listMarker, optionalMarker, attributes = ""] = match;
      if (!fieldName || !fieldType) continue;

      const kind: TFieldKind = modelNames.has(fieldType)
        ? "relation"
        : enumNames.has(fieldType)
          ? "enum"
          : "scalar";

      if (kind === "scalar" && !isScalarType(fieldType)) continue;

      fields.push({
        name: fieldName,
        type: fieldType,
        isList: Boolean(listMarker),
        isOptional: Boolean(optionalMarker),
        hasDefault: attributes.includes("@default"),
        isId: attributes.includes("@id"),
        isUpdatedAt: attributes.includes("@updatedAt"),
        kind,
        attributes,
      });
    }

    return { name, fields };
  });

  return { models, enums };
}

function responseFields(model: IModel): IField[] {
  return model.fields.filter(
    (field) =>
      field.kind !== "relation" &&
      !field.isList &&
      !(passwordModels.has(model.name) && field.name === "passwordHash"),
  );
}

function selectFields(model: IModel): IField[] {
  return responseFields(model);
}

function stringFields(model: IModel): IField[] {
  return responseFields(model).filter(
    (field) => field.type === "String" && field.name !== "passwordHash",
  );
}

function sortableFields(model: IModel): IField[] {
  return responseFields(model).filter(
    (field) =>
      field.type !== "Json" &&
      field.type !== "Bytes" &&
      field.type !== "passwordHash",
  );
}

function createFields(model: IModel): IField[] {
  return model.fields.filter((field) => {
    if (field.kind === "relation" || field.isList) return false;
    if (field.name === "createdAt" || field.name === "updatedAt") return false;
    if (field.name === "id" && field.hasDefault) return false;
    return true;
  });
}

function updateFields(model: IModel): IField[] {
  return createFields(model).filter((field) => field.name !== "id");
}

function defaultSortField(model: IModel): string {
  const fields = sortableFields(model);
  if (fields.some((field) => field.name === "createdAt")) return "createdAt";
  if (fields.some((field) => field.name === "id")) return "id";
  return fields[0]?.name ?? "id";
}

function zodType(field: IField, model: IModel, mode: "create" | "update"): string {
  if (passwordModels.has(model.name) && field.name === "passwordHash") {
    const required = mode === "create" && model.name === "Employee";
    return required
      ? 'z.string("password is required").min(8, "password must be at least 8 characters").max(128, "password must not exceed 128 characters")'
      : 'z.string().min(8, "password must be at least 8 characters").max(128, "password must not exceed 128 characters").optional()';
  }

  let base: string;

  if (field.kind === "enum") {
    base = `z.enum([${field.type === "ELanguage" ? '"AR", "EN"' : ""}])`;
  } else {
    switch (field.type) {
      case "String":
        base = "z.string().trim()";
        if (field.name.toLowerCase().includes("email")) {
          base += ".email(\"must be a valid email address\").toLowerCase()";
        } else if (field.name.toLowerCase().includes("slug")) {
          base +=
            '.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase letters, numbers and hyphens only")';
        } else if (field.name.toLowerCase().endsWith("url")) {
          base += '.url("must be a valid URL")';
        } else {
          base += '.min(1, "must not be empty")';
        }
        break;
      case "Boolean":
        base = "z.boolean()";
        break;
      case "Int":
        base = "z.coerce.number().int()";
        break;
      case "Float":
        base = "z.coerce.number()";
        break;
      case "Decimal":
        base =
          'z.union([z.string().trim().regex(/^-?\\d+(?:\\.\\d+)?$/, "must be a decimal number"), z.number().finite()])';
        break;
      case "BigInt":
        base = 'z.union([z.string().trim().regex(/^\\d+$/, "must be an integer"), z.number().int()])';
        break;
      case "DateTime":
        base = "z.coerce.date()";
        break;
      case "Json":
        base = "z.unknown()";
        break;
      case "Bytes":
        base = "z.instanceof(Uint8Array)";
        break;
      default:
        base = "z.unknown()";
    }
  }

  const required = !field.isOptional && !field.hasDefault;

  if (mode === "update" || !required) {
    return field.isOptional ? `${base}.optional().nullable()` : `${base}.optional()`;
  }

  return base;
}

function zodEnumValues(enumValues: string[]): string {
  return enumValues.map((value) => JSON.stringify(value)).join(", ");
}

function generateValidation(model: IModel, enums: IEnum[]): string {
  const enumMap = new Map(enums.map((item) => [item.name, item.values]));
  const createParts = createFields(model).map((field) => {
    const fieldName = field.name === "passwordHash" ? "password" : field.name;
    let fieldType = zodType(field, model, "create");
    if (field.kind === "enum") {
      const values = enumMap.get(field.type) ?? [];
      const required = !field.isOptional && !field.hasDefault;
      const enumBase = `z.enum([${zodEnumValues(values)}])`;
      fieldType = required ? enumBase : field.isOptional ? `${enumBase}.optional().nullable()` : `${enumBase}.optional()`;
    }
    return `  ${fieldName}: ${fieldType},`;
  });

  const updateParts = updateFields(model).map((field) => {
    const fieldName = field.name === "passwordHash" ? "password" : field.name;
    let fieldType = zodType(field, model, "update");
    if (field.kind === "enum") {
      const values = enumMap.get(field.type) ?? [];
      const enumBase = `z.enum([${zodEnumValues(values)}])`;
      fieldType = field.isOptional ? `${enumBase}.optional().nullable()` : `${enumBase}.optional()`;
    }
    return `  ${fieldName}: ${fieldType},`;
  });

  const sortFields = sortableFields(model);
  const sortValues = sortFields.map((field) => JSON.stringify(field.name)).join(", ");
  const sortDefault = JSON.stringify(defaultSortField(model));
  const hasCreatedAt = sortFields.some((field) => field.name === "createdAt");
  const sortOrderDefault = hasCreatedAt ? '"desc"' : '"asc"';

  const modelName = model.name;
  const baseName = modelName;

  return `import { z } from "zod";

export const create${baseName}Schema = z.object({
${createParts.join("\n")}
});

export const update${baseName}Schema = z.object({
${updateParts.join("\n")}
});

export const ${lowerFirst(modelName)}IdParamSchema = z.object({
  id: z.string("id is required").trim().min(1, "id is required"),
});

export const list${baseName}QuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum([${sortValues}]).default(${sortDefault}),
  sortOrder: z.enum(["asc", "desc"]).default(${sortOrderDefault}),
});

export type ICreate${baseName}Input = z.infer<typeof create${baseName}Schema>;
export type IUpdate${baseName}Input = z.infer<typeof update${baseName}Schema>;
export type I${baseName}IdParam = z.infer<typeof ${lowerFirst(modelName)}IdParamSchema>;
export type IList${baseName}Query = z.infer<typeof list${baseName}QuerySchema>;
`;
}

function tsType(field: IField, imports: Set<string>): string {
  if (field.kind === "enum") {
    imports.add(field.type);
    return field.type;
  }

  switch (field.type) {
    case "String":
      return "string";
    case "Boolean":
      return "boolean";
    case "Int":
    case "Float":
      return "number";
    case "Decimal":
      imports.add("Prisma");
      return "Prisma.Decimal";
    case "BigInt":
      return "bigint";
    case "DateTime":
      return "Date";
    case "Json":
      imports.add("Prisma");
      return "Prisma.JsonValue";
    case "Bytes":
      return "Uint8Array";
    default:
      return "unknown";
  }
}

function generateTypes(model: IModel): string {
  const imports = new Set<string>();
  const fields = responseFields(model).map((field) => {
    const type = tsType(field, imports);
    return `  ${field.name}: ${type}${field.isOptional ? " | null" : ""};`;
  });

  const prismaImport = imports.size > 0 ? `import type { ${[...imports].join(", ")} } from "@prisma/client";\n` : "";

  return `${prismaImport}export type {
  ICreate${model.name}Input,
  IList${model.name}Query,
  IUpdate${model.name}Input,
} from "./validation.js";

export interface I${model.name}Response {
${fields.join("\n")}
}
`;
}

function generateSelect(model: IModel): string {
  const fields = selectFields(model)
    .map((field) => `  ${field.name}: true,`)
    .join("\n");
  return `const select${model.name} = {\n${fields}\n} as const;`;
}

function generateListWhere(model: IModel): string {
  const fields = stringFields(model);
  if (fields.length === 0) return "";

  const ors = fields
    .map(
      (field) =>
        `      { ${field.name}: { contains: query.q, mode: "insensitive" } },`,
    )
    .join("\n");

  return `    if (query.q) {
      where.OR = [
${ors}
      ];
    }
`;
}

function generateService(model: IModel): string {
  const modelName = model.name;
  const delegate = lowerFirst(modelName);
  const select = `select${modelName}`;
  const isAppendOnly = appendOnlyModels.has(modelName);
  const isPasswordModel = passwordModels.has(modelName);
  const where = generateListWhere(model);
  const defaultSort = JSON.stringify(defaultSortField(model));
  const hasCreatedAt = sortableFields(model).some((field) => field.name === "createdAt");
  const defaultOrder = hasCreatedAt ? '"desc"' : '"asc"';
  const passwordImport = isPasswordModel
    ? 'import { hashPassword } from "../../utils/password.js";\n'
    : "";
  const appendImport = isAppendOnly
    ? 'import { BadRequestError } from "../../shared/errors.js";\n'
    : "";

  const createBody = isPasswordModel
    ? `    const { password, ...rest } = dto;
    const data = { ...rest } as Prisma.${modelName}UncheckedCreateInput;
    if (password) {
      data.passwordHash = await hashPassword(password);
    }
    const created = await prisma.${delegate}.create({
      data,
      select: ${select},
    });`
    : `    const created = await prisma.${delegate}.create({
      data: dto as Prisma.${modelName}UncheckedCreateInput,
      select: ${select},
    });`;

  const updateBody = isAppendOnly
    ? `    throw new BadRequestError("${modelName} is append-only", "APPEND_ONLY");`
    : isPasswordModel
      ? `    const { password, ...rest } = dto;
    const data = { ...rest } as Prisma.${modelName}UncheckedUpdateInput;
    if (password) {
      data.passwordHash = await hashPassword(password);
    }
    const updated = await prisma.${delegate}.update({
      where: { id },
      data,
      select: ${select},
    });
    return updated as unknown as I${modelName}Response;`
      : `    const updated = await prisma.${delegate}.update({
      where: { id },
      data: dto as Prisma.${modelName}UncheckedUpdateInput,
      select: ${select},
    });
    return updated as unknown as I${modelName}Response;`;

  const removeBody = isAppendOnly
    ? `    throw new BadRequestError("${modelName} is append-only", "APPEND_ONLY");`
    : `    await prisma.${delegate}.delete({ where: { id } });`;

  return `import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { NotFoundError } from "../../shared/errors.js";
import { resolvePagination, toPaginatedResult } from "../../shared/pagination.js";
${passwordImport}${appendImport}import type {
  ICreate${modelName}Input,
  I${modelName}Response,
  IList${modelName}Query,
  IUpdate${modelName}Input,
} from "./types.js";

${generateSelect(model)}

export class ${modelName}Service {
  async create(dto: ICreate${modelName}Input): Promise<I${modelName}Response> {
${createBody}
    return created as unknown as I${modelName}Response;
  }

  async list(query: IList${modelName}Query = {} as IList${modelName}Query) {
    const where: Prisma.${modelName}WhereInput = {};
${where}
    const pagination = resolvePagination(query.page, query.limit);
    const sortBy = query.sortBy ?? ${defaultSort};
    const sortOrder = query.sortOrder ?? ${defaultOrder};

    const [items, total] = await prisma.$transaction([
      prisma.${delegate}.findMany({
        where,
        select: ${select},
        orderBy: { [sortBy]: sortOrder } as Prisma.${modelName}OrderByWithRelationInput,
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.${delegate}.count({ where }),
    ]);

    return toPaginatedResult(
      items as unknown as I${modelName}Response[],
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getById(id: string): Promise<I${modelName}Response> {
    const item = await prisma.${delegate}.findUnique({
      where: { id },
      select: ${select},
    });

    if (!item) {
      throw new NotFoundError("${modelName} not found", "${modelName.toUpperCase()}_NOT_FOUND");
    }

    return item as unknown as I${modelName}Response;
  }

  async update(id: string, dto: IUpdate${modelName}Input): Promise<I${modelName}Response> {
${updateBody}
  }

  async remove(id: string): Promise<void> {
${removeBody}
  }
}
`;
}

function generateController(model: IModel): string {
  const modelName = model.name;
  const service = `${modelName}Service`;
  const controller = `${modelName}Controller`;

  return `import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/response.js";
import { ${service} } from "./service.js";
import type { IList${modelName}Query } from "./types.js";

export class ${controller} {
  private readonly service: ${service};

  constructor() {
    this.service = new ${service}();
  }

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.create(req.body);
      return ApiResponse.created(res, "${modelName} created successfully", result);
    } catch (error) {
      next(error);
    }
  };

  list = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await this.service.list(
        req.query as unknown as IList${modelName}Query,
      );
      return ApiResponse.paginated(
        res,
        "${modelName} records fetched successfully",
        result.items,
        result.meta,
      );
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const rawId = req.params["id"];
      const id = Array.isArray(rawId) ? (rawId[0] ?? "") : (rawId ?? "");
      const result = await this.service.getById(id);
      return ApiResponse.ok(res, "${modelName} fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const rawId = req.params["id"];
      const id = Array.isArray(rawId) ? (rawId[0] ?? "") : (rawId ?? "");
      const result = await this.service.update(id, req.body);
      return ApiResponse.ok(res, "${modelName} updated successfully", result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const rawId = req.params["id"];
      const id = Array.isArray(rawId) ? (rawId[0] ?? "") : (rawId ?? "");
      await this.service.remove(id);
      return ApiResponse.ok(res, "${modelName} deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
`;
}

function generateRouter(model: IModel): string {
  const modelName = model.name;
  const controller = `${modelName}Controller`;
  const lower = lowerFirst(modelName);
  const publicRead = publicReadModels.has(modelName);
  const appendOnly = appendOnlyModels.has(modelName);
  const authImport =
    'import { authenticate } from "../../middlewares/auth.middleware.js";\n';
  const readAuth = publicRead ? "" : "authenticate, ";
  const writeAuth =
    "authenticate, authorize(EEmployeeRole.OWNER, EEmployeeRole.ADMIN), ";

  return `import { Router } from "express";
import { EEmployeeRole } from "@prisma/client";
${authImport}import { authorize } from "../../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate.middleware.js";
import { ${controller} } from "./controller.js";
import {
  create${modelName}Schema,
  list${modelName}QuerySchema,
  ${lower}IdParamSchema,
  update${modelName}Schema,
} from "./validation.js";

const router = Router();
const controller = new ${controller}();

router.get(
  "/",
  ${readAuth}validateQuery(list${modelName}QuerySchema),
  controller.list,
);
router.get(
  "/:id",
  ${readAuth}validateParams(${lower}IdParamSchema),
  controller.getById,
);

router.post(
  "/",
  ${writeAuth}validateBody(create${modelName}Schema),
  controller.create,
);
${
  appendOnly
    ? ""
    : `router.patch(
  "/:id",
  ${writeAuth}validateParams(${lower}IdParamSchema),
  validateBody(update${modelName}Schema),
  controller.update,
);
router.delete(
  "/:id",
  ${writeAuth}validateParams(${lower}IdParamSchema),
  controller.remove,
);
`
}
export default router;
`;
}

interface IModuleFieldMetadata {
  name: string;
  type: string;
  kind: "scalar" | "enum";
  isOptional: boolean;
  hasDefault: boolean;
  isId: boolean;
  isPassword?: boolean;
  enumValues?: string[];
}

interface IModuleMetadata {
  modelName: string;
  folder: string;
  route: string;
  tag: string;
  description: string;
  publicRead: boolean;
  appendOnly: boolean;
  passwordModel: boolean;
  defaultSort: string;
  sortFields: string[];
  responseFields: IModuleFieldMetadata[];
  createFields: IModuleFieldMetadata[];
  updateFields: IModuleFieldMetadata[];
}

function metadataField(
  field: IField,
  model: IModel,
  enumMap: Map<string, string[]>,
): IModuleFieldMetadata {
  const isPassword =
    passwordModels.has(model.name) && field.name === "passwordHash";
  const metadata: IModuleFieldMetadata = {
    name: isPassword ? "password" : field.name,
    type: isPassword ? "String" : field.type,
    kind: isPassword ? "scalar" : field.kind === "enum" ? "enum" : "scalar",
    isOptional: isPassword ? model.name === "Customer" : field.isOptional,
    hasDefault: isPassword ? false : field.hasDefault,
    isId: isPassword ? false : field.isId,
  };

  if (isPassword) {
    metadata.isPassword = true;
  } else if (field.kind === "enum") {
    metadata.enumValues = enumMap.get(field.type) ?? [];
  }

  return metadata;
}

function generateModuleMetadata(models: IModel[], enums: IEnum[]): string {
  const enumMap = new Map(enums.map((item) => [item.name, item.values]));
  const items: IModuleMetadata[] = models.map((model) => ({
    modelName: model.name,
    folder: lowerFirst(model.name),
    route: modelRoute(model.name),
    tag: modelTags[model.name] ?? "General",
    description: `CRUD operations for ${model.name}.`,
    publicRead: publicReadModels.has(model.name),
    appendOnly: appendOnlyModels.has(model.name),
    passwordModel: passwordModels.has(model.name),
    defaultSort: defaultSortField(model),
    sortFields: sortableFields(model).map((field) => field.name),
    responseFields: responseFields(model).map((field) =>
      metadataField(field, model, enumMap),
    ),
    createFields: createFields(model).map((field) =>
      metadataField(field, model, enumMap),
    ),
    updateFields: updateFields(model).map((field) =>
      metadataField(field, model, enumMap),
    ),
  }));

  return `export interface IModuleFieldMetadata {
  name: string;
  type: string;
  kind: "scalar" | "enum";
  isOptional: boolean;
  hasDefault: boolean;
  isId: boolean;
  isPassword?: boolean;
  enumValues?: string[];
}

export interface IModuleMetadata {
  modelName: string;
  folder: string;
  route: string;
  tag: string;
  description: string;
  publicRead: boolean;
  appendOnly: boolean;
  passwordModel: boolean;
  defaultSort: string;
  sortFields: string[];
  responseFields: IModuleFieldMetadata[];
  createFields: IModuleFieldMetadata[];
  updateFields: IModuleFieldMetadata[];
}

export const moduleMetadata: IModuleMetadata[] = ${JSON.stringify(items, null, 2)};
`;
}

async function main(): Promise<void> {
  const source = await readFile(SCHEMA_PATH, "utf8");
  const { models, enums } = parseSchema(source);

  await mkdir(MODULES_PATH, { recursive: true });
  const existingEntries = await readdir(MODULES_PATH, { withFileTypes: true }).catch(() => []);
  for (const entry of existingEntries) {
    if (
      entry.isDirectory() &&
      !PRESERVED_MODULE_FOLDERS.has(entry.name)
    ) {
      await rm(path.join(MODULES_PATH, entry.name), { recursive: true, force: true });
    }
  }

  const indexLines: string[] = [
    'import { Router } from "express";',
    'import authRouter from "./auth/routes.js";',
    'import productImportRouter from "./productImport/router.js";',
  ];
  const mountLines: string[] = [
    'router.use("/auth", authRouter);',
    'router.use("/products/import", productImportRouter);',
  ];

  for (const model of models) {
    const folder = lowerFirst(model.name);
    const dir = path.join(MODULES_PATH, folder);
    await mkdir(dir, { recursive: true });

    await writeFile(path.join(dir, "validation.ts"), generateValidation(model, enums), "utf8");
    await writeFile(path.join(dir, "types.ts"), generateTypes(model), "utf8");
    await writeFile(path.join(dir, "service.ts"), generateService(model), "utf8");
    await writeFile(path.join(dir, "controller.ts"), generateController(model), "utf8");
    await writeFile(path.join(dir, "router.ts"), generateRouter(model), "utf8");

    indexLines.push(`import ${folder}Router from "./${folder}/router.js";`);
    mountLines.push(`router.use("/${modelRoute(model.name)}", ${folder}Router);`);
  }

  indexLines.push("");
  indexLines.push("const router = Router();");
  indexLines.push("");
  indexLines.push(...mountLines);
  indexLines.push("");
  indexLines.push("export default router;");

  await writeFile(path.join(MODULES_PATH, "index.ts"), `${indexLines.join("\n")}\n`, "utf8");
  await writeFile(
    path.join(MODULES_PATH, "module-metadata.ts"),
    generateModuleMetadata(models, enums),
    "utf8",
  );

  console.log(`Generated ${models.length} modules in ${MODULES_PATH}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
