import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.js";
const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: `${env.APP_NAME} API`,
            version: "1.0.0",
            description: "REST API for WorkTrack HR, a workforce management platform covering authentication, " +
                "users, departments, employees, shifts, attendance, uploaded files, and audit logs. " +
                "Successful responses follow `{ success, message, data?, meta? }`; " +
                "errors follow `{ success: false, message, code, details? }`.",
            contact: {
                name: "WorkTrack HR API Support",
                email: "support@worktrack.local",
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
                url: `http://localhost:${env.PORT}`,
                description: "Local development",
            },
        ],
        tags: [
            { name: "Health", description: "Service health and readiness" },
            { name: "Auth", description: "Registration, login, and session management" },
            { name: "Users", description: "User accounts and audit trail" },
            { name: "Employees", description: "Employee records and shift assignments" },
            { name: "Departments", description: "Organization structure" },
            { name: "Shifts", description: "Shift definitions and employee assignments" },
            { name: "Attendance", description: "Attendance logs and processed records" },
            { name: "Uploads", description: "Employee and attendance file imports" },
            { name: "Audit Logs", description: "System activity tracking" },
        ],
        security: [{ bearerAuth: [] }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "JWT returned by the authentication endpoints.",
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
                    description: "Resource identifier.",
                },
            },
            responses: {
                ValidationError: {
                    description: "Request validation failed.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: {
                                success: false,
                                message: "email: email must be a valid email address",
                                code: "VALIDATION_ERROR",
                                details: {
                                    errors: [
                                        { field: "email", message: "email must be a valid email address" },
                                    ],
                                },
                            },
                        },
                    },
                },
                Unauthorized: {
                    description: "Authentication is required or the token is invalid/expired.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: {
                                success: false,
                                message: "Authorization token is required",
                                code: "UNAUTHORIZED",
                            },
                        },
                    },
                },
                Forbidden: {
                    description: "The authenticated user does not have permission.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: {
                                success: false,
                                message: "You do not have permission to access this resource",
                                code: "FORBIDDEN",
                            },
                        },
                    },
                },
                NotFound: {
                    description: "Resource not found.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: {
                                success: false,
                                message: "Resource not found",
                                code: "NOT_FOUND",
                            },
                        },
                    },
                },
                Conflict: {
                    description: "The request conflicts with existing data.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: {
                                success: false,
                                message: "Resource already exists",
                                code: "CONFLICT",
                            },
                        },
                    },
                },
                InternalError: {
                    description: "Unexpected server error.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: {
                                success: false,
                                message: "Internal server error",
                                code: "INTERNAL_ERROR",
                            },
                        },
                    },
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
                            description: "Machine-readable code such as VALIDATION_ERROR, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT, or INTERNAL_ERROR.",
                        },
                        details: {
                            type: "object",
                            additionalProperties: true,
                            example: {
                                errors: [{ field: "email", message: "email must be a valid email address" }],
                            },
                        },
                    },
                },
                PaginationMeta: {
                    type: "object",
                    required: ["page", "limit", "total", "totalPages"],
                    properties: {
                        page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 20 },
                        total: { type: "integer", example: 42 },
                        totalPages: { type: "integer", example: 3 },
                    },
                },
                HealthResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        status: { type: "string", example: "ok" },
                        service: { type: "string", example: "worktrack-api" },
                        environment: { type: "string", example: "development" },
                        timestamp: { type: "string", format: "date-time" },
                    },
                },
                ERole: {
                    type: "string",
                    enum: ["ADMIN", "HR", "MANAGER"],
                    example: "HR",
                },
                EEmployeeStatus: {
                    type: "string",
                    enum: ["ACTIVE", "INACTIVE"],
                    example: "ACTIVE",
                },
                EAttendanceType: {
                    type: "string",
                    enum: ["CHECK_IN", "CHECK_OUT"],
                    example: "CHECK_IN",
                },
                EAttendanceSource: {
                    type: "string",
                    enum: ["MANUAL", "CSV", "SYSTEM"],
                    example: "MANUAL",
                },
                EAttendanceStatus: {
                    type: "string",
                    enum: ["PRESENT", "ABSENT", "LATE", "HALF_DAY", "ON_LEAVE"],
                    example: "PRESENT",
                },
                EUploadType: {
                    type: "string",
                    enum: ["EMPLOYEE_IMPORT", "ATTENDANCE_IMPORT"],
                    example: "EMPLOYEE_IMPORT",
                },
                User: {
                    type: "object",
                    required: ["id", "name", "email", "password", "role", "createdAt", "updatedAt"],
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "Mohamed Fadl" },
                        email: { type: "string", format: "email", example: "mohamed@worktrack.com" },
                        password: { type: "string", writeOnly: true, example: "$2b$12$..." },
                        role: { $ref: "#/components/schemas/ERole" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Department: {
                    type: "object",
                    required: ["id", "name", "createdAt", "updatedAt"],
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "Engineering" },
                        description: { type: "string", nullable: true, example: "Product engineering team" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Employee: {
                    type: "object",
                    required: [
                        "id",
                        "employeeCode",
                        "firstName",
                        "lastName",
                        "departmentId",
                        "status",
                        "hireDate",
                        "createdAt",
                        "updatedAt",
                    ],
                    properties: {
                        id: { type: "string", format: "uuid" },
                        employeeCode: { type: "string", example: "EMP-001" },
                        firstName: { type: "string", example: "Ahmed" },
                        lastName: { type: "string", example: "Mohamed" },
                        email: { type: "string", format: "email", nullable: true },
                        phone: { type: "string", nullable: true, example: "+201234567890" },
                        departmentId: { type: "string", format: "uuid" },
                        jobTitle: { type: "string", nullable: true, example: "Backend Engineer" },
                        status: { $ref: "#/components/schemas/EEmployeeStatus" },
                        hireDate: { type: "string", format: "date-time" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Shift: {
                    type: "object",
                    required: [
                        "id",
                        "name",
                        "startTime",
                        "endTime",
                        "graceMinutes",
                        "expectedHours",
                        "overtimeAfterMinutes",
                        "isNightShift",
                        "createdAt",
                        "updatedAt",
                    ],
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "Morning Shift" },
                        startTime: { type: "string", example: "09:00" },
                        endTime: { type: "string", example: "17:00" },
                        graceMinutes: { type: "integer", example: 15 },
                        expectedHours: { type: "number", format: "float", example: 8 },
                        overtimeAfterMinutes: { type: "integer", example: 0 },
                        isNightShift: { type: "boolean", example: false },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                EmployeeShift: {
                    type: "object",
                    required: ["id", "employeeId", "shiftId", "startDate", "isActive", "createdAt", "updatedAt"],
                    properties: {
                        id: { type: "string", format: "uuid" },
                        employeeId: { type: "string", format: "uuid" },
                        shiftId: { type: "string", format: "uuid" },
                        startDate: { type: "string", format: "date-time" },
                        endDate: { type: "string", format: "date-time", nullable: true },
                        isActive: { type: "boolean", example: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                AttendanceLog: {
                    type: "object",
                    required: ["id", "employeeId", "type", "timestamp", "source", "createdAt"],
                    properties: {
                        id: { type: "string", format: "uuid" },
                        employeeId: { type: "string", format: "uuid" },
                        type: { $ref: "#/components/schemas/EAttendanceType" },
                        timestamp: { type: "string", format: "date-time" },
                        source: { $ref: "#/components/schemas/EAttendanceSource" },
                        createdById: { type: "string", format: "uuid", nullable: true },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                AttendanceRecord: {
                    type: "object",
                    required: [
                        "id",
                        "employeeId",
                        "date",
                        "status",
                        "workingMinutes",
                        "lateMinutes",
                        "earlyLeaveMinutes",
                        "overtimeMinutes",
                        "createdAt",
                        "updatedAt",
                    ],
                    properties: {
                        id: { type: "string", format: "uuid" },
                        employeeId: { type: "string", format: "uuid" },
                        shiftId: { type: "string", format: "uuid", nullable: true },
                        date: { type: "string", format: "date-time" },
                        checkIn: { type: "string", format: "date-time", nullable: true },
                        checkOut: { type: "string", format: "date-time", nullable: true },
                        status: { $ref: "#/components/schemas/EAttendanceStatus" },
                        workingMinutes: { type: "integer", example: 480 },
                        lateMinutes: { type: "integer", example: 0 },
                        earlyLeaveMinutes: { type: "integer", example: 0 },
                        overtimeMinutes: { type: "integer", example: 30 },
                        notes: { type: "string", nullable: true },
                        processedAt: { type: "string", format: "date-time", nullable: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                UploadedFile: {
                    type: "object",
                    required: [
                        "id",
                        "fileName",
                        "originalName",
                        "type",
                        "uploadedById",
                        "totalRows",
                        "successRows",
                        "failedRows",
                        "createdAt",
                    ],
                    properties: {
                        id: { type: "string", format: "uuid" },
                        fileName: { type: "string", example: "employees-2026-11.csv" },
                        originalName: { type: "string", example: "employees.csv" },
                        type: { $ref: "#/components/schemas/EUploadType" },
                        uploadedById: { type: "string", format: "uuid" },
                        totalRows: { type: "integer", example: 120 },
                        successRows: { type: "integer", example: 118 },
                        failedRows: { type: "integer", example: 2 },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                AuditLog: {
                    type: "object",
                    required: ["id", "action", "entity", "createdAt"],
                    properties: {
                        id: { type: "string", format: "uuid" },
                        userId: { type: "string", format: "uuid", nullable: true },
                        action: { type: "string", example: "CREATE" },
                        entity: { type: "string", example: "Employee" },
                        entityId: { type: "string", nullable: true },
                        details: { type: "object", nullable: true, additionalProperties: true },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
            },
        },
        paths: {
            "/health": {
                get: {
                    tags: ["Health"],
                    summary: "Health check",
                    security: [],
                    responses: {
                        "200": {
                            description: "Service is running.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/HealthResponse" },
                                },
                            },
                        },
                    },
                },
            },
            "/": {
                get: {
                    tags: ["Health"],
                    summary: "API root",
                    security: [],
                    responses: {
                        "200": {
                            description: "API metadata.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "WorkTrack HR API - Ready" },
                                            version: { type: "string", example: "1.0.0" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    apis: [],
};
export const swaggerSpec = swaggerJsdoc(options);
//# sourceMappingURL=swagger.js.map