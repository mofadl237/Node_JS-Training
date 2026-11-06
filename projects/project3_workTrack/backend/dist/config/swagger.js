import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.js";
const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: `${env.APP_NAME} API`,
            version: "1.0.0",
            description: "REST API for WorkTrack HR, a workforce management platform covering authentication " +
                "with rotating refresh tokens, departments, employees, shifts, attendance, leaves, " +
                "uploads, dashboards, and audit logs. Successful responses follow " +
                "`{ success, message, data?, meta? }`; errors follow `{ success: false, message, code, details? }`.",
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
            { name: "Leaves", description: "Leave types, holidays, and recurring leave days" },
            { name: "Shifts", description: "Shift definitions and employee assignments" },
            { name: "Attendance", description: "Attendance logs and processed records" },
            { name: "Dashboard", description: "Dashboard summary and HR KPI reporting" },
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
                FileTooLarge: {
                    description: "The uploaded CSV file exceeds the maximum size.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: {
                                success: false,
                                message: "CSV file is too large. Maximum size is 5MB",
                                code: "FILE_TOO_LARGE",
                            },
                        },
                    },
                },
                TooManyRequests: {
                    description: "Too many requests. The client is rate limited.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: {
                                success: false,
                                message: "Too many login attempts. Please try again later.",
                                code: "RATE_LIMITED",
                                details: { retryAfter: 60 },
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
                            description: "Machine-readable code such as VALIDATION_ERROR, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT, RATE_LIMITED, MANAGER_DEPARTMENT_REQUIRED, REFRESH_TOKEN_REVOKED, or INTERNAL_ERROR.",
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
                    required: [
                        "page",
                        "limit",
                        "total",
                        "totalPages",
                        "hasNextPage",
                        "hasPreviousPage",
                    ],
                    properties: {
                        page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 20 },
                        total: { type: "integer", example: 42 },
                        totalPages: { type: "integer", example: 3 },
                        hasNextPage: { type: "boolean", example: true },
                        hasPreviousPage: { type: "boolean", example: false },
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
                AuthUser: {
                    type: "object",
                    required: [
                        "id",
                        "name",
                        "email",
                        "role",
                        "departmentId",
                        "createdAt",
                        "updatedAt",
                    ],
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "Mona Ibrahim" },
                        email: { type: "string", format: "email", example: "mona.hr@worktrack.com" },
                        role: { $ref: "#/components/schemas/ERole" },
                        departmentId: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                            description: "Assigned department. Required for MANAGER dashboard scoping.",
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                AuthResponse: {
                    type: "object",
                    required: [
                        "user",
                        "token",
                        "refreshToken",
                        "tokenType",
                        "expiresIn",
                        "refreshExpiresInDays",
                    ],
                    properties: {
                        user: { $ref: "#/components/schemas/AuthUser" },
                        token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        },
                        refreshToken: {
                            type: "string",
                            description: "Opaque refresh token. Store securely and send only to refresh/logout.",
                            example: "0f8fad5b-d9cb-469f-a165-70867728950e",
                        },
                        tokenType: { type: "string", enum: ["Bearer"], example: "Bearer" },
                        expiresIn: {
                            type: "string",
                            description: "Access token lifetime.",
                            example: "7d",
                        },
                        refreshExpiresInDays: {
                            type: "integer",
                            description: "Refresh token lifetime in days.",
                            example: 30,
                        },
                    },
                },
                RefreshTokenRequest: {
                    type: "object",
                    required: ["refreshToken"],
                    properties: {
                        refreshToken: {
                            type: "string",
                            minLength: 1,
                            example: "0f8fad5b-d9cb-469f-a165-70867728950e",
                        },
                    },
                },
                LogoutRequest: {
                    type: "object",
                    required: ["refreshToken"],
                    properties: {
                        refreshToken: {
                            type: "string",
                            minLength: 1,
                            example: "0f8fad5b-d9cb-469f-a165-70867728950e",
                        },
                    },
                },
                RegisterRequest: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: { type: "string", minLength: 2, maxLength: 50, example: "Mona Ibrahim" },
                        email: {
                            type: "string",
                            format: "email",
                            example: "mona.hr@worktrack.com",
                        },
                        password: {
                            type: "string",
                            minLength: 8,
                            maxLength: 128,
                            example: "Password123",
                            description: "Must contain at least one uppercase letter, one lowercase letter, and one number.",
                        },
                    },
                },
                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "mona.hr@worktrack.com",
                        },
                        password: { type: "string", example: "Password123" },
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
                ELeaveType: {
                    type: "string",
                    enum: [
                        "ANNUAL",
                        "SICK",
                        "UNPAID",
                        "ABSENCE",
                        "OFFICIAL_HOLIDAY",
                        "WEEKEND",
                        "CUSTOM",
                    ],
                    example: "OFFICIAL_HOLIDAY",
                },
                ELeaveScope: {
                    type: "string",
                    enum: ["ALL", "DEPARTMENT", "EMPLOYEE"],
                    example: "ALL",
                },
                ELeaveRecurrence: {
                    type: "string",
                    enum: ["NONE", "WEEKLY", "MONTHLY", "YEARLY"],
                    example: "NONE",
                },
                User: {
                    type: "object",
                    description: "Safe public user representation. Password hashes are never exposed.",
                    required: ["id", "name", "email", "role", "createdAt", "updatedAt"],
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "Mohamed Fadl" },
                        email: { type: "string", format: "email", example: "mohamed@worktrack.com" },
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
                        department: { $ref: "#/components/schemas/Department" },
                    },
                },
                EmployeeSummary: {
                    type: "object",
                    required: [
                        "id",
                        "employeeCode",
                        "firstName",
                        "lastName",
                        "departmentId",
                        "status",
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
                    },
                },
                DepartmentRequest: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: { type: "string", minLength: 2, maxLength: 100, example: "Engineering" },
                        description: {
                            type: "string",
                            maxLength: 500,
                            example: "Product engineering and platform teams",
                        },
                    },
                },
                UpdateDepartmentRequest: {
                    type: "object",
                    properties: {
                        name: { type: "string", minLength: 2, maxLength: 100, example: "Engineering" },
                        description: {
                            type: "string",
                            nullable: true,
                            maxLength: 500,
                            example: "Product engineering and platform teams",
                        },
                    },
                },
                EmployeeRequest: {
                    type: "object",
                    required: ["employeeCode", "firstName", "lastName", "departmentId", "hireDate"],
                    properties: {
                        employeeCode: { type: "string", maxLength: 50, example: "EMP-011" },
                        firstName: { type: "string", maxLength: 100, example: "Ahmed" },
                        lastName: { type: "string", maxLength: 100, example: "Mohamed" },
                        email: {
                            type: "string",
                            format: "email",
                            nullable: true,
                            example: "ahmed.mohamed@worktrack.com",
                        },
                        phone: {
                            type: "string",
                            nullable: true,
                            example: "+201001234567",
                            description: "Optional phone number with 7 to 20 digits.",
                        },
                        departmentId: { type: "string", format: "uuid" },
                        jobTitle: { type: "string", nullable: true, maxLength: 100, example: "Backend Engineer" },
                        status: { $ref: "#/components/schemas/EEmployeeStatus" },
                        hireDate: { type: "string", format: "date-time", example: "2026-01-15T00:00:00.000Z" },
                    },
                },
                UpdateEmployeeRequest: {
                    type: "object",
                    properties: {
                        employeeCode: { type: "string", maxLength: 50, example: "EMP-011" },
                        firstName: { type: "string", maxLength: 100, example: "Ahmed" },
                        lastName: { type: "string", maxLength: 100, example: "Mohamed" },
                        email: {
                            type: "string",
                            format: "email",
                            nullable: true,
                            example: "ahmed.mohamed@worktrack.com",
                        },
                        phone: { type: "string", nullable: true, example: "+201001234567" },
                        departmentId: { type: "string", format: "uuid" },
                        jobTitle: { type: "string", nullable: true, maxLength: 100, example: "Backend Engineer" },
                        status: { $ref: "#/components/schemas/EEmployeeStatus" },
                        hireDate: { type: "string", format: "date-time", example: "2026-01-15T00:00:00.000Z" },
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
                        employee: { $ref: "#/components/schemas/EmployeeSummary" },
                        shift: { $ref: "#/components/schemas/Shift" },
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
                        employee: { $ref: "#/components/schemas/EmployeeSummary" },
                        createdBy: {
                            allOf: [{ $ref: "#/components/schemas/UserSummary" }],
                            nullable: true,
                        },
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
                        employee: { $ref: "#/components/schemas/EmployeeSummary" },
                        shift: {
                            allOf: [{ $ref: "#/components/schemas/Shift" }],
                            nullable: true,
                        },
                    },
                },
                ShiftRequest: {
                    type: "object",
                    required: ["name", "startTime", "endTime"],
                    properties: {
                        name: { type: "string", minLength: 2, maxLength: 100, example: "Morning Shift" },
                        startTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$", example: "09:00" },
                        endTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$", example: "17:00" },
                        graceMinutes: { type: "integer", minimum: 0, maximum: 1440, example: 15 },
                        expectedHours: { type: "number", format: "float", minimum: 0, maximum: 24, example: 8 },
                        overtimeAfterMinutes: { type: "integer", minimum: 0, maximum: 1440, example: 0 },
                        isNightShift: { type: "boolean", example: false },
                    },
                },
                UpdateShiftRequest: {
                    type: "object",
                    properties: {
                        name: { type: "string", minLength: 2, maxLength: 100, example: "Morning Shift" },
                        startTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$", example: "09:00" },
                        endTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$", example: "17:00" },
                        graceMinutes: { type: "integer", minimum: 0, maximum: 1440, example: 15 },
                        expectedHours: { type: "number", format: "float", minimum: 0, maximum: 24, example: 8 },
                        overtimeAfterMinutes: { type: "integer", minimum: 0, maximum: 1440, example: 0 },
                        isNightShift: { type: "boolean", example: false },
                    },
                },
                EmployeeShiftRequest: {
                    type: "object",
                    required: ["employeeId", "shiftId", "startDate"],
                    properties: {
                        employeeId: { type: "string", format: "uuid" },
                        shiftId: { type: "string", format: "uuid" },
                        startDate: { type: "string", format: "date-time", example: "2026-02-01T00:00:00.000Z" },
                        endDate: { type: "string", format: "date-time", nullable: true, example: null },
                        isActive: { type: "boolean", example: true },
                    },
                },
                UpdateEmployeeShiftRequest: {
                    type: "object",
                    properties: {
                        employeeId: { type: "string", format: "uuid" },
                        shiftId: { type: "string", format: "uuid" },
                        startDate: { type: "string", format: "date-time", example: "2026-02-01T00:00:00.000Z" },
                        endDate: { type: "string", format: "date-time", nullable: true, example: null },
                        isActive: { type: "boolean", example: true },
                    },
                },
                AttendanceLogRequest: {
                    type: "object",
                    required: ["employeeId", "type", "timestamp"],
                    properties: {
                        employeeId: { type: "string", format: "uuid" },
                        type: { $ref: "#/components/schemas/EAttendanceType" },
                        timestamp: { type: "string", format: "date-time", example: "2026-02-01T09:03:00.000Z" },
                        source: { $ref: "#/components/schemas/EAttendanceSource" },
                    },
                },
                AttendanceRecordRequest: {
                    type: "object",
                    required: ["employeeId", "date"],
                    properties: {
                        employeeId: { type: "string", format: "uuid" },
                        shiftId: { type: "string", format: "uuid", nullable: true },
                        date: { type: "string", format: "date-time", example: "2026-02-01T00:00:00.000Z" },
                        checkIn: { type: "string", format: "date-time", nullable: true },
                        checkOut: { type: "string", format: "date-time", nullable: true },
                        status: { $ref: "#/components/schemas/EAttendanceStatus" },
                        workingMinutes: { type: "integer", minimum: 0, maximum: 10080, example: 480 },
                        lateMinutes: { type: "integer", minimum: 0, maximum: 10080, example: 0 },
                        earlyLeaveMinutes: { type: "integer", minimum: 0, maximum: 10080, example: 0 },
                        overtimeMinutes: { type: "integer", minimum: 0, maximum: 10080, example: 30 },
                        notes: { type: "string", maxLength: 1000, nullable: true },
                        processedAt: { type: "string", format: "date-time", nullable: true },
                    },
                },
                UpdateAttendanceRecordRequest: {
                    type: "object",
                    properties: {
                        employeeId: { type: "string", format: "uuid" },
                        shiftId: { type: "string", format: "uuid", nullable: true },
                        date: { type: "string", format: "date-time", example: "2026-02-01T00:00:00.000Z" },
                        checkIn: { type: "string", format: "date-time", nullable: true },
                        checkOut: { type: "string", format: "date-time", nullable: true },
                        status: { $ref: "#/components/schemas/EAttendanceStatus" },
                        workingMinutes: { type: "integer", minimum: 0, maximum: 10080, example: 480 },
                        lateMinutes: { type: "integer", minimum: 0, maximum: 10080, example: 0 },
                        earlyLeaveMinutes: { type: "integer", minimum: 0, maximum: 10080, example: 0 },
                        overtimeMinutes: { type: "integer", minimum: 0, maximum: 10080, example: 30 },
                        notes: { type: "string", maxLength: 1000, nullable: true },
                        processedAt: { type: "string", format: "date-time", nullable: true },
                    },
                },
                ProcessAttendanceRequest: {
                    type: "object",
                    properties: {
                        date: {
                            type: "string",
                            format: "date",
                            example: "2026-02-01",
                            description: "Process a single day. Cannot be combined with from/to.",
                        },
                        from: {
                            type: "string",
                            format: "date",
                            example: "2026-02-01",
                            description: "Start date (inclusive) when processing a range.",
                        },
                        to: {
                            type: "string",
                            format: "date",
                            example: "2026-02-07",
                            description: "End date (inclusive) when processing a range. Maximum 31 days.",
                        },
                        employeeIds: {
                            type: "array",
                            maxItems: 500,
                            items: { type: "string", format: "uuid" },
                            description: "Optional employee filter. Omit to process all employees with an active shift.",
                        },
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
                        uploadedBy: { $ref: "#/components/schemas/UserSummary" },
                    },
                },
                UploadImportResult: {
                    type: "object",
                    required: ["upload", "errors"],
                    properties: {
                        upload: { $ref: "#/components/schemas/UploadedFile" },
                        errors: {
                            type: "array",
                            description: "Rows that failed validation or database constraints.",
                            items: {
                                type: "object",
                                required: ["row", "message"],
                                properties: {
                                    row: { type: "integer", example: 4 },
                                    employeeCode: { type: "string", nullable: true, example: "EMP-099" },
                                    message: { type: "string", example: "employeeCode is required" },
                                },
                            },
                        },
                    },
                },
                UserSummary: {
                    type: "object",
                    required: ["id", "name", "email", "role", "departmentId"],
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "Mona Ibrahim" },
                        email: { type: "string", format: "email", example: "mona.hr@worktrack.com" },
                        role: { $ref: "#/components/schemas/ERole" },
                        departmentId: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                        },
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
                        user: {
                            allOf: [{ $ref: "#/components/schemas/UserSummary" }],
                            nullable: true,
                        },
                    },
                },
                AuditLogRequest: {
                    type: "object",
                    required: ["action", "entity"],
                    properties: {
                        action: { type: "string", maxLength: 50, example: "CREATE" },
                        entity: { type: "string", maxLength: 100, example: "Employee" },
                        entityId: {
                            type: "string",
                            maxLength: 100,
                            nullable: true,
                            example: "8b6c2b9e-4b1a-4a6e-9c3e-3f1d2a7b5c10",
                        },
                        userId: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                            description: "Defaults to the authenticated user when omitted.",
                        },
                        details: {
                            type: "object",
                            nullable: true,
                            additionalProperties: true,
                            example: { employeeCode: "EMP-001", department: "Engineering" },
                        },
                    },
                },
                LeaveEmployeeSummary: {
                    type: "object",
                    required: ["id", "employeeCode", "firstName", "lastName", "departmentId"],
                    properties: {
                        id: { type: "string", format: "uuid" },
                        employeeCode: { type: "string", example: "EMP-001" },
                        firstName: { type: "string", example: "Ahmed" },
                        lastName: { type: "string", example: "Ali" },
                        email: { type: "string", format: "email", nullable: true },
                        departmentId: { type: "string", format: "uuid" },
                        jobTitle: { type: "string", nullable: true, example: "Backend Engineer" },
                    },
                },
                LeaveDepartmentSummary: {
                    type: "object",
                    required: ["id", "name"],
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "Engineering" },
                    },
                },
                Leave: {
                    type: "object",
                    required: [
                        "id",
                        "name",
                        "type",
                        "scope",
                        "startDate",
                        "isPaid",
                        "isDeductible",
                        "isActive",
                        "recurrence",
                        "createdAt",
                        "updatedAt",
                    ],
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "Eid Holiday" },
                        description: { type: "string", nullable: true },
                        type: { $ref: "#/components/schemas/ELeaveType" },
                        scope: { $ref: "#/components/schemas/ELeaveScope" },
                        employeeId: { type: "string", format: "uuid", nullable: true },
                        departmentId: { type: "string", format: "uuid", nullable: true },
                        startDate: { type: "string", format: "date-time", example: "2026-01-01T00:00:00.000Z" },
                        endDate: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                            description: "For NONE it is the leave end date. For recurring leaves it is the end of the recurrence window; null means indefinite.",
                        },
                        isPaid: { type: "boolean", example: true },
                        isDeductible: {
                            type: "boolean",
                            example: false,
                            description: "False means the day is not deducted from attendance/payroll.",
                        },
                        isActive: { type: "boolean", example: true },
                        recurrence: { $ref: "#/components/schemas/ELeaveRecurrence" },
                        recurrenceDayOfWeek: {
                            type: "integer",
                            minimum: 0,
                            maximum: 6,
                            nullable: true,
                            description: "Weekly recurrence day. 0 = Sunday, 6 = Saturday.",
                        },
                        recurrenceDayOfMonth: {
                            type: "integer",
                            minimum: 1,
                            maximum: 31,
                            nullable: true,
                        },
                        recurrenceMonth: { type: "integer", minimum: 1, maximum: 12, nullable: true },
                        recurrenceDay: { type: "integer", minimum: 1, maximum: 31, nullable: true },
                        createdById: { type: "string", format: "uuid", nullable: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        employee: {
                            allOf: [{ $ref: "#/components/schemas/LeaveEmployeeSummary" }],
                            nullable: true,
                        },
                        department: {
                            allOf: [{ $ref: "#/components/schemas/LeaveDepartmentSummary" }],
                            nullable: true,
                        },
                        createdBy: {
                            allOf: [{ $ref: "#/components/schemas/UserSummary" }],
                            nullable: true,
                        },
                    },
                },
                LeaveRequest: {
                    type: "object",
                    required: ["name", "type", "startDate"],
                    properties: {
                        name: { type: "string", minLength: 2, maxLength: 100, example: "Eid Holiday" },
                        description: { type: "string", maxLength: 500, nullable: true },
                        type: { $ref: "#/components/schemas/ELeaveType" },
                        scope: {
                            allOf: [{ $ref: "#/components/schemas/ELeaveScope" }],
                            default: "ALL",
                        },
                        employeeId: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                            description: "Required when scope is EMPLOYEE.",
                        },
                        departmentId: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                            description: "Required when scope is DEPARTMENT.",
                        },
                        startDate: { type: "string", format: "date-time", example: "2026-01-01T00:00:00.000Z" },
                        endDate: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                            description: "For NONE it defaults to startDate. For recurring leaves null means indefinite.",
                        },
                        isPaid: { type: "boolean", default: true },
                        isDeductible: { type: "boolean", default: false },
                        isActive: { type: "boolean", default: true },
                        recurrence: {
                            allOf: [{ $ref: "#/components/schemas/ELeaveRecurrence" }],
                            default: "NONE",
                        },
                        recurrenceDayOfWeek: {
                            type: "integer",
                            minimum: 0,
                            maximum: 6,
                            nullable: true,
                            description: "Defaults to the weekday of startDate for WEEKLY.",
                        },
                        recurrenceDayOfMonth: {
                            type: "integer",
                            minimum: 1,
                            maximum: 31,
                            nullable: true,
                            description: "Defaults to the day of startDate for MONTHLY.",
                        },
                        recurrenceMonth: {
                            type: "integer",
                            minimum: 1,
                            maximum: 12,
                            nullable: true,
                            description: "Defaults to the month of startDate for YEARLY.",
                        },
                        recurrenceDay: {
                            type: "integer",
                            minimum: 1,
                            maximum: 31,
                            nullable: true,
                            description: "Defaults to the day of startDate for YEARLY.",
                        },
                    },
                },
                UpdateLeaveRequest: {
                    type: "object",
                    properties: {
                        name: { type: "string", minLength: 2, maxLength: 100 },
                        description: { type: "string", maxLength: 500, nullable: true },
                        type: { $ref: "#/components/schemas/ELeaveType" },
                        scope: { $ref: "#/components/schemas/ELeaveScope" },
                        employeeId: { type: "string", format: "uuid", nullable: true },
                        departmentId: { type: "string", format: "uuid", nullable: true },
                        startDate: { type: "string", format: "date-time" },
                        endDate: { type: "string", format: "date-time", nullable: true },
                        isPaid: { type: "boolean" },
                        isDeductible: { type: "boolean" },
                        isActive: { type: "boolean" },
                        recurrence: { $ref: "#/components/schemas/ELeaveRecurrence" },
                        recurrenceDayOfWeek: { type: "integer", minimum: 0, maximum: 6, nullable: true },
                        recurrenceDayOfMonth: { type: "integer", minimum: 1, maximum: 31, nullable: true },
                        recurrenceMonth: { type: "integer", minimum: 1, maximum: 12, nullable: true },
                        recurrenceDay: { type: "integer", minimum: 1, maximum: 31, nullable: true },
                    },
                },
                LeaveOccurrence: {
                    type: "object",
                    required: ["date", "leave"],
                    properties: {
                        date: { type: "string", format: "date", example: "2026-01-01" },
                        leave: {
                            type: "object",
                            required: ["id", "name", "type", "scope", "isPaid", "isDeductible"],
                            properties: {
                                id: { type: "string", format: "uuid" },
                                name: { type: "string", example: "Eid Holiday" },
                                type: { $ref: "#/components/schemas/ELeaveType" },
                                scope: { $ref: "#/components/schemas/ELeaveScope" },
                                isPaid: { type: "boolean" },
                                isDeductible: { type: "boolean" },
                            },
                        },
                    },
                },
                LeaveCalendar: {
                    type: "object",
                    required: ["from", "to", "totalDays", "days"],
                    properties: {
                        from: { type: "string", format: "date", example: "2026-01-01" },
                        to: { type: "string", format: "date", example: "2026-01-31" },
                        employeeId: { type: "string", format: "uuid", nullable: true },
                        departmentId: { type: "string", format: "uuid", nullable: true },
                        totalDays: { type: "integer", example: 5 },
                        days: {
                            type: "array",
                            items: { $ref: "#/components/schemas/LeaveOccurrence" },
                        },
                    },
                },
                LeaveCheckResult: {
                    type: "object",
                    required: ["date", "isLeaveDay", "isPaid", "isDeductible", "leaves"],
                    properties: {
                        date: { type: "string", format: "date", example: "2026-01-01" },
                        isLeaveDay: { type: "boolean", example: true },
                        isPaid: { type: "boolean", example: true },
                        isDeductible: {
                            type: "boolean",
                            example: false,
                            description: "True when at least one matching leave is deductible.",
                        },
                        leaves: {
                            type: "array",
                            items: {
                                type: "object",
                                required: ["id", "name", "type", "scope", "isPaid", "isDeductible"],
                                properties: {
                                    id: { type: "string", format: "uuid" },
                                    name: { type: "string" },
                                    type: { $ref: "#/components/schemas/ELeaveType" },
                                    scope: { $ref: "#/components/schemas/ELeaveScope" },
                                    isPaid: { type: "boolean" },
                                    isDeductible: { type: "boolean" },
                                },
                            },
                        },
                    },
                },
                AttendanceStats: {
                    type: "object",
                    required: [
                        "totalRecords",
                        "present",
                        "late",
                        "absent",
                        "halfDay",
                        "onLeave",
                        "attendanceRate",
                        "absenceRate",
                        "lateRate",
                        "averageWorkingMinutes",
                        "totalWorkingMinutes",
                        "totalOvertimeMinutes",
                        "totalLateMinutes",
                        "totalEarlyLeaveMinutes",
                    ],
                    properties: {
                        totalRecords: { type: "integer", example: 120 },
                        present: { type: "integer", example: 95 },
                        late: { type: "integer", example: 12 },
                        absent: { type: "integer", example: 8 },
                        halfDay: { type: "integer", example: 2 },
                        onLeave: { type: "integer", example: 3 },
                        attendanceRate: {
                            type: "number",
                            format: "float",
                            example: 90.83,
                            description: "Percentage of attended records (present + late + half day).",
                        },
                        absenceRate: { type: "number", format: "float", example: 6.67 },
                        lateRate: { type: "number", format: "float", example: 10 },
                        averageWorkingMinutes: { type: "integer", example: 468 },
                        totalWorkingMinutes: { type: "integer", example: 51012 },
                        totalOvertimeMinutes: { type: "integer", example: 320 },
                        totalLateMinutes: { type: "integer", example: 210 },
                        totalEarlyLeaveMinutes: { type: "integer", example: 90 },
                    },
                },
                DashboardTrendPoint: {
                    type: "object",
                    required: [
                        "date",
                        "totalRecords",
                        "present",
                        "late",
                        "absent",
                        "halfDay",
                        "onLeave",
                        "attendanceRate",
                    ],
                    properties: {
                        date: { type: "string", format: "date", example: "2026-11-01" },
                        totalRecords: { type: "integer", example: 20 },
                        present: { type: "integer", example: 16 },
                        late: { type: "integer", example: 2 },
                        absent: { type: "integer", example: 1 },
                        halfDay: { type: "integer", example: 0 },
                        onLeave: { type: "integer", example: 1 },
                        attendanceRate: { type: "number", format: "float", example: 90 },
                    },
                },
                DashboardWorkforce: {
                    type: "object",
                    required: [
                        "totalEmployees",
                        "activeEmployees",
                        "inactiveEmployees",
                        "totalDepartments",
                        "totalShifts",
                    ],
                    properties: {
                        totalEmployees: { type: "integer", example: 40 },
                        activeEmployees: { type: "integer", example: 36 },
                        inactiveEmployees: { type: "integer", example: 4 },
                        totalDepartments: { type: "integer", example: 6 },
                        totalShifts: { type: "integer", example: 3 },
                    },
                },
                DepartmentKpi: {
                    allOf: [
                        { $ref: "#/components/schemas/AttendanceStats" },
                        {
                            type: "object",
                            required: ["departmentId", "departmentName", "employees"],
                            properties: {
                                departmentId: { type: "string", format: "uuid" },
                                departmentName: { type: "string", example: "Engineering" },
                                employees: { type: "integer", example: 12 },
                            },
                        },
                    ],
                },
                TopLateEmployee: {
                    type: "object",
                    required: [
                        "employeeId",
                        "employeeCode",
                        "employeeName",
                        "departmentId",
                        "departmentName",
                        "lateDays",
                        "lateMinutes",
                        "absentDays",
                    ],
                    properties: {
                        employeeId: { type: "string", format: "uuid" },
                        employeeCode: { type: "string", example: "EMP-001" },
                        employeeName: { type: "string", example: "Ahmed Mohamed" },
                        departmentId: { type: "string", format: "uuid" },
                        departmentName: { type: "string", example: "Engineering" },
                        lateDays: { type: "integer", example: 4 },
                        lateMinutes: { type: "integer", example: 85 },
                        absentDays: { type: "integer", example: 1 },
                    },
                },
                DashboardSummary: {
                    type: "object",
                    required: [
                        "generatedAt",
                        "period",
                        "filters",
                        "workforce",
                        "attendance",
                        "today",
                        "leaves",
                        "trend",
                        "recentAuditLogs",
                    ],
                    properties: {
                        generatedAt: { type: "string", format: "date-time" },
                        period: {
                            type: "object",
                            required: ["from", "to"],
                            properties: {
                                from: { type: "string", format: "date", example: "2026-11-01" },
                                to: { type: "string", format: "date", example: "2026-11-06" },
                            },
                        },
                        filters: {
                            type: "object",
                            required: ["departmentId", "employeeId"],
                            properties: {
                                departmentId: { type: "string", format: "uuid", nullable: true },
                                employeeId: { type: "string", format: "uuid", nullable: true },
                            },
                        },
                        workforce: { $ref: "#/components/schemas/DashboardWorkforce" },
                        attendance: { $ref: "#/components/schemas/AttendanceStats" },
                        today: {
                            allOf: [
                                { $ref: "#/components/schemas/AttendanceStats" },
                                {
                                    type: "object",
                                    required: ["date"],
                                    properties: {
                                        date: { type: "string", format: "date", example: "2026-11-06" },
                                    },
                                },
                            ],
                        },
                        leaves: {
                            type: "object",
                            required: ["activeLeaves", "todayLeaves"],
                            properties: {
                                activeLeaves: { type: "integer", example: 5 },
                                todayLeaves: {
                                    type: "integer",
                                    example: 2,
                                    description: "Leave occurrences matching the current business day.",
                                },
                            },
                        },
                        trend: {
                            type: "array",
                            items: { $ref: "#/components/schemas/DashboardTrendPoint" },
                        },
                        recentAuditLogs: {
                            type: "array",
                            items: { $ref: "#/components/schemas/AuditLog" },
                        },
                    },
                },
                HrKpiReport: {
                    type: "object",
                    required: [
                        "generatedAt",
                        "period",
                        "filters",
                        "workforce",
                        "totals",
                        "byDepartment",
                        "topLateEmployees",
                        "trend",
                        "leaves",
                    ],
                    properties: {
                        generatedAt: { type: "string", format: "date-time" },
                        period: {
                            type: "object",
                            required: ["from", "to"],
                            properties: {
                                from: { type: "string", format: "date", example: "2026-11-01" },
                                to: { type: "string", format: "date", example: "2026-11-06" },
                            },
                        },
                        filters: {
                            type: "object",
                            required: ["departmentId", "employeeId"],
                            properties: {
                                departmentId: { type: "string", format: "uuid", nullable: true },
                                employeeId: { type: "string", format: "uuid", nullable: true },
                            },
                        },
                        workforce: { $ref: "#/components/schemas/DashboardWorkforce" },
                        totals: { $ref: "#/components/schemas/AttendanceStats" },
                        byDepartment: {
                            type: "array",
                            items: { $ref: "#/components/schemas/DepartmentKpi" },
                        },
                        topLateEmployees: {
                            type: "array",
                            items: { $ref: "#/components/schemas/TopLateEmployee" },
                        },
                        trend: {
                            type: "array",
                            items: { $ref: "#/components/schemas/DashboardTrendPoint" },
                        },
                        leaves: {
                            type: "object",
                            required: ["activeLeaves"],
                            properties: {
                                activeLeaves: { type: "integer", example: 5 },
                            },
                        },
                    },
                },
            },
        },
        paths: {
            "/api/auth/register": {
                post: {
                    tags: ["Auth"],
                    summary: "Register a new user",
                    description: "Creates a user account with the default HR role. Roles cannot be selected during public registration.",
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/RegisterRequest" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "User registered successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "User registered successfully" },
                                            data: { $ref: "#/components/schemas/AuthResponse" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "409": { $ref: "#/components/responses/Conflict" },
                        "429": { $ref: "#/components/responses/TooManyRequests" },
                    },
                },
            },
            "/api/auth/login": {
                post: {
                    tags: ["Auth"],
                    summary: "Login",
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/LoginRequest" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Login successful.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Login successful" },
                                            data: { $ref: "#/components/schemas/AuthResponse" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "429": { $ref: "#/components/responses/TooManyRequests" },
                    },
                },
            },
            "/api/auth/refresh": {
                post: {
                    tags: ["Auth"],
                    summary: "Rotate a refresh token",
                    description: "Exchanges a valid refresh token for a new access token and a new refresh token. The old refresh token is revoked. Reusing a revoked token revokes all of the user's refresh tokens.",
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/RefreshTokenRequest" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Tokens refreshed successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Token refreshed successfully" },
                                            data: { $ref: "#/components/schemas/AuthResponse" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "429": { $ref: "#/components/responses/TooManyRequests" },
                    },
                },
            },
            "/api/auth/logout": {
                post: {
                    tags: ["Auth"],
                    summary: "Logout",
                    description: "Revokes the supplied refresh token.",
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/LogoutRequest" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Logged out successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Logged out successfully" },
                                            data: { type: "object", nullable: true, example: null },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "429": { $ref: "#/components/responses/TooManyRequests" },
                    },
                },
            },
            "/api/auth/me": {
                get: {
                    tags: ["Auth"],
                    summary: "Get the authenticated user",
                    responses: {
                        "200": {
                            description: "Authenticated user profile.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Profile retrieved successfully" },
                                            data: { $ref: "#/components/schemas/AuthUser" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/audit-logs": {
                get: {
                    tags: ["Audit Logs"],
                    summary: "List audit logs",
                    parameters: [
                        { $ref: "#/components/parameters/Page" },
                        { $ref: "#/components/parameters/Limit" },
                        {
                            name: "q",
                            in: "query",
                            schema: { type: "string" },
                            description: "Search by action, entity, or entity id.",
                        },
                        {
                            name: "userId",
                            in: "query",
                            schema: { type: "string", format: "uuid" },
                            description: "Filter by the user who performed the action.",
                        },
                        {
                            name: "action",
                            in: "query",
                            schema: { type: "string" },
                            description: "Filter by action (case-insensitive).",
                        },
                        {
                            name: "entity",
                            in: "query",
                            schema: { type: "string" },
                            description: "Filter by entity (case-insensitive).",
                        },
                        {
                            name: "entityId",
                            in: "query",
                            schema: { type: "string" },
                            description: "Filter by the affected entity id.",
                        },
                        {
                            name: "from",
                            in: "query",
                            schema: { type: "string", format: "date-time" },
                            description: "Include logs created at or after this date.",
                        },
                        {
                            name: "to",
                            in: "query",
                            schema: { type: "string", format: "date-time" },
                            description: "Include logs created at or before this date.",
                        },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: ["createdAt", "action", "entity"],
                                default: "createdAt",
                            },
                        },
                        {
                            name: "sortOrder",
                            in: "query",
                            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Audit logs fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data", "meta"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Audit logs fetched successfully" },
                                            data: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/AuditLog" },
                                            },
                                            meta: { $ref: "#/components/schemas/PaginationMeta" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                    },
                },
                post: {
                    tags: ["Audit Logs"],
                    summary: "Create an audit log",
                    description: "Records an audit entry. When userId is omitted, the authenticated user is used.",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AuditLogRequest" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Audit log created successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Audit log created successfully" },
                                            data: { $ref: "#/components/schemas/AuditLog" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/audit-logs/{id}": {
                get: {
                    tags: ["Audit Logs"],
                    summary: "Get an audit log by id",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Audit log fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Audit log fetched successfully" },
                                            data: { $ref: "#/components/schemas/AuditLog" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                delete: {
                    tags: ["Audit Logs"],
                    summary: "Delete an audit log",
                    description: "Only admins can purge audit log entries.",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Audit log deleted successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Audit log deleted successfully" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/departments": {
                get: {
                    tags: ["Departments"],
                    summary: "List departments",
                    parameters: [
                        { $ref: "#/components/parameters/Page" },
                        { $ref: "#/components/parameters/Limit" },
                        {
                            name: "q",
                            in: "query",
                            schema: { type: "string" },
                            description: "Search by department name or description.",
                        },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: ["name", "createdAt", "updatedAt"],
                                default: "name",
                            },
                        },
                        {
                            name: "sortOrder",
                            in: "query",
                            schema: { type: "string", enum: ["asc", "desc"], default: "asc" },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Departments fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data", "meta"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Departments fetched successfully" },
                                            data: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Department" },
                                            },
                                            meta: { $ref: "#/components/schemas/PaginationMeta" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                    },
                },
                post: {
                    tags: ["Departments"],
                    summary: "Create a department",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/DepartmentRequest" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Department created successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Department created successfully" },
                                            data: { $ref: "#/components/schemas/Department" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "409": { $ref: "#/components/responses/Conflict" },
                    },
                },
            },
            "/api/departments/{id}": {
                get: {
                    tags: ["Departments"],
                    summary: "Get a department by id",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Department fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Department fetched successfully" },
                                            data: { $ref: "#/components/schemas/Department" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                patch: {
                    tags: ["Departments"],
                    summary: "Update a department",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UpdateDepartmentRequest" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Department updated successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Department updated successfully" },
                                            data: { $ref: "#/components/schemas/Department" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                        "409": { $ref: "#/components/responses/Conflict" },
                    },
                },
                delete: {
                    tags: ["Departments"],
                    summary: "Delete a department",
                    description: "Departments that still have employees cannot be deleted.",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Department deleted successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Department deleted successfully" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                        "409": { $ref: "#/components/responses/Conflict" },
                    },
                },
            },
            "/api/employees": {
                get: {
                    tags: ["Employees"],
                    summary: "List employees",
                    parameters: [
                        { $ref: "#/components/parameters/Page" },
                        { $ref: "#/components/parameters/Limit" },
                        {
                            name: "q",
                            in: "query",
                            schema: { type: "string" },
                            description: "Search by employee code, first name, last name, or email.",
                        },
                        {
                            name: "departmentId",
                            in: "query",
                            schema: { type: "string", format: "uuid" },
                            description: "Filter by department id.",
                        },
                        {
                            name: "status",
                            in: "query",
                            schema: { $ref: "#/components/schemas/EEmployeeStatus" },
                            description: "Filter by employee status.",
                        },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: [
                                    "employeeCode",
                                    "firstName",
                                    "lastName",
                                    "hireDate",
                                    "createdAt",
                                    "updatedAt",
                                ],
                                default: "createdAt",
                            },
                        },
                        {
                            name: "sortOrder",
                            in: "query",
                            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Employees fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data", "meta"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Employees fetched successfully" },
                                            data: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Employee" },
                                            },
                                            meta: { $ref: "#/components/schemas/PaginationMeta" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                    },
                },
                post: {
                    tags: ["Employees"],
                    summary: "Create an employee",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/EmployeeRequest" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Employee created successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Employee created successfully" },
                                            data: { $ref: "#/components/schemas/Employee" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                        "409": { $ref: "#/components/responses/Conflict" },
                    },
                },
            },
            "/api/employees/{id}": {
                get: {
                    tags: ["Employees"],
                    summary: "Get an employee by id",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Employee fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Employee fetched successfully" },
                                            data: { $ref: "#/components/schemas/Employee" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                patch: {
                    tags: ["Employees"],
                    summary: "Update an employee",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UpdateEmployeeRequest" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Employee updated successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Employee updated successfully" },
                                            data: { $ref: "#/components/schemas/Employee" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                        "409": { $ref: "#/components/responses/Conflict" },
                    },
                },
                delete: {
                    tags: ["Employees"],
                    summary: "Delete an employee",
                    description: "Employees that still have shifts, attendance logs, or attendance records cannot be deleted.",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Employee deleted successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Employee deleted successfully" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                        "409": { $ref: "#/components/responses/Conflict" },
                    },
                },
            },
            "/api/leaves/calendar": {
                get: {
                    tags: ["Leaves"],
                    summary: "Get expanded leave days for a date range",
                    description: "Expands one-time and recurring leaves into actual calendar days. When employeeId is provided, global, employee-specific, and the employee's department leaves are included. Without employeeId or departmentId, only global leaves are returned.",
                    parameters: [
                        {
                            name: "from",
                            in: "query",
                            required: true,
                            schema: { type: "string", format: "date-time" },
                            description: "Start of the calendar range.",
                        },
                        {
                            name: "to",
                            in: "query",
                            required: true,
                            schema: { type: "string", format: "date-time" },
                            description: "End of the calendar range. Maximum range is 3660 days.",
                        },
                        { name: "employeeId", in: "query", schema: { type: "string", format: "uuid" } },
                        { name: "departmentId", in: "query", schema: { type: "string", format: "uuid" } },
                    ],
                    responses: {
                        "200": {
                            description: "Leave calendar fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Leave calendar fetched successfully" },
                                            data: { $ref: "#/components/schemas/LeaveCalendar" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/leaves/check": {
                get: {
                    tags: ["Leaves"],
                    summary: "Check whether a date is a leave day",
                    description: "Use this before applying absence deductions. isDeductible is false when the date should not be deducted.",
                    parameters: [
                        {
                            name: "date",
                            in: "query",
                            required: true,
                            schema: { type: "string", format: "date-time" },
                        },
                        { name: "employeeId", in: "query", schema: { type: "string", format: "uuid" } },
                        { name: "departmentId", in: "query", schema: { type: "string", format: "uuid" } },
                    ],
                    responses: {
                        "200": {
                            description: "Leave day checked successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Leave day checked successfully" },
                                            data: { $ref: "#/components/schemas/LeaveCheckResult" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/leaves": {
                get: {
                    tags: ["Leaves"],
                    summary: "List leaves and holidays",
                    parameters: [
                        { $ref: "#/components/parameters/Page" },
                        { $ref: "#/components/parameters/Limit" },
                        { name: "q", in: "query", schema: { type: "string", maxLength: 100 } },
                        {
                            name: "type",
                            in: "query",
                            schema: { $ref: "#/components/schemas/ELeaveType" },
                        },
                        {
                            name: "scope",
                            in: "query",
                            schema: { $ref: "#/components/schemas/ELeaveScope" },
                        },
                        { name: "employeeId", in: "query", schema: { type: "string", format: "uuid" } },
                        { name: "departmentId", in: "query", schema: { type: "string", format: "uuid" } },
                        {
                            name: "recurrence",
                            in: "query",
                            schema: { $ref: "#/components/schemas/ELeaveRecurrence" },
                        },
                        {
                            name: "isActive",
                            in: "query",
                            schema: { type: "string", enum: ["true", "false"] },
                        },
                        { name: "from", in: "query", schema: { type: "string", format: "date-time" } },
                        { name: "to", in: "query", schema: { type: "string", format: "date-time" } },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: ["name", "startDate", "endDate", "createdAt", "updatedAt"],
                                default: "startDate",
                            },
                        },
                        {
                            name: "sortOrder",
                            in: "query",
                            schema: { type: "string", enum: ["asc", "desc"], default: "asc" },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Leaves fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data", "meta"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Leaves fetched successfully" },
                                            data: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Leave" },
                                            },
                                            meta: { $ref: "#/components/schemas/PaginationMeta" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                    },
                },
                post: {
                    tags: ["Leaves"],
                    summary: "Create a leave or holiday",
                    description: "NONE creates a one-time leave. WEEKLY, MONTHLY, and YEARLY create recurring single-day occurrences. For recurring leaves, endDate is the end of the recurrence window; null means indefinite.",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/LeaveRequest" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Leave created successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Leave created successfully" },
                                            data: { $ref: "#/components/schemas/Leave" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/leaves/{id}": {
                get: {
                    tags: ["Leaves"],
                    summary: "Get a leave by id",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Leave fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Leave fetched successfully" },
                                            data: { $ref: "#/components/schemas/Leave" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                patch: {
                    tags: ["Leaves"],
                    summary: "Update a leave",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UpdateLeaveRequest" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Leave updated successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Leave updated successfully" },
                                            data: { $ref: "#/components/schemas/Leave" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                delete: {
                    tags: ["Leaves"],
                    summary: "Delete a leave",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Leave deleted successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Leave deleted successfully" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/shifts/assignments": {
                get: {
                    tags: ["Shifts"],
                    summary: "List employee shift assignments",
                    parameters: [
                        { $ref: "#/components/parameters/Page" },
                        { $ref: "#/components/parameters/Limit" },
                        { name: "employeeId", in: "query", schema: { type: "string", format: "uuid" } },
                        { name: "shiftId", in: "query", schema: { type: "string", format: "uuid" } },
                        {
                            name: "isActive",
                            in: "query",
                            schema: { type: "string", enum: ["true", "false"] },
                        },
                        { name: "from", in: "query", schema: { type: "string", format: "date-time" } },
                        { name: "to", in: "query", schema: { type: "string", format: "date-time" } },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: ["startDate", "endDate", "createdAt", "updatedAt"],
                                default: "startDate",
                            },
                        },
                        {
                            name: "sortOrder",
                            in: "query",
                            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Employee shift assignments fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data", "meta"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Employee shift assignments fetched successfully",
                                            },
                                            data: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/EmployeeShift" },
                                            },
                                            meta: { $ref: "#/components/schemas/PaginationMeta" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                    },
                },
                post: {
                    tags: ["Shifts"],
                    summary: "Assign a shift to an employee",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/EmployeeShiftRequest" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Employee shift assigned successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Employee shift assigned successfully",
                                            },
                                            data: { $ref: "#/components/schemas/EmployeeShift" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/shifts/assignments/{id}": {
                get: {
                    tags: ["Shifts"],
                    summary: "Get an employee shift assignment by id",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Employee shift assignment fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Employee shift assignment fetched successfully",
                                            },
                                            data: { $ref: "#/components/schemas/EmployeeShift" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                patch: {
                    tags: ["Shifts"],
                    summary: "Update an employee shift assignment",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UpdateEmployeeShiftRequest" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Employee shift assignment updated successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Employee shift assignment updated successfully",
                                            },
                                            data: { $ref: "#/components/schemas/EmployeeShift" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                delete: {
                    tags: ["Shifts"],
                    summary: "Delete an employee shift assignment",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Employee shift assignment deleted successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Employee shift assignment deleted successfully",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/shifts": {
                get: {
                    tags: ["Shifts"],
                    summary: "List shifts",
                    parameters: [
                        { $ref: "#/components/parameters/Page" },
                        { $ref: "#/components/parameters/Limit" },
                        {
                            name: "q",
                            in: "query",
                            schema: { type: "string" },
                            description: "Search by shift name.",
                        },
                        {
                            name: "isNightShift",
                            in: "query",
                            schema: { type: "string", enum: ["true", "false"] },
                        },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: ["name", "startTime", "createdAt", "updatedAt"],
                                default: "name",
                            },
                        },
                        {
                            name: "sortOrder",
                            in: "query",
                            schema: { type: "string", enum: ["asc", "desc"], default: "asc" },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Shifts fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data", "meta"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Shifts fetched successfully" },
                                            data: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Shift" },
                                            },
                                            meta: { $ref: "#/components/schemas/PaginationMeta" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                    },
                },
                post: {
                    tags: ["Shifts"],
                    summary: "Create a shift",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ShiftRequest" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Shift created successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Shift created successfully" },
                                            data: { $ref: "#/components/schemas/Shift" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                    },
                },
            },
            "/api/shifts/{id}": {
                get: {
                    tags: ["Shifts"],
                    summary: "Get a shift by id",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Shift fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Shift fetched successfully" },
                                            data: { $ref: "#/components/schemas/Shift" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                patch: {
                    tags: ["Shifts"],
                    summary: "Update a shift",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UpdateShiftRequest" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Shift updated successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Shift updated successfully" },
                                            data: { $ref: "#/components/schemas/Shift" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                delete: {
                    tags: ["Shifts"],
                    summary: "Delete a shift",
                    description: "Shifts assigned to employees or used by attendance records cannot be deleted.",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Shift deleted successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Shift deleted successfully" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                        "409": { $ref: "#/components/responses/Conflict" },
                    },
                },
            },
            "/api/attendance/process": {
                post: {
                    tags: ["Attendance"],
                    summary: "Queue attendance processing",
                    description: "Enqueues background jobs that calculate check-in/check-out minutes, lateness, early leave, overtime, and status for the selected date(s). Requires Redis and a running attendance worker.",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ProcessAttendanceRequest" },
                            },
                        },
                    },
                    responses: {
                        "202": {
                            description: "Attendance processing jobs enqueued successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Attendance processing jobs enqueued successfully",
                                            },
                                            data: {
                                                type: "object",
                                                required: ["dates", "jobIds", "count"],
                                                properties: {
                                                    dates: {
                                                        type: "array",
                                                        items: { type: "string", format: "date" },
                                                        example: ["2026-02-01"],
                                                    },
                                                    jobIds: {
                                                        type: "array",
                                                        items: { type: "string" },
                                                        example: ["1"],
                                                    },
                                                    count: { type: "integer", example: 1 },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "503": {
                            description: "Attendance queue is unavailable.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: false },
                                            message: { type: "string", example: "Attendance queue is unavailable" },
                                            code: {
                                                type: "string",
                                                example: "ATTENDANCE_QUEUE_UNAVAILABLE",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/attendance/logs": {
                get: {
                    tags: ["Attendance"],
                    summary: "List attendance logs",
                    parameters: [
                        { $ref: "#/components/parameters/Page" },
                        { $ref: "#/components/parameters/Limit" },
                        { name: "employeeId", in: "query", schema: { type: "string", format: "uuid" } },
                        {
                            name: "departmentId",
                            in: "query",
                            schema: { type: "string", format: "uuid" },
                            description: "Filter attendance logs by the employee's department.",
                        },
                        {
                            name: "type",
                            in: "query",
                            schema: { type: "string", enum: ["CHECK_IN", "CHECK_OUT"] },
                        },
                        {
                            name: "source",
                            in: "query",
                            schema: { type: "string", enum: ["MANUAL", "CSV", "SYSTEM"] },
                        },
                        { name: "from", in: "query", schema: { type: "string", format: "date-time" } },
                        { name: "to", in: "query", schema: { type: "string", format: "date-time" } },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: ["timestamp", "createdAt"],
                                default: "timestamp",
                            },
                        },
                        {
                            name: "sortOrder",
                            in: "query",
                            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Attendance logs fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data", "meta"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Attendance logs fetched successfully" },
                                            data: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/AttendanceLog" },
                                            },
                                            meta: { $ref: "#/components/schemas/PaginationMeta" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                    },
                },
                post: {
                    tags: ["Attendance"],
                    summary: "Create an attendance log",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AttendanceLogRequest" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Attendance log created successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Attendance log created successfully" },
                                            data: { $ref: "#/components/schemas/AttendanceLog" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/attendance/logs/{id}": {
                get: {
                    tags: ["Attendance"],
                    summary: "Get an attendance log by id",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Attendance log fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Attendance log fetched successfully" },
                                            data: { $ref: "#/components/schemas/AttendanceLog" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                delete: {
                    tags: ["Attendance"],
                    summary: "Delete an attendance log",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Attendance log deleted successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Attendance log deleted successfully" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/attendance/records": {
                get: {
                    tags: ["Attendance"],
                    summary: "List attendance records",
                    parameters: [
                        { $ref: "#/components/parameters/Page" },
                        { $ref: "#/components/parameters/Limit" },
                        { name: "employeeId", in: "query", schema: { type: "string", format: "uuid" } },
                        {
                            name: "departmentId",
                            in: "query",
                            schema: { type: "string", format: "uuid" },
                            description: "Filter attendance records by the employee's department.",
                        },
                        { name: "shiftId", in: "query", schema: { type: "string", format: "uuid" } },
                        {
                            name: "status",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: ["PRESENT", "ABSENT", "LATE", "HALF_DAY", "ON_LEAVE"],
                            },
                        },
                        { name: "from", in: "query", schema: { type: "string", format: "date-time" } },
                        { name: "to", in: "query", schema: { type: "string", format: "date-time" } },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: ["date", "createdAt", "updatedAt"],
                                default: "date",
                            },
                        },
                        {
                            name: "sortOrder",
                            in: "query",
                            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Attendance records fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data", "meta"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Attendance records fetched successfully",
                                            },
                                            data: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/AttendanceRecord" },
                                            },
                                            meta: { $ref: "#/components/schemas/PaginationMeta" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                    },
                },
                post: {
                    tags: ["Attendance"],
                    summary: "Create an attendance record",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AttendanceRecordRequest" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Attendance record created successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Attendance record created successfully",
                                            },
                                            data: { $ref: "#/components/schemas/AttendanceRecord" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                        "409": { $ref: "#/components/responses/Conflict" },
                    },
                },
            },
            "/api/attendance/records/{id}": {
                get: {
                    tags: ["Attendance"],
                    summary: "Get an attendance record by id",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Attendance record fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Attendance record fetched successfully",
                                            },
                                            data: { $ref: "#/components/schemas/AttendanceRecord" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                patch: {
                    tags: ["Attendance"],
                    summary: "Update an attendance record",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UpdateAttendanceRecordRequest" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Attendance record updated successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Attendance record updated successfully",
                                            },
                                            data: { $ref: "#/components/schemas/AttendanceRecord" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                        "409": { $ref: "#/components/responses/Conflict" },
                    },
                },
                delete: {
                    tags: ["Attendance"],
                    summary: "Delete an attendance record",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Attendance record deleted successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Attendance record deleted successfully",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/uploads/employees": {
                post: {
                    tags: ["Uploads"],
                    summary: "Import employees from a CSV file",
                    description: "Uploads a CSV file (multipart field `file`) and creates or updates employees. " +
                        "Departments and shifts are created automatically when missing, and optional shift " +
                        "columns assign the employee to a shift. Row-level errors are returned in `errors`.",
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
                                            description: "CSV file (max 5MB).",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Employees CSV processed.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Employees CSV imported successfully" },
                                            data: { $ref: "#/components/schemas/UploadImportResult" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "413": { $ref: "#/components/responses/FileTooLarge" },
                    },
                },
            },
            "/api/uploads/attendance": {
                post: {
                    tags: ["Uploads"],
                    summary: "Import attendance from a CSV file",
                    description: "Uploads a CSV file (multipart field `file`). Rows containing `type` and `timestamp` " +
                        "create attendance logs; rows containing `date` create or update attendance records. " +
                        "Row-level errors are returned in `errors`.",
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
                                            description: "CSV file (max 5MB).",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Attendance CSV processed.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Attendance CSV imported successfully" },
                                            data: { $ref: "#/components/schemas/UploadImportResult" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "413": { $ref: "#/components/responses/FileTooLarge" },
                    },
                },
            },
            "/api/uploads": {
                get: {
                    tags: ["Uploads"],
                    summary: "List uploaded files",
                    parameters: [
                        { $ref: "#/components/parameters/Page" },
                        { $ref: "#/components/parameters/Limit" },
                        {
                            name: "type",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: ["EMPLOYEE_IMPORT", "ATTENDANCE_IMPORT"],
                            },
                        },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: ["createdAt", "originalName", "type"],
                                default: "createdAt",
                            },
                        },
                        {
                            name: "sortOrder",
                            in: "query",
                            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Uploaded files fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data", "meta"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Uploaded files fetched successfully" },
                                            data: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/UploadedFile" },
                                            },
                                            meta: { $ref: "#/components/schemas/PaginationMeta" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                    },
                },
            },
            "/api/uploads/{id}": {
                get: {
                    tags: ["Uploads"],
                    summary: "Get an uploaded file by id",
                    parameters: [{ $ref: "#/components/parameters/IdPath" }],
                    responses: {
                        "200": {
                            description: "Uploaded file fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: "Uploaded file fetched successfully" },
                                            data: { $ref: "#/components/schemas/UploadedFile" },
                                        },
                                    },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/dashboard/summary": {
                get: {
                    tags: ["Dashboard"],
                    summary: "Get dashboard summary",
                    description: "Returns workforce counts, attendance totals for the selected period, today's snapshot, leave summary, daily trend, and the latest audit logs. Defaults to the current month up to today in the application timezone. MANAGER users are always scoped to their assigned department; a MANAGER without a department receives 403 MANAGER_DEPARTMENT_REQUIRED.",
                    parameters: [
                        {
                            name: "from",
                            in: "query",
                            schema: { type: "string", format: "date" },
                            description: "Period start (UTC day). Defaults to the start of the current month.",
                        },
                        {
                            name: "to",
                            in: "query",
                            schema: { type: "string", format: "date" },
                            description: "Period end (UTC day). Defaults to today in the application timezone.",
                        },
                        {
                            name: "departmentId",
                            in: "query",
                            schema: { type: "string", format: "uuid" },
                        },
                        {
                            name: "employeeId",
                            in: "query",
                            schema: { type: "string", format: "uuid" },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Dashboard summary fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Dashboard summary fetched successfully",
                                            },
                                            data: { $ref: "#/components/schemas/DashboardSummary" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/dashboard/hr-kpi": {
                get: {
                    tags: ["Dashboard"],
                    summary: "Get HR KPI report",
                    description: "Returns attendance KPIs grouped by department, the top late employees, workforce counts, daily trend, and active leave count. Defaults to the current month up to today in the application timezone.",
                    parameters: [
                        {
                            name: "from",
                            in: "query",
                            schema: { type: "string", format: "date" },
                            description: "Period start (UTC day). Defaults to the start of the current month.",
                        },
                        {
                            name: "to",
                            in: "query",
                            schema: { type: "string", format: "date" },
                            description: "Period end (UTC day). Defaults to today in the application timezone.",
                        },
                        {
                            name: "departmentId",
                            in: "query",
                            schema: { type: "string", format: "uuid" },
                        },
                        {
                            name: "employeeId",
                            in: "query",
                            schema: { type: "string", format: "uuid" },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "HR KPI report fetched successfully.",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        required: ["success", "message", "data"],
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "HR KPI report fetched successfully",
                                            },
                                            data: { $ref: "#/components/schemas/HrKpiReport" },
                                        },
                                    },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                    },
                },
            },
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