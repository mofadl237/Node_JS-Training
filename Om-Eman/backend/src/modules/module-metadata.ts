export interface IModuleFieldMetadata {
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

export const moduleMetadata: IModuleMetadata[] = [
  {
    "modelName": "Employee",
    "folder": "employee",
    "route": "employees",
    "tag": "Employees",
    "description": "CRUD operations for Employee.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": true,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "fullName",
      "email",
      "phone",
      "role",
      "status",
      "lastLoginAt",
      "disabledAt",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "fullName",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "email",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "phone",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "role",
        "type": "EEmployeeRole",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "OWNER",
          "ADMIN",
          "STAFF"
        ]
      },
      {
        "name": "status",
        "type": "EEmployeeStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "ACTIVE",
          "DISABLED",
          "REMOVED"
        ]
      },
      {
        "name": "lastLoginAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "disabledAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "fullName",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "email",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "phone",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "password",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "isPassword": true
      },
      {
        "name": "role",
        "type": "EEmployeeRole",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "OWNER",
          "ADMIN",
          "STAFF"
        ]
      },
      {
        "name": "status",
        "type": "EEmployeeStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "ACTIVE",
          "DISABLED",
          "REMOVED"
        ]
      },
      {
        "name": "lastLoginAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "disabledAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "fullName",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "email",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "phone",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "password",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "isPassword": true
      },
      {
        "name": "role",
        "type": "EEmployeeRole",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "OWNER",
          "ADMIN",
          "STAFF"
        ]
      },
      {
        "name": "status",
        "type": "EEmployeeStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "ACTIVE",
          "DISABLED",
          "REMOVED"
        ]
      },
      {
        "name": "lastLoginAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "disabledAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "AuditLog",
    "folder": "auditLog",
    "route": "audit-logs",
    "tag": "Audit",
    "description": "CRUD operations for AuditLog.",
    "publicRead": false,
    "appendOnly": true,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "actorEmployeeId",
      "actorCustomerId",
      "action",
      "module",
      "entityType",
      "entityId",
      "result",
      "reason",
      "ipAddress",
      "userAgent",
      "createdAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "actorEmployeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "actorCustomerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "action",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "module",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "entityType",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "entityId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "result",
        "type": "EAuditResult",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "SUCCESS",
          "FAILURE",
          "DENIED"
        ]
      },
      {
        "name": "reason",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "oldValues",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "newValues",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "ipAddress",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "userAgent",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "actorEmployeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "actorCustomerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "action",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "module",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "entityType",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "entityId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "result",
        "type": "EAuditResult",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "SUCCESS",
          "FAILURE",
          "DENIED"
        ]
      },
      {
        "name": "reason",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "oldValues",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "newValues",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "ipAddress",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "userAgent",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "actorEmployeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "actorCustomerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "action",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "module",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "entityType",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "entityId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "result",
        "type": "EAuditResult",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "SUCCESS",
          "FAILURE",
          "DENIED"
        ]
      },
      {
        "name": "reason",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "oldValues",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "newValues",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "ipAddress",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "userAgent",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "Customer",
    "folder": "customer",
    "route": "customers",
    "tag": "Customers",
    "description": "CRUD operations for Customer.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": true,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "phone",
      "email",
      "firstName",
      "lastName",
      "status",
      "isGuest",
      "emailVerifiedAt",
      "phoneVerifiedAt",
      "claimedAt",
      "lastLoginAt",
      "mergedIntoCustomerId",
      "completedOrdersCount",
      "totalSpent",
      "firstOrderAt",
      "lastOrderAt",
      "marketingConsent",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "phone",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "email",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "firstName",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "lastName",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "ECustomerStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "ACTIVE",
          "BLOCKED",
          "MERGED"
        ]
      },
      {
        "name": "isGuest",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "emailVerifiedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "phoneVerifiedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "claimedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "lastLoginAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "mergedIntoCustomerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "completedOrdersCount",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "totalSpent",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "firstOrderAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "lastOrderAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "marketingConsent",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "phone",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "email",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "password",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false,
        "isPassword": true
      },
      {
        "name": "firstName",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "lastName",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "ECustomerStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "ACTIVE",
          "BLOCKED",
          "MERGED"
        ]
      },
      {
        "name": "isGuest",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "emailVerifiedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "phoneVerifiedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "claimedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "lastLoginAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "mergedIntoCustomerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "completedOrdersCount",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "totalSpent",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "firstOrderAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "lastOrderAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "marketingConsent",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "phone",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "email",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "password",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false,
        "isPassword": true
      },
      {
        "name": "firstName",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "lastName",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "ECustomerStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "ACTIVE",
          "BLOCKED",
          "MERGED"
        ]
      },
      {
        "name": "isGuest",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "emailVerifiedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "phoneVerifiedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "claimedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "lastLoginAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "mergedIntoCustomerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "completedOrdersCount",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "totalSpent",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "firstOrderAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "lastOrderAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "marketingConsent",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  },
  {
    "modelName": "CustomerAddress",
    "folder": "customerAddress",
    "route": "customer-addresses",
    "tag": "Customers",
    "description": "CRUD operations for CustomerAddress.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "customerId",
      "label",
      "governorate",
      "city",
      "district",
      "street",
      "building",
      "floor",
      "landmark",
      "latitude",
      "longitude",
      "isDefault",
      "isActive",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "label",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "governorate",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "city",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "district",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "street",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "building",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "floor",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "landmark",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "latitude",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "longitude",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isDefault",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "label",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "governorate",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "city",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "district",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "street",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "building",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "floor",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "landmark",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "latitude",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "longitude",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isDefault",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "label",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "governorate",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "city",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "district",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "street",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "building",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "floor",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "landmark",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "latitude",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "longitude",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isDefault",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  },
  {
    "modelName": "Cart",
    "folder": "cart",
    "route": "carts",
    "tag": "Carts",
    "description": "CRUD operations for Cart.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "customerId",
      "guestToken",
      "status",
      "mergedIntoCartId",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "guestToken",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "ECartStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "ACTIVE",
          "MERGED",
          "CHECKED_OUT",
          "ABANDONED"
        ]
      },
      {
        "name": "mergedIntoCartId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "guestToken",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "ECartStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "ACTIVE",
          "MERGED",
          "CHECKED_OUT",
          "ABANDONED"
        ]
      },
      {
        "name": "mergedIntoCartId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "guestToken",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "ECartStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "ACTIVE",
          "MERGED",
          "CHECKED_OUT",
          "ABANDONED"
        ]
      },
      {
        "name": "mergedIntoCartId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "CartItem",
    "folder": "cartItem",
    "route": "cart-items",
    "tag": "Carts",
    "description": "CRUD operations for CartItem.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "cartId",
      "productPackageId",
      "quantity",
      "priceAtAdd",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "cartId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "quantity",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "priceAtAdd",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "cartId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "quantity",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "priceAtAdd",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "cartId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "quantity",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "priceAtAdd",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "WishlistItem",
    "folder": "wishlistItem",
    "route": "wishlist-items",
    "tag": "Carts",
    "description": "CRUD operations for WishlistItem.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "customerId",
      "productPackageId",
      "createdAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "Category",
    "folder": "category",
    "route": "categories",
    "tag": "Catalog",
    "description": "CRUD operations for Category.",
    "publicRead": true,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "nameAr",
      "nameEn",
      "slug",
      "descriptionAr",
      "descriptionEn",
      "imageUrl",
      "sortOrder",
      "isActive",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "nameAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "slug",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "imageUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "nameAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "slug",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "imageUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "nameAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "slug",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "imageUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  },
  {
    "modelName": "Subcategory",
    "folder": "subcategory",
    "route": "subcategories",
    "tag": "Catalog",
    "description": "CRUD operations for Subcategory.",
    "publicRead": true,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "categoryId",
      "nameAr",
      "nameEn",
      "slug",
      "descriptionAr",
      "descriptionEn",
      "imageUrl",
      "sortOrder",
      "isActive",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "categoryId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "slug",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "imageUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "categoryId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "slug",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "imageUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "categoryId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "slug",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "imageUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  },
  {
    "modelName": "Product",
    "folder": "product",
    "route": "products",
    "tag": "Catalog",
    "description": "CRUD operations for Product.",
    "publicRead": true,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "primarySubcategoryId",
      "nameAr",
      "nameEn",
      "slug",
      "descriptionAr",
      "descriptionEn",
      "productType",
      "status",
      "brand",
      "searchNameArNormalized",
      "searchNameEnNormalized",
      "searchKeywords",
      "searchText",
      "isFeatured",
      "publishedAt",
      "archivedAt",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "primarySubcategoryId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "slug",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productType",
        "type": "EProductType",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "FINISHED",
          "PREDEFINED_BUNDLE"
        ]
      },
      {
        "name": "status",
        "type": "EProductStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "DRAFT",
          "ACTIVE",
          "INACTIVE",
          "ARCHIVED"
        ]
      },
      {
        "name": "brand",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "searchNameArNormalized",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "searchNameEnNormalized",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "searchKeywords",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "searchText",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isFeatured",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "publishedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "archivedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "primarySubcategoryId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "slug",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productType",
        "type": "EProductType",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "FINISHED",
          "PREDEFINED_BUNDLE"
        ]
      },
      {
        "name": "status",
        "type": "EProductStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "DRAFT",
          "ACTIVE",
          "INACTIVE",
          "ARCHIVED"
        ]
      },
      {
        "name": "brand",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "searchNameArNormalized",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "searchNameEnNormalized",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "searchKeywords",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "searchText",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isFeatured",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "publishedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "archivedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "primarySubcategoryId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "slug",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productType",
        "type": "EProductType",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "FINISHED",
          "PREDEFINED_BUNDLE"
        ]
      },
      {
        "name": "status",
        "type": "EProductStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "DRAFT",
          "ACTIVE",
          "INACTIVE",
          "ARCHIVED"
        ]
      },
      {
        "name": "brand",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "searchNameArNormalized",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "searchNameEnNormalized",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "searchKeywords",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "searchText",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isFeatured",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "publishedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "archivedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "ProductImage",
    "folder": "productImage",
    "route": "product-images",
    "tag": "Catalog",
    "description": "CRUD operations for ProductImage.",
    "publicRead": true,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "productId",
      "url",
      "altAr",
      "altEn",
      "sortOrder",
      "isPrimary",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "url",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "altAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "altEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isPrimary",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "url",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "altAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "altEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isPrimary",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "url",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "altAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "altEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isPrimary",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  },
  {
    "modelName": "ProductAlias",
    "folder": "productAlias",
    "route": "product-aliases",
    "tag": "Catalog",
    "description": "CRUD operations for ProductAlias.",
    "publicRead": true,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "productId",
      "alias",
      "language",
      "normalizedAlias",
      "weight",
      "isSearchable",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "alias",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "language",
        "type": "ELanguage",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "AR",
          "EN"
        ]
      },
      {
        "name": "normalizedAlias",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "weight",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isSearchable",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "alias",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "language",
        "type": "ELanguage",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "AR",
          "EN"
        ]
      },
      {
        "name": "normalizedAlias",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "weight",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isSearchable",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "alias",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "language",
        "type": "ELanguage",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "AR",
          "EN"
        ]
      },
      {
        "name": "normalizedAlias",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "weight",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isSearchable",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  },
  {
    "modelName": "ProductPackage",
    "folder": "productPackage",
    "route": "product-packages",
    "tag": "Catalog",
    "description": "CRUD operations for ProductPackage.",
    "publicRead": true,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "productId",
      "sku",
      "barcode",
      "nameAr",
      "nameEn",
      "sizeValue",
      "sizeUnit",
      "sellingPrice",
      "compareAtPrice",
      "saleEndsAt",
      "stockStatus",
      "isActive",
      "isPublished",
      "sortOrder",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sku",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "barcode",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sizeValue",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sizeUnit",
        "type": "ESizeUnit",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "G",
          "KG",
          "ML",
          "L",
          "PIECE",
          "PACK",
          "OTHER"
        ]
      },
      {
        "name": "sellingPrice",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "compareAtPrice",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "saleEndsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "stockStatus",
        "type": "EStockStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "IN_STOCK",
          "OUT_OF_STOCK"
        ]
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isPublished",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sku",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "barcode",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sizeValue",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sizeUnit",
        "type": "ESizeUnit",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "G",
          "KG",
          "ML",
          "L",
          "PIECE",
          "PACK",
          "OTHER"
        ]
      },
      {
        "name": "sellingPrice",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "compareAtPrice",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "saleEndsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "stockStatus",
        "type": "EStockStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "IN_STOCK",
          "OUT_OF_STOCK"
        ]
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isPublished",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sku",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "barcode",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nameEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sizeValue",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sizeUnit",
        "type": "ESizeUnit",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "G",
          "KG",
          "ML",
          "L",
          "PIECE",
          "PACK",
          "OTHER"
        ]
      },
      {
        "name": "sellingPrice",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "compareAtPrice",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "saleEndsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "stockStatus",
        "type": "EStockStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "IN_STOCK",
          "OUT_OF_STOCK"
        ]
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isPublished",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  },
  {
    "modelName": "ProductBundleComponent",
    "folder": "productBundleComponent",
    "route": "product-bundle-components",
    "tag": "Catalog",
    "description": "CRUD operations for ProductBundleComponent.",
    "publicRead": true,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "bundleProductId",
      "componentPackageId",
      "quantity",
      "sortOrder",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "bundleProductId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "componentPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "quantity",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "bundleProductId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "componentPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "quantity",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "bundleProductId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "componentPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "quantity",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  },
  {
    "modelName": "SearchSynonym",
    "folder": "searchSynonym",
    "route": "search-synonyms",
    "tag": "Search",
    "description": "CRUD operations for SearchSynonym.",
    "publicRead": true,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "groupKey",
      "term",
      "normalizedTerm",
      "language",
      "isActive",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "groupKey",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "term",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "normalizedTerm",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "language",
        "type": "ELanguage",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "AR",
          "EN"
        ]
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "groupKey",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "term",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "normalizedTerm",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "language",
        "type": "ELanguage",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "AR",
          "EN"
        ]
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "groupKey",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "term",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "normalizedTerm",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "language",
        "type": "ELanguage",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "AR",
          "EN"
        ]
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  },
  {
    "modelName": "SearchLog",
    "folder": "searchLog",
    "route": "search-logs",
    "tag": "Search",
    "description": "CRUD operations for SearchLog.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "rawQuery",
      "normalizedQuery",
      "resultCount",
      "customerId",
      "sessionId",
      "clickedProductId",
      "createdAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "rawQuery",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "normalizedQuery",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "resultCount",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sessionId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "clickedProductId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "rawQuery",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "normalizedQuery",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "resultCount",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sessionId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "clickedProductId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "rawQuery",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "normalizedQuery",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "resultCount",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sessionId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "clickedProductId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "Order",
    "folder": "order",
    "route": "orders",
    "tag": "Orders",
    "description": "CRUD operations for Order.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "orderNumber",
      "customerId",
      "status",
      "paymentStatus",
      "placedAt",
      "confirmedAt",
      "preparedAt",
      "shippedAt",
      "deliveredAt",
      "canceledAt",
      "cancelReason",
      "subtotal",
      "discountTotal",
      "shippingTotal",
      "taxTotal",
      "grandTotal",
      "customerNotes",
      "internalNotes",
      "fbp",
      "fbc",
      "clientIp",
      "clientUserAgent",
      "eventSourceUrl",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "orderNumber",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "EOrderStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "RECEIVED",
          "CONFIRMED",
          "PREPARING",
          "SHIPPED",
          "DELIVERED",
          "CANCELED",
          "FAILED_DELIVERY"
        ]
      },
      {
        "name": "paymentStatus",
        "type": "EPaymentStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "PENDING",
          "PROOF_UPLOADED",
          "CONFIRMED",
          "REJECTED",
          "CANCELED"
        ]
      },
      {
        "name": "placedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "confirmedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "preparedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "shippedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "deliveredAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "canceledAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "cancelReason",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "subtotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "discountTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "shippingTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "taxTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "grandTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "customerNotes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "internalNotes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fbp",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fbc",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "clientIp",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "clientUserAgent",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "eventSourceUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "orderNumber",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "EOrderStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "RECEIVED",
          "CONFIRMED",
          "PREPARING",
          "SHIPPED",
          "DELIVERED",
          "CANCELED",
          "FAILED_DELIVERY"
        ]
      },
      {
        "name": "paymentStatus",
        "type": "EPaymentStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "PENDING",
          "PROOF_UPLOADED",
          "CONFIRMED",
          "REJECTED",
          "CANCELED"
        ]
      },
      {
        "name": "placedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "confirmedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "preparedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "shippedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "deliveredAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "canceledAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "cancelReason",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "subtotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "discountTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "shippingTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "taxTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "grandTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "customerNotes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "internalNotes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fbp",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fbc",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "clientIp",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "clientUserAgent",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "eventSourceUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "orderNumber",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "EOrderStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "RECEIVED",
          "CONFIRMED",
          "PREPARING",
          "SHIPPED",
          "DELIVERED",
          "CANCELED",
          "FAILED_DELIVERY"
        ]
      },
      {
        "name": "paymentStatus",
        "type": "EPaymentStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "PENDING",
          "PROOF_UPLOADED",
          "CONFIRMED",
          "REJECTED",
          "CANCELED"
        ]
      },
      {
        "name": "placedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "confirmedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "preparedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "shippedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "deliveredAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "canceledAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "cancelReason",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "subtotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "discountTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "shippingTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "taxTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "grandTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "customerNotes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "internalNotes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fbp",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fbc",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "clientIp",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "clientUserAgent",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "eventSourceUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "OrderItem",
    "folder": "orderItem",
    "route": "order-items",
    "tag": "Orders",
    "description": "CRUD operations for OrderItem.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "orderId",
      "productId",
      "productPackageId",
      "productNameArSnapshot",
      "productNameEnSnapshot",
      "packageNameArSnapshot",
      "packageNameEnSnapshot",
      "skuSnapshot",
      "quantity",
      "unitPrice",
      "discountAmount",
      "taxRateSnapshot",
      "taxAmount",
      "lineTotal",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productNameArSnapshot",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productNameEnSnapshot",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "packageNameArSnapshot",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "packageNameEnSnapshot",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "skuSnapshot",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "quantity",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "unitPrice",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "discountAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "taxRateSnapshot",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "taxAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "lineTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "bundleSnapshot",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productNameArSnapshot",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productNameEnSnapshot",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "packageNameArSnapshot",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "packageNameEnSnapshot",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "skuSnapshot",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "quantity",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "unitPrice",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "discountAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "taxRateSnapshot",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "taxAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "lineTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "bundleSnapshot",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productNameArSnapshot",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productNameEnSnapshot",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "packageNameArSnapshot",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "packageNameEnSnapshot",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "skuSnapshot",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "quantity",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "unitPrice",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "discountAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "taxRateSnapshot",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "taxAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "lineTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "bundleSnapshot",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "OrderStatusHistory",
    "folder": "orderStatusHistory",
    "route": "order-status-histories",
    "tag": "Orders",
    "description": "CRUD operations for OrderStatusHistory.",
    "publicRead": false,
    "appendOnly": true,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "orderId",
      "fromStatus",
      "toStatus",
      "changedByEmployeeId",
      "notes",
      "createdAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fromStatus",
        "type": "EOrderStatus",
        "kind": "enum",
        "isOptional": true,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "RECEIVED",
          "CONFIRMED",
          "PREPARING",
          "SHIPPED",
          "DELIVERED",
          "CANCELED",
          "FAILED_DELIVERY"
        ]
      },
      {
        "name": "toStatus",
        "type": "EOrderStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "RECEIVED",
          "CONFIRMED",
          "PREPARING",
          "SHIPPED",
          "DELIVERED",
          "CANCELED",
          "FAILED_DELIVERY"
        ]
      },
      {
        "name": "changedByEmployeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fromStatus",
        "type": "EOrderStatus",
        "kind": "enum",
        "isOptional": true,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "RECEIVED",
          "CONFIRMED",
          "PREPARING",
          "SHIPPED",
          "DELIVERED",
          "CANCELED",
          "FAILED_DELIVERY"
        ]
      },
      {
        "name": "toStatus",
        "type": "EOrderStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "RECEIVED",
          "CONFIRMED",
          "PREPARING",
          "SHIPPED",
          "DELIVERED",
          "CANCELED",
          "FAILED_DELIVERY"
        ]
      },
      {
        "name": "changedByEmployeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fromStatus",
        "type": "EOrderStatus",
        "kind": "enum",
        "isOptional": true,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "RECEIVED",
          "CONFIRMED",
          "PREPARING",
          "SHIPPED",
          "DELIVERED",
          "CANCELED",
          "FAILED_DELIVERY"
        ]
      },
      {
        "name": "toStatus",
        "type": "EOrderStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "RECEIVED",
          "CONFIRMED",
          "PREPARING",
          "SHIPPED",
          "DELIVERED",
          "CANCELED",
          "FAILED_DELIVERY"
        ]
      },
      {
        "name": "changedByEmployeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "OrderAddressSnapshot",
    "folder": "orderAddressSnapshot",
    "route": "order-address-snapshots",
    "tag": "Orders",
    "description": "CRUD operations for OrderAddressSnapshot.",
    "publicRead": false,
    "appendOnly": true,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "orderId",
      "recipientName",
      "phone",
      "governorate",
      "city",
      "district",
      "street",
      "building",
      "floor",
      "landmark",
      "latitude",
      "longitude",
      "sourceAddressId",
      "createdAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "recipientName",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "phone",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "governorate",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "city",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "district",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "street",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "building",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "floor",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "landmark",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "latitude",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "longitude",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sourceAddressId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "recipientName",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "phone",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "governorate",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "city",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "district",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "street",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "building",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "floor",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "landmark",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "latitude",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "longitude",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sourceAddressId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "recipientName",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "phone",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "governorate",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "city",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "district",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "street",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "building",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "floor",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "landmark",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "latitude",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "longitude",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sourceAddressId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "Invoice",
    "folder": "invoice",
    "route": "invoices",
    "tag": "Invoices",
    "description": "CRUD operations for Invoice.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "invoiceNumber",
      "orderId",
      "status",
      "issuedAt",
      "issuedByEmployeeId",
      "sellerName",
      "sellerTaxNumber",
      "customerName",
      "customerPhone",
      "customerEmail",
      "subtotal",
      "discountTotal",
      "shippingTotal",
      "taxTotal",
      "grandTotal",
      "taxRateSnapshot",
      "taxAmount",
      "notes",
      "voidedAt",
      "voidReason",
      "pdfUrl",
      "pdfGeneratedAt",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "invoiceNumber",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "EInvoiceStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "ISSUED",
          "VOID"
        ]
      },
      {
        "name": "issuedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "issuedByEmployeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sellerName",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sellerTaxNumber",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerName",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerPhone",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerEmail",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "addressSnapshot",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "subtotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "discountTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "shippingTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "taxTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "grandTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "taxRateSnapshot",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "taxAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "voidedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "voidReason",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "pdfUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "pdfGeneratedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "invoiceNumber",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "EInvoiceStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "ISSUED",
          "VOID"
        ]
      },
      {
        "name": "issuedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "issuedByEmployeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sellerName",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sellerTaxNumber",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerName",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerPhone",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerEmail",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "addressSnapshot",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "subtotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "discountTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "shippingTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "taxTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "grandTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "taxRateSnapshot",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "taxAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "voidedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "voidReason",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "pdfUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "pdfGeneratedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "invoiceNumber",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "EInvoiceStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "ISSUED",
          "VOID"
        ]
      },
      {
        "name": "issuedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "issuedByEmployeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sellerName",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sellerTaxNumber",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerName",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerPhone",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerEmail",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "addressSnapshot",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "subtotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "discountTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "shippingTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "taxTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "grandTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "taxRateSnapshot",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "taxAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "voidedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "voidReason",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "pdfUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "pdfGeneratedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "InvoiceLine",
    "folder": "invoiceLine",
    "route": "invoice-lines",
    "tag": "Invoices",
    "description": "CRUD operations for InvoiceLine.",
    "publicRead": false,
    "appendOnly": true,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "invoiceId",
      "orderItemId",
      "productPackageId",
      "descriptionAr",
      "descriptionEn",
      "sku",
      "quantity",
      "unitPrice",
      "discountAmount",
      "taxRate",
      "taxAmount",
      "lineTotal",
      "createdAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "invoiceId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderItemId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sku",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "quantity",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "unitPrice",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "discountAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "taxRate",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "taxAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "lineTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "invoiceId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderItemId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sku",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "quantity",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "unitPrice",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "discountAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "taxRate",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "taxAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "lineTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "invoiceId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderItemId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "descriptionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sku",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "quantity",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "unitPrice",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "discountAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "taxRate",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "taxAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "lineTotal",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "Payment",
    "folder": "payment",
    "route": "payments",
    "tag": "Payments",
    "description": "CRUD operations for Payment.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "orderId",
      "method",
      "status",
      "amount",
      "proofImageUrl",
      "proofUploadedAt",
      "confirmedAt",
      "confirmedByEmployeeId",
      "rejectionReason",
      "transactionReference",
      "notes",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "method",
        "type": "EPaymentMethod",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "ONLINE_TRANSFER",
          "COD"
        ]
      },
      {
        "name": "status",
        "type": "EPaymentStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "PENDING",
          "PROOF_UPLOADED",
          "CONFIRMED",
          "REJECTED",
          "CANCELED"
        ]
      },
      {
        "name": "amount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "proofImageUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "proofUploadedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "confirmedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "confirmedByEmployeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "rejectionReason",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "transactionReference",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "method",
        "type": "EPaymentMethod",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "ONLINE_TRANSFER",
          "COD"
        ]
      },
      {
        "name": "status",
        "type": "EPaymentStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "PENDING",
          "PROOF_UPLOADED",
          "CONFIRMED",
          "REJECTED",
          "CANCELED"
        ]
      },
      {
        "name": "amount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "proofImageUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "proofUploadedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "confirmedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "confirmedByEmployeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "rejectionReason",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "transactionReference",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "method",
        "type": "EPaymentMethod",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "ONLINE_TRANSFER",
          "COD"
        ]
      },
      {
        "name": "status",
        "type": "EPaymentStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "PENDING",
          "PROOF_UPLOADED",
          "CONFIRMED",
          "REJECTED",
          "CANCELED"
        ]
      },
      {
        "name": "amount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "proofImageUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "proofUploadedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "confirmedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "confirmedByEmployeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "rejectionReason",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "transactionReference",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "ShippingCarrier",
    "folder": "shippingCarrier",
    "route": "shipping-carriers",
    "tag": "Shipping",
    "description": "CRUD operations for ShippingCarrier.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "name",
      "code",
      "contactPerson",
      "phone",
      "email",
      "isActive",
      "supportsApi",
      "notes",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "name",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "code",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "contactPerson",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "phone",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "email",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "supportsApi",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "name",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "code",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "contactPerson",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "phone",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "email",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "supportsApi",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "name",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "code",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "contactPerson",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "phone",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "email",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "supportsApi",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "ShippingTariff",
    "folder": "shippingTariff",
    "route": "shipping-tariffs",
    "tag": "Shipping",
    "description": "CRUD operations for ShippingTariff.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "carrierId",
      "governorate",
      "city",
      "baseCost",
      "etaMinDays",
      "etaMaxDays",
      "isActive",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "carrierId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "governorate",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "city",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "baseCost",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "etaMinDays",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "etaMaxDays",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "carrierId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "governorate",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "city",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "baseCost",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "etaMinDays",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "etaMaxDays",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "carrierId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "governorate",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "city",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "baseCost",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "etaMinDays",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "etaMaxDays",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  },
  {
    "modelName": "Shipment",
    "folder": "shipment",
    "route": "shipments",
    "tag": "Shipping",
    "description": "CRUD operations for Shipment.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "shipmentNumber",
      "orderId",
      "carrierId",
      "trackingNumber",
      "status",
      "expectedCost",
      "actualCost",
      "codAmount",
      "codCollected",
      "codSettledAt",
      "codSettlementReference",
      "shippedAt",
      "deliveredAt",
      "etaMinDays",
      "etaMaxDays",
      "notes",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "shipmentNumber",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "carrierId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "trackingNumber",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "EShipmentStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "PENDING",
          "PREPARING",
          "PICKED_UP",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "FAILED",
          "CANCELED"
        ]
      },
      {
        "name": "expectedCost",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "actualCost",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "codAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "codCollected",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "codSettledAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "codSettlementReference",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "shippedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "deliveredAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "etaMinDays",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "etaMaxDays",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "shipmentNumber",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "carrierId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "trackingNumber",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "EShipmentStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "PENDING",
          "PREPARING",
          "PICKED_UP",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "FAILED",
          "CANCELED"
        ]
      },
      {
        "name": "expectedCost",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "actualCost",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "codAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "codCollected",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "codSettledAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "codSettlementReference",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "shippedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "deliveredAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "etaMinDays",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "etaMaxDays",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "shipmentNumber",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "carrierId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "trackingNumber",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "EShipmentStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "PENDING",
          "PREPARING",
          "PICKED_UP",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "FAILED",
          "CANCELED"
        ]
      },
      {
        "name": "expectedCost",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "actualCost",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "codAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "codCollected",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "codSettledAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "codSettlementReference",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "shippedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "deliveredAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "etaMinDays",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "etaMaxDays",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "ShipmentStatusHistory",
    "folder": "shipmentStatusHistory",
    "route": "shipment-status-histories",
    "tag": "Shipping",
    "description": "CRUD operations for ShipmentStatusHistory.",
    "publicRead": false,
    "appendOnly": true,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "shipmentId",
      "fromStatus",
      "toStatus",
      "changedByEmployeeId",
      "notes",
      "createdAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "shipmentId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fromStatus",
        "type": "EShipmentStatus",
        "kind": "enum",
        "isOptional": true,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "PENDING",
          "PREPARING",
          "PICKED_UP",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "FAILED",
          "CANCELED"
        ]
      },
      {
        "name": "toStatus",
        "type": "EShipmentStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "PENDING",
          "PREPARING",
          "PICKED_UP",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "FAILED",
          "CANCELED"
        ]
      },
      {
        "name": "changedByEmployeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "shipmentId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fromStatus",
        "type": "EShipmentStatus",
        "kind": "enum",
        "isOptional": true,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "PENDING",
          "PREPARING",
          "PICKED_UP",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "FAILED",
          "CANCELED"
        ]
      },
      {
        "name": "toStatus",
        "type": "EShipmentStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "PENDING",
          "PREPARING",
          "PICKED_UP",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "FAILED",
          "CANCELED"
        ]
      },
      {
        "name": "changedByEmployeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "shipmentId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fromStatus",
        "type": "EShipmentStatus",
        "kind": "enum",
        "isOptional": true,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "PENDING",
          "PREPARING",
          "PICKED_UP",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "FAILED",
          "CANCELED"
        ]
      },
      {
        "name": "toStatus",
        "type": "EShipmentStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "PENDING",
          "PREPARING",
          "PICKED_UP",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "FAILED",
          "CANCELED"
        ]
      },
      {
        "name": "changedByEmployeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "notes",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "Promotion",
    "folder": "promotion",
    "route": "promotions",
    "tag": "Promotions",
    "description": "CRUD operations for Promotion.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "name",
      "description",
      "promotionType",
      "discountType",
      "value",
      "maxDiscountAmount",
      "minOrderValue",
      "startsAt",
      "endsAt",
      "usageLimitTotal",
      "usageLimitPerCustomer",
      "allowOnDiscountedItems",
      "audienceMinOrders",
      "audienceMaxOrders",
      "audienceMinSpent",
      "isActive",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "name",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "description",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "promotionType",
        "type": "EPromotionType",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "PRODUCT_DISCOUNT",
          "CATEGORY_DISCOUNT",
          "STOREWIDE_DISCOUNT",
          "COUPON",
          "FREE_SHIPPING"
        ]
      },
      {
        "name": "discountType",
        "type": "EDiscountType",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "FIXED",
          "PERCENTAGE"
        ]
      },
      {
        "name": "value",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "maxDiscountAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "minOrderValue",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "startsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "endsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "usageLimitTotal",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "usageLimitPerCustomer",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "combinationRules",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "allowOnDiscountedItems",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "audienceMinOrders",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "audienceMaxOrders",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "audienceMinSpent",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "name",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "description",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "promotionType",
        "type": "EPromotionType",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "PRODUCT_DISCOUNT",
          "CATEGORY_DISCOUNT",
          "STOREWIDE_DISCOUNT",
          "COUPON",
          "FREE_SHIPPING"
        ]
      },
      {
        "name": "discountType",
        "type": "EDiscountType",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "FIXED",
          "PERCENTAGE"
        ]
      },
      {
        "name": "value",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "maxDiscountAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "minOrderValue",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "startsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "endsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "usageLimitTotal",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "usageLimitPerCustomer",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "combinationRules",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "allowOnDiscountedItems",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "audienceMinOrders",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "audienceMaxOrders",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "audienceMinSpent",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "name",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "description",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "promotionType",
        "type": "EPromotionType",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "PRODUCT_DISCOUNT",
          "CATEGORY_DISCOUNT",
          "STOREWIDE_DISCOUNT",
          "COUPON",
          "FREE_SHIPPING"
        ]
      },
      {
        "name": "discountType",
        "type": "EDiscountType",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "FIXED",
          "PERCENTAGE"
        ]
      },
      {
        "name": "value",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "maxDiscountAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "minOrderValue",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "startsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "endsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "usageLimitTotal",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "usageLimitPerCustomer",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "combinationRules",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "allowOnDiscountedItems",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "audienceMinOrders",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "audienceMaxOrders",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "audienceMinSpent",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  },
  {
    "modelName": "PromotionTarget",
    "folder": "promotionTarget",
    "route": "promotion-targets",
    "tag": "Promotions",
    "description": "CRUD operations for PromotionTarget.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "promotionId",
      "scope",
      "productId",
      "productPackageId",
      "categoryId",
      "subcategoryId",
      "createdAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "promotionId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "scope",
        "type": "EPromotionScope",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "ORDER",
          "PRODUCT",
          "PACKAGE",
          "CATEGORY",
          "SUBCATEGORY",
          "SHIPPING"
        ]
      },
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "categoryId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "subcategoryId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "promotionId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "scope",
        "type": "EPromotionScope",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "ORDER",
          "PRODUCT",
          "PACKAGE",
          "CATEGORY",
          "SUBCATEGORY",
          "SHIPPING"
        ]
      },
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "categoryId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "subcategoryId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "promotionId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "scope",
        "type": "EPromotionScope",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "ORDER",
          "PRODUCT",
          "PACKAGE",
          "CATEGORY",
          "SUBCATEGORY",
          "SHIPPING"
        ]
      },
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "categoryId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "subcategoryId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "Coupon",
    "folder": "coupon",
    "route": "coupons",
    "tag": "Promotions",
    "description": "CRUD operations for Coupon.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "promotionId",
      "code",
      "customerId",
      "usageLimit",
      "perCustomerLimit",
      "startsAt",
      "endsAt",
      "isActive",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "promotionId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "code",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "usageLimit",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "perCustomerLimit",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "startsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "endsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "promotionId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "code",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "usageLimit",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "perCustomerLimit",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "startsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "endsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "promotionId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "code",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "usageLimit",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "perCustomerLimit",
        "type": "Int",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "startsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "endsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  },
  {
    "modelName": "PromotionRedemption",
    "folder": "promotionRedemption",
    "route": "promotion-redemptions",
    "tag": "Promotions",
    "description": "CRUD operations for PromotionRedemption.",
    "publicRead": false,
    "appendOnly": true,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "promotionId",
      "couponId",
      "orderId",
      "orderItemId",
      "customerId",
      "discountAmount",
      "redeemedAt",
      "createdAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "promotionId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "couponId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderItemId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "discountAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "rulesSnapshot",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "redeemedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "promotionId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "couponId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderItemId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "discountAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "rulesSnapshot",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "redeemedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "promotionId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "couponId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderItemId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "discountAmount",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "rulesSnapshot",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "redeemedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  },
  {
    "modelName": "MarketingEvent",
    "folder": "marketingEvent",
    "route": "marketing-events",
    "tag": "Marketing",
    "description": "CRUD operations for MarketingEvent.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "eventName",
      "eventId",
      "customerId",
      "sessionId",
      "orderId",
      "productId",
      "productPackageId",
      "value",
      "searchString",
      "fbp",
      "fbc",
      "clientIp",
      "clientUserAgent",
      "eventSourceUrl",
      "status",
      "attempts",
      "lastError",
      "sentAt",
      "occurredAt",
      "createdAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "eventName",
        "type": "EMarketingEventName",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "VIEW_CONTENT",
          "SEARCH",
          "ADD_TO_CART",
          "INITIATE_CHECKOUT",
          "PURCHASE"
        ]
      },
      {
        "name": "eventId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sessionId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "value",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "contentIds",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "searchString",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fbp",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fbc",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "clientIp",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "clientUserAgent",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "eventSourceUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "hashedUserData",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "EMarketingEventStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "PENDING",
          "SENT",
          "FAILED",
          "SKIPPED"
        ]
      },
      {
        "name": "attempts",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "lastError",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sentAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "occurredAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "eventName",
        "type": "EMarketingEventName",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "VIEW_CONTENT",
          "SEARCH",
          "ADD_TO_CART",
          "INITIATE_CHECKOUT",
          "PURCHASE"
        ]
      },
      {
        "name": "eventId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sessionId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "value",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "contentIds",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "searchString",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fbp",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fbc",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "clientIp",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "clientUserAgent",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "eventSourceUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "hashedUserData",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "EMarketingEventStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "PENDING",
          "SENT",
          "FAILED",
          "SKIPPED"
        ]
      },
      {
        "name": "attempts",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "lastError",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sentAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "occurredAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "eventName",
        "type": "EMarketingEventName",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "VIEW_CONTENT",
          "SEARCH",
          "ADD_TO_CART",
          "INITIATE_CHECKOUT",
          "PURCHASE"
        ]
      },
      {
        "name": "eventId",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sessionId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "orderId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "productPackageId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "value",
        "type": "Decimal",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "contentIds",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "searchString",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fbp",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "fbc",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "clientIp",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "clientUserAgent",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "eventSourceUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "hashedUserData",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "EMarketingEventStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "PENDING",
          "SENT",
          "FAILED",
          "SKIPPED"
        ]
      },
      {
        "name": "attempts",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "lastError",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sentAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "occurredAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  },
  {
    "modelName": "Banner",
    "folder": "banner",
    "route": "banners",
    "tag": "Content",
    "description": "CRUD operations for Banner.",
    "publicRead": true,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "titleAr",
      "titleEn",
      "imageUrl",
      "mobileImageUrl",
      "linkUrl",
      "startsAt",
      "endsAt",
      "sortOrder",
      "isActive",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "titleAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "titleEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "imageUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "mobileImageUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "linkUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "startsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "endsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "titleAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "titleEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "imageUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "mobileImageUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "linkUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "startsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "endsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "titleAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "titleEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "imageUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "mobileImageUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "linkUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "startsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "endsAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  },
  {
    "modelName": "StaticPage",
    "folder": "staticPage",
    "route": "static-pages",
    "tag": "Content",
    "description": "CRUD operations for StaticPage.",
    "publicRead": true,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "slug",
      "titleAr",
      "titleEn",
      "bodyAr",
      "bodyEn",
      "status",
      "seoTitleAr",
      "seoTitleEn",
      "seoDescriptionAr",
      "seoDescriptionEn",
      "canonicalUrl",
      "publishedAt",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "slug",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "titleAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "titleEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "bodyAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "bodyEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "EContentStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "DRAFT",
          "PUBLISHED",
          "ARCHIVED"
        ]
      },
      {
        "name": "seoTitleAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "seoTitleEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "seoDescriptionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "seoDescriptionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "canonicalUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "publishedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "slug",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "titleAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "titleEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "bodyAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "bodyEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "EContentStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "DRAFT",
          "PUBLISHED",
          "ARCHIVED"
        ]
      },
      {
        "name": "seoTitleAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "seoTitleEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "seoDescriptionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "seoDescriptionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "canonicalUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "publishedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "slug",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "titleAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "titleEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "bodyAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "bodyEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "EContentStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "DRAFT",
          "PUBLISHED",
          "ARCHIVED"
        ]
      },
      {
        "name": "seoTitleAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "seoTitleEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "seoDescriptionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "seoDescriptionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "canonicalUrl",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "publishedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "Faq",
    "folder": "faq",
    "route": "faqs",
    "tag": "Content",
    "description": "CRUD operations for Faq.",
    "publicRead": true,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "questionAr",
      "questionEn",
      "answerAr",
      "answerEn",
      "category",
      "sortOrder",
      "isActive",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "questionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "questionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "answerAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "answerEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "category",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "questionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "questionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "answerAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "answerEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "category",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "questionAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "questionEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "answerAr",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "answerEn",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "category",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sortOrder",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  },
  {
    "modelName": "Notification",
    "folder": "notification",
    "route": "notifications",
    "tag": "Notifications",
    "description": "CRUD operations for Notification.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "recipientType",
      "customerId",
      "employeeId",
      "channel",
      "notificationType",
      "title",
      "body",
      "status",
      "idempotencyKey",
      "sentAt",
      "readAt",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "recipientType",
        "type": "ENotificationRecipientType",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "CUSTOMER",
          "EMPLOYEE"
        ]
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "employeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "channel",
        "type": "ENotificationChannel",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "EMAIL",
          "DASHBOARD",
          "WHATSAPP",
          "SMS"
        ]
      },
      {
        "name": "notificationType",
        "type": "ENotificationType",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "ORDER_CONFIRMATION",
          "ORDER_STATUS",
          "PAYMENT",
          "SHIPMENT",
          "SYSTEM"
        ]
      },
      {
        "name": "title",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "body",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "ENotificationStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "PENDING",
          "SENT",
          "FAILED",
          "READ",
          "CANCELED"
        ]
      },
      {
        "name": "idempotencyKey",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sentAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "readAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "metadata",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "recipientType",
        "type": "ENotificationRecipientType",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "CUSTOMER",
          "EMPLOYEE"
        ]
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "employeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "channel",
        "type": "ENotificationChannel",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "EMAIL",
          "DASHBOARD",
          "WHATSAPP",
          "SMS"
        ]
      },
      {
        "name": "notificationType",
        "type": "ENotificationType",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "ORDER_CONFIRMATION",
          "ORDER_STATUS",
          "PAYMENT",
          "SHIPMENT",
          "SYSTEM"
        ]
      },
      {
        "name": "title",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "body",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "ENotificationStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "PENDING",
          "SENT",
          "FAILED",
          "READ",
          "CANCELED"
        ]
      },
      {
        "name": "idempotencyKey",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sentAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "readAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "metadata",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "recipientType",
        "type": "ENotificationRecipientType",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "CUSTOMER",
          "EMPLOYEE"
        ]
      },
      {
        "name": "customerId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "employeeId",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "channel",
        "type": "ENotificationChannel",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "EMAIL",
          "DASHBOARD",
          "WHATSAPP",
          "SMS"
        ]
      },
      {
        "name": "notificationType",
        "type": "ENotificationType",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": false,
        "isId": false,
        "enumValues": [
          "ORDER_CONFIRMATION",
          "ORDER_STATUS",
          "PAYMENT",
          "SHIPMENT",
          "SYSTEM"
        ]
      },
      {
        "name": "title",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "body",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "status",
        "type": "ENotificationStatus",
        "kind": "enum",
        "isOptional": false,
        "hasDefault": true,
        "isId": false,
        "enumValues": [
          "PENDING",
          "SENT",
          "FAILED",
          "READ",
          "CANCELED"
        ]
      },
      {
        "name": "idempotencyKey",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "sentAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "readAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "metadata",
        "type": "Json",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "SystemSetting",
    "folder": "systemSetting",
    "route": "system-settings",
    "tag": "Settings",
    "description": "CRUD operations for SystemSetting.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "key",
      "description",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "key",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "value",
        "type": "Json",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "description",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "key",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "value",
        "type": "Json",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "description",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "key",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "value",
        "type": "Json",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "description",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      }
    ]
  },
  {
    "modelName": "DocumentSequence",
    "folder": "documentSequence",
    "route": "document-sequences",
    "tag": "Settings",
    "description": "CRUD operations for DocumentSequence.",
    "publicRead": false,
    "appendOnly": false,
    "passwordModel": false,
    "defaultSort": "createdAt",
    "sortFields": [
      "id",
      "documentType",
      "year",
      "prefix",
      "nextNumber",
      "padding",
      "createdAt",
      "updatedAt"
    ],
    "responseFields": [
      {
        "name": "id",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": true
      },
      {
        "name": "documentType",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "year",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "prefix",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nextNumber",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "padding",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "createdAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "updatedAt",
        "type": "DateTime",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      }
    ],
    "createFields": [
      {
        "name": "documentType",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "year",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "prefix",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nextNumber",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "padding",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ],
    "updateFields": [
      {
        "name": "documentType",
        "type": "String",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "year",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "prefix",
        "type": "String",
        "kind": "scalar",
        "isOptional": true,
        "hasDefault": false,
        "isId": false
      },
      {
        "name": "nextNumber",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      },
      {
        "name": "padding",
        "type": "Int",
        "kind": "scalar",
        "isOptional": false,
        "hasDefault": true,
        "isId": false
      }
    ]
  }
];
