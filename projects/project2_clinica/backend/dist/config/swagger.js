import swaggerJsdoc from "swagger-jsdoc";
const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Clinica API",
            version: "1.0.0",
            description: "REST API for Clinica, a clinic management and appointment booking platform. " +
                "It covers authentication, users, doctors, specializations, clinic services, " +
                "doctor availability, doctor services, and appointment booking/cancellation. " +
                "All successful responses follow `{ success, message, data?, meta? }`; " +
                "all errors follow `{ success: false, message, code, details? }`.",
            contact: {
                name: "Clinica API Support",
                email: "support@clinica.local",
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
            { name: "Auth", description: "Registration and login" },
            { name: "Users", description: "User profile and administration" },
            { name: "Doctors", description: "Doctor profiles" },
            { name: "Specializations", description: "Medical specializations" },
            { name: "Clinic Services", description: "Services offered by the clinic" },
            { name: "Doctor Availability", description: "Doctor working windows" },
            { name: "Doctor Services", description: "Services offered by a doctor, with price and duration" },
            { name: "Appointments", description: "Availability, booking, listing, and cancellation" },
        ],
        security: [{ bearerAuth: [] }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "JWT returned by `/api/auth/register` or `/api/auth/login`.",
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
                            example: {
                                success: false,
                                message: "email: email must be a valid email address",
                                code: "VALIDATION_ERROR",
                                details: {
                                    errors: [{ field: "email", message: "email: email must be a valid email address" }],
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
                            example: { success: false, message: "Authorization token is required", code: "TOKEN_MISSING" },
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
                            example: { success: false, message: "Resource not found", code: "NOT_FOUND" },
                        },
                    },
                },
                Conflict: {
                    description: "The request conflicts with existing data.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: { success: false, message: "Resource already exists", code: "CONFLICT" },
                        },
                    },
                },
                InternalError: {
                    description: "Unexpected server error.",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                            example: { success: false, message: "Internal server error", code: "INTERNAL_ERROR" },
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
                            description: "Machine-readable error code such as VALIDATION_ERROR, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT, APPOINTMENT_CONFLICT, or INTERNAL_ERROR.",
                        },
                        details: {
                            type: "object",
                            additionalProperties: true,
                            example: { errors: [{ field: "email", message: "email must be a valid email address" }] },
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
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        name: { type: "string", example: "Ahmed Mohamed" },
                        email: { type: "string", format: "email", example: "ahmed@example.com" },
                        role: { type: "string", enum: ["PATIENT", "DOCTOR", "ADMIN"], example: "PATIENT" },
                        phone: { type: "string", nullable: true, example: "+201234567890" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                AuthUser: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        name: { type: "string", example: "Ahmed Mohamed" },
                        email: { type: "string", format: "email", example: "ahmed@example.com" },
                        role: { type: "string", enum: ["PATIENT", "DOCTOR", "ADMIN"], example: "PATIENT" },
                        phone: { type: "string", nullable: true, example: "+201234567890" },
                    },
                },
                AuthResponse: {
                    type: "object",
                    required: ["success", "message", "data"],
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Login successful" },
                        data: {
                            type: "object",
                            required: ["user", "token"],
                            properties: {
                                user: { $ref: "#/components/schemas/AuthUser" },
                                token: {
                                    type: "string",
                                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                },
                            },
                        },
                    },
                },
                UserResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "User fetched successfully" },
                        data: { $ref: "#/components/schemas/User" },
                    },
                },
                PaginatedUsersResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Users fetched successfully" },
                        data: { type: "array", items: { $ref: "#/components/schemas/User" } },
                        meta: { $ref: "#/components/schemas/PaginationMeta" },
                    },
                },
                RegisterRequest: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: { type: "string", minLength: 2, maxLength: 50, example: "Ahmed Mohamed" },
                        email: { type: "string", format: "email", example: "ahmed@example.com" },
                        password: {
                            type: "string",
                            minLength: 8,
                            maxLength: 128,
                            example: "Password123",
                            description: "Must contain an uppercase letter, a lowercase letter, and a number.",
                        },
                        phone: { type: "string", example: "+201234567890" },
                    },
                },
                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email", example: "ahmed@example.com" },
                        password: { type: "string", example: "Password123" },
                    },
                },
                UpdateUserRequest: {
                    type: "object",
                    minProperties: 1,
                    properties: {
                        name: { type: "string", example: "Ahmed Mohamed" },
                        phone: { type: "string", nullable: true, example: "+201234567890" },
                        password: { type: "string", minLength: 6, example: "NewPassword123" },
                        role: {
                            type: "string",
                            enum: ["PATIENT", "DOCTOR", "ADMIN"],
                            description: "Only ADMIN users may change roles.",
                        },
                    },
                },
                Specialization: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        name: { type: "string", example: "Cardiology" },
                        slug: { type: "string", example: "cardiology" },
                        description: { type: "string", nullable: true, example: "Heart and cardiovascular care." },
                        isActive: { type: "boolean", example: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                CreateSpecializationRequest: {
                    type: "object",
                    required: ["name", "slug"],
                    properties: {
                        name: { type: "string", minLength: 2, maxLength: 100, example: "Cardiology" },
                        slug: {
                            type: "string",
                            pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
                            example: "cardiology",
                        },
                        description: { type: "string", maxLength: 500, example: "Heart and cardiovascular care." },
                        isActive: { type: "boolean", default: true },
                    },
                },
                UpdateSpecializationRequest: {
                    type: "object",
                    properties: {
                        name: { type: "string", minLength: 2, maxLength: 100 },
                        slug: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
                        description: { type: "string", maxLength: 500, nullable: true },
                        isActive: { type: "boolean" },
                    },
                },
                SpecializationResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Specialization fetched successfully" },
                        data: { $ref: "#/components/schemas/Specialization" },
                    },
                },
                PaginatedSpecializationsResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Specializations fetched successfully" },
                        data: { type: "array", items: { $ref: "#/components/schemas/Specialization" } },
                        meta: { $ref: "#/components/schemas/PaginationMeta" },
                    },
                },
                ClinicService: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        name: { type: "string", example: "Initial Consultation" },
                        slug: { type: "string", example: "initial-consultation" },
                        description: { type: "string", nullable: true, example: "First visit with the doctor." },
                        isActive: { type: "boolean", example: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                CreateClinicServiceRequest: {
                    type: "object",
                    required: ["name", "slug"],
                    properties: {
                        name: { type: "string", minLength: 2, maxLength: 150, example: "Initial Consultation" },
                        slug: {
                            type: "string",
                            pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
                            example: "initial-consultation",
                        },
                        description: { type: "string", maxLength: 500 },
                        isActive: { type: "boolean", default: true },
                    },
                },
                UpdateClinicServiceRequest: {
                    type: "object",
                    properties: {
                        name: { type: "string", minLength: 2, maxLength: 150 },
                        slug: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
                        description: { type: "string", maxLength: 500, nullable: true },
                        isActive: { type: "boolean" },
                    },
                },
                ClinicServiceResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Clinic service fetched successfully" },
                        data: { $ref: "#/components/schemas/ClinicService" },
                    },
                },
                PaginatedClinicServicesResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Clinic services fetched successfully" },
                        data: { type: "array", items: { $ref: "#/components/schemas/ClinicService" } },
                        meta: { $ref: "#/components/schemas/PaginationMeta" },
                    },
                },
                Doctor: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        userId: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        specializationId: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        imageUrl: { type: "string", nullable: true, example: "https://example.com/doctor.jpg" },
                        bio: { type: "string", nullable: true, example: "Consultant cardiologist with 15 years of experience." },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        user: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                name: { type: "string", example: "Dr. Karim Fouad" },
                                email: { type: "string", format: "email", example: "karim.fouad@clinica.com" },
                                role: { type: "string", example: "DOCTOR" },
                                phone: { type: "string", nullable: true, example: "+201234567890" },
                            },
                        },
                        specialization: { $ref: "#/components/schemas/Specialization" },
                    },
                },
                DoctorUserInput: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: { type: "string", minLength: 2, maxLength: 50, example: "Dr. Karim Fouad" },
                        email: { type: "string", format: "email", example: "karim.fouad@clinica.com" },
                        password: {
                            type: "string",
                            minLength: 8,
                            maxLength: 128,
                            example: "Password123",
                            description: "Must contain an uppercase letter, a lowercase letter, and a number.",
                        },
                        phone: { type: "string", example: "+201234567890" },
                    },
                },
                CreateDoctorRequest: {
                    type: "object",
                    required: ["specializationId"],
                    description: "Provide either `userId` for an existing user or `user` to create a new DOCTOR account.",
                    properties: {
                        userId: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        user: { $ref: "#/components/schemas/DoctorUserInput" },
                        specializationId: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        imageUrl: { type: "string", format: "uri", example: "https://example.com/doctor.jpg" },
                        bio: { type: "string", maxLength: 1000 },
                    },
                },
                UpdateDoctorRequest: {
                    type: "object",
                    properties: {
                        specializationId: { type: "string" },
                        imageUrl: { type: "string", format: "uri", nullable: true },
                        bio: { type: "string", maxLength: 1000, nullable: true },
                    },
                },
                DoctorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Doctor fetched successfully" },
                        data: { $ref: "#/components/schemas/Doctor" },
                    },
                },
                PaginatedDoctorsResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Doctors fetched successfully" },
                        data: { type: "array", items: { $ref: "#/components/schemas/Doctor" } },
                        meta: { $ref: "#/components/schemas/PaginationMeta" },
                    },
                },
                DoctorAvailability: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        doctorId: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        startsAt: { type: "string", format: "date-time", example: "2026-11-02T09:00:00.000Z" },
                        endsAt: { type: "string", format: "date-time", example: "2026-11-02T17:00:00.000Z" },
                        isActive: { type: "boolean", example: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                CreateDoctorAvailabilityRequest: {
                    type: "object",
                    required: ["startsAt", "endsAt"],
                    properties: {
                        doctorId: {
                            type: "string",
                            description: "Required for ADMIN. DOCTOR users manage their own availability.",
                        },
                        startsAt: { type: "string", format: "date-time", example: "2026-11-02T09:00:00.000Z" },
                        endsAt: { type: "string", format: "date-time", example: "2026-11-02T17:00:00.000Z" },
                        isActive: { type: "boolean", default: true },
                    },
                },
                UpdateDoctorAvailabilityRequest: {
                    type: "object",
                    properties: {
                        startsAt: { type: "string", format: "date-time" },
                        endsAt: { type: "string", format: "date-time" },
                        isActive: { type: "boolean" },
                    },
                },
                DoctorAvailabilityResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Doctor availability fetched successfully" },
                        data: { $ref: "#/components/schemas/DoctorAvailability" },
                    },
                },
                PaginatedDoctorAvailabilitiesResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Doctor availabilities fetched successfully" },
                        data: { type: "array", items: { $ref: "#/components/schemas/DoctorAvailability" } },
                        meta: { $ref: "#/components/schemas/PaginationMeta" },
                    },
                },
                DoctorService: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        doctorId: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        clinicServiceId: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        price: { type: "string", example: "350.00" },
                        durationMinutes: { type: "integer", example: 30 },
                        isActive: { type: "boolean", example: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        doctor: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                userId: { type: "string" },
                                user: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        name: { type: "string", example: "Dr. Karim Fouad" },
                                        email: { type: "string", format: "email" },
                                    },
                                },
                            },
                        },
                        clinicService: { $ref: "#/components/schemas/ClinicService" },
                    },
                },
                CreateDoctorServiceRequest: {
                    type: "object",
                    required: ["clinicServiceId", "price", "durationMinutes"],
                    properties: {
                        doctorId: {
                            type: "string",
                            description: "Required for ADMIN. DOCTOR users add services to their own profile.",
                        },
                        clinicServiceId: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        price: { oneOf: [{ type: "number" }, { type: "string" }], example: "350.00" },
                        durationMinutes: { type: "integer", minimum: 1, example: 30 },
                        isActive: { type: "boolean", default: true },
                    },
                },
                UpdateDoctorServiceRequest: {
                    type: "object",
                    properties: {
                        price: { oneOf: [{ type: "number" }, { type: "string" }], example: "400.00" },
                        durationMinutes: { type: "integer", minimum: 1, example: 45 },
                        isActive: { type: "boolean" },
                    },
                },
                DoctorServiceResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Doctor service fetched successfully" },
                        data: { $ref: "#/components/schemas/DoctorService" },
                    },
                },
                PaginatedDoctorServicesResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Doctor services fetched successfully" },
                        data: { type: "array", items: { $ref: "#/components/schemas/DoctorService" } },
                        meta: { $ref: "#/components/schemas/PaginationMeta" },
                    },
                },
                Appointment: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        patientId: { type: "string" },
                        doctorId: { type: "string" },
                        doctorServiceId: { type: "string" },
                        startsAt: { type: "string", format: "date-time", example: "2026-11-02T10:00:00.000Z" },
                        endsAt: { type: "string", format: "date-time", example: "2026-11-02T10:30:00.000Z" },
                        status: {
                            type: "string",
                            enum: ["PENDING", "BOOKED", "COMPLETED", "CANCELED"],
                            example: "PENDING",
                        },
                        priceAtBooking: { type: "string", example: "350.00" },
                        durationMinutesAtBooking: { type: "integer", example: 30 },
                        serviceNameSnapshot: { type: "string", nullable: true, example: "Initial Consultation" },
                        doctorDisplayNameSnapshot: { type: "string", nullable: true, example: "Dr. Karim Fouad" },
                        notes: { type: "string", nullable: true, example: "First visit" },
                        reminderSent: { type: "boolean", example: false },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                AppointmentDetail: {
                    allOf: [
                        { $ref: "#/components/schemas/Appointment" },
                        {
                            type: "object",
                            properties: {
                                patient: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        name: { type: "string" },
                                        email: { type: "string", format: "email" },
                                        phone: { type: "string", nullable: true },
                                    },
                                },
                                doctor: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        userId: { type: "string" },
                                        user: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                name: { type: "string" },
                                                email: { type: "string", format: "email" },
                                            },
                                        },
                                        specialization: { $ref: "#/components/schemas/Specialization" },
                                    },
                                },
                                doctorService: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        durationMinutes: { type: "integer", example: 30 },
                                        isActive: { type: "boolean", example: true },
                                        clinicService: { $ref: "#/components/schemas/ClinicService" },
                                    },
                                },
                            },
                        },
                    ],
                },
                CreateAppointmentRequest: {
                    type: "object",
                    required: ["doctorServiceId", "startsAt"],
                    properties: {
                        doctorServiceId: { type: "string", example: "cm3x9k2a10000abcd1234efgh" },
                        startsAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-11-02T10:00:00.000Z",
                            description: "Must be in the future and fully inside an active doctor availability window.",
                        },
                        patientId: {
                            type: "string",
                            description: "Required for ADMIN bookings and must reference a PATIENT account. Patients cannot book for anyone else.",
                            example: "cm3x9k2a10000abcd1234efgh",
                        },
                        notes: { type: "string", maxLength: 1000, example: "First visit" },
                    },
                },
                AppointmentResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Appointment request submitted successfully" },
                        data: { $ref: "#/components/schemas/Appointment" },
                    },
                },
                AppointmentDetailResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Appointment fetched successfully" },
                        data: { $ref: "#/components/schemas/AppointmentDetail" },
                    },
                },
                PaginatedAppointmentsResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Appointments fetched successfully" },
                        data: { type: "array", items: { $ref: "#/components/schemas/AppointmentDetail" } },
                        meta: { $ref: "#/components/schemas/PaginationMeta" },
                    },
                },
                AvailabilitySlot: {
                    type: "object",
                    properties: {
                        startsAt: { type: "string", format: "date-time", example: "2026-11-02T10:00:00.000Z" },
                        endsAt: { type: "string", format: "date-time", example: "2026-11-02T10:30:00.000Z" },
                    },
                },
                AvailabilityResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Availability fetched successfully" },
                        data: {
                            type: "object",
                            properties: {
                                date: { type: "string", example: "2026-11-02" },
                                doctorServiceId: { type: "string" },
                                doctorId: { type: "string" },
                                doctorName: { type: "string", nullable: true, example: "Dr. Karim Fouad" },
                                durationMinutes: { type: "integer", example: 30 },
                                timezone: { type: "string", example: "Africa/Cairo" },
                                slots: { type: "array", items: { $ref: "#/components/schemas/AvailabilitySlot" } },
                            },
                        },
                    },
                },
                MessageResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Operation completed successfully" },
                    },
                },
                HealthResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        status: { type: "string", example: "ok" },
                        service: { type: "string", example: "clinica-api" },
                        environment: { type: "string", example: "development" },
                        timestamp: { type: "string", format: "date-time" },
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
                                "application/json": { schema: { $ref: "#/components/schemas/HealthResponse" } },
                            },
                        },
                    },
                },
            },
            "/api/auth/register": {
                post: {
                    tags: ["Auth"],
                    summary: "Register a patient",
                    description: "Creates a PATIENT account. The `role` field is not accepted during public registration.",
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Account created.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "409": { $ref: "#/components/responses/Conflict" },
                    },
                },
            },
            "/api/auth/login": {
                post: {
                    tags: ["Auth"],
                    summary: "Log in",
                    description: "Returns a JWT and the user profile. Credential errors are intentionally generic.",
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Login successful.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": {
                            description: "Invalid email or password.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                                    example: {
                                        success: false,
                                        message: "Invalid email or password",
                                        code: "INVALID_CREDENTIALS",
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/users/me": {
                get: {
                    tags: ["Users"],
                    summary: "Get the current user",
                    responses: {
                        "200": {
                            description: "Current user profile.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                    },
                },
            },
            "/api/users": {
                get: {
                    tags: ["Users"],
                    summary: "List users (ADMIN)",
                    parameters: [
                        { name: "q", in: "query", schema: { type: "string" }, description: "Search by name or email." },
                        {
                            name: "role",
                            in: "query",
                            schema: { type: "string", enum: ["PATIENT", "DOCTOR", "ADMIN"] },
                        },
                        { $ref: "#/components/parameters/Page" },
                        { $ref: "#/components/parameters/Limit" },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: ["name", "email", "role", "createdAt", "updatedAt"],
                                default: "createdAt",
                            },
                        },
                        { $ref: "#/components/parameters/SortOrder" },
                    ],
                    responses: {
                        "200": {
                            description: "Paginated users.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/PaginatedUsersResponse" },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                    },
                },
            },
            "/api/users/{id}": {
                parameters: [{ $ref: "#/components/parameters/IdPath" }],
                get: {
                    tags: ["Users"],
                    summary: "Get a user by id",
                    description: "ADMIN can read any user; other users can read only themselves.",
                    responses: {
                        "200": {
                            description: "User profile.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                patch: {
                    tags: ["Users"],
                    summary: "Update a user",
                    description: "ADMIN can update any user. Other users can update only themselves and cannot change `role`.",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": { schema: { $ref: "#/components/schemas/UpdateUserRequest" } },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Updated user.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/specializations": {
                get: {
                    tags: ["Specializations"],
                    summary: "List specializations",
                    security: [],
                    parameters: [
                        { name: "q", in: "query", schema: { type: "string" } },
                        { name: "isActive", in: "query", schema: { type: "string", enum: ["true", "false"] } },
                        { $ref: "#/components/parameters/Page" },
                        { $ref: "#/components/parameters/Limit" },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: { type: "string", enum: ["name", "createdAt", "updatedAt"], default: "name" },
                        },
                        { $ref: "#/components/parameters/SortOrder" },
                    ],
                    responses: {
                        "200": {
                            description: "Paginated specializations.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/PaginatedSpecializationsResponse" },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                    },
                },
                post: {
                    tags: ["Specializations"],
                    summary: "Create a specialization (ADMIN)",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/CreateSpecializationRequest" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Created specialization.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/SpecializationResponse" } },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "409": { $ref: "#/components/responses/Conflict" },
                    },
                },
            },
            "/api/specializations/{id}": {
                parameters: [{ $ref: "#/components/parameters/IdPath" }],
                get: {
                    tags: ["Specializations"],
                    summary: "Get a specialization",
                    security: [],
                    responses: {
                        "200": {
                            description: "Specialization.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/SpecializationResponse" } },
                            },
                        },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                patch: {
                    tags: ["Specializations"],
                    summary: "Update a specialization (ADMIN)",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UpdateSpecializationRequest" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Updated specialization.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/SpecializationResponse" } },
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
                    tags: ["Specializations"],
                    summary: "Delete a specialization (ADMIN)",
                    responses: {
                        "200": {
                            description: "Deleted.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/clinic-services": {
                get: {
                    tags: ["Clinic Services"],
                    summary: "List clinic services",
                    security: [],
                    parameters: [
                        { name: "q", in: "query", schema: { type: "string" } },
                        { name: "isActive", in: "query", schema: { type: "string", enum: ["true", "false"] } },
                        { $ref: "#/components/parameters/Page" },
                        { $ref: "#/components/parameters/Limit" },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: { type: "string", enum: ["name", "createdAt", "updatedAt"], default: "name" },
                        },
                        { $ref: "#/components/parameters/SortOrder" },
                    ],
                    responses: {
                        "200": {
                            description: "Paginated clinic services.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/PaginatedClinicServicesResponse" },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                    },
                },
                post: {
                    tags: ["Clinic Services"],
                    summary: "Create a clinic service (ADMIN)",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/CreateClinicServiceRequest" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Created clinic service.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ClinicServiceResponse" } },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "409": { $ref: "#/components/responses/Conflict" },
                    },
                },
            },
            "/api/clinic-services/{id}": {
                parameters: [{ $ref: "#/components/parameters/IdPath" }],
                get: {
                    tags: ["Clinic Services"],
                    summary: "Get a clinic service",
                    security: [],
                    responses: {
                        "200": {
                            description: "Clinic service.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ClinicServiceResponse" } },
                            },
                        },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                patch: {
                    tags: ["Clinic Services"],
                    summary: "Update a clinic service (ADMIN)",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UpdateClinicServiceRequest" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Updated clinic service.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ClinicServiceResponse" } },
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
                    tags: ["Clinic Services"],
                    summary: "Delete a clinic service (ADMIN)",
                    responses: {
                        "200": {
                            description: "Deleted.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/doctors": {
                get: {
                    tags: ["Doctors"],
                    summary: "List doctors",
                    security: [],
                    parameters: [
                        { name: "specializationId", in: "query", schema: { type: "string" } },
                        { name: "q", in: "query", schema: { type: "string" }, description: "Search by name or email." },
                        { $ref: "#/components/parameters/Page" },
                        { $ref: "#/components/parameters/Limit" },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: { type: "string", enum: ["createdAt", "updatedAt", "name"], default: "createdAt" },
                        },
                        { $ref: "#/components/parameters/SortOrder" },
                    ],
                    responses: {
                        "200": {
                            description: "Paginated doctors.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/PaginatedDoctorsResponse" },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                    },
                },
                post: {
                    tags: ["Doctors"],
                    summary: "Create a doctor profile (ADMIN)",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": { schema: { $ref: "#/components/schemas/CreateDoctorRequest" } },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Created doctor.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/DoctorResponse" } },
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
            "/api/doctors/{id}": {
                parameters: [{ $ref: "#/components/parameters/IdPath" }],
                get: {
                    tags: ["Doctors"],
                    summary: "Get a doctor",
                    security: [],
                    responses: {
                        "200": {
                            description: "Doctor.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/DoctorResponse" } },
                            },
                        },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                patch: {
                    tags: ["Doctors"],
                    summary: "Update a doctor (ADMIN)",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": { schema: { $ref: "#/components/schemas/UpdateDoctorRequest" } },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Updated doctor.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/DoctorResponse" } },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                delete: {
                    tags: ["Doctors"],
                    summary: "Delete a doctor (ADMIN)",
                    responses: {
                        "200": {
                            description: "Deleted.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/doctor-availabilities": {
                get: {
                    tags: ["Doctor Availability"],
                    summary: "List doctor availability windows",
                    description: "Public listing. Use `doctorId` to filter by doctor.",
                    security: [],
                    parameters: [
                        { name: "doctorId", in: "query", schema: { type: "string" } },
                        { name: "isActive", in: "query", schema: { type: "string", enum: ["true", "false"] } },
                        { name: "from", in: "query", schema: { type: "string", format: "date-time" } },
                        { name: "to", in: "query", schema: { type: "string", format: "date-time" } },
                        { $ref: "#/components/parameters/Page" },
                        { $ref: "#/components/parameters/Limit" },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: ["startsAt", "endsAt", "createdAt", "updatedAt"],
                                default: "startsAt",
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
                            description: "Paginated availability windows.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/PaginatedDoctorAvailabilitiesResponse" },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                    },
                },
                post: {
                    tags: ["Doctor Availability"],
                    summary: "Create an availability window (ADMIN or DOCTOR)",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/CreateDoctorAvailabilityRequest" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Created availability window.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/DoctorAvailabilityResponse" },
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
            "/api/doctor-availabilities/{id}": {
                parameters: [{ $ref: "#/components/parameters/IdPath" }],
                get: {
                    tags: ["Doctor Availability"],
                    summary: "Get an availability window",
                    security: [],
                    responses: {
                        "200": {
                            description: "Availability window.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/DoctorAvailabilityResponse" },
                                },
                            },
                        },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                patch: {
                    tags: ["Doctor Availability"],
                    summary: "Update an availability window (ADMIN or owning DOCTOR)",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UpdateDoctorAvailabilityRequest" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Updated availability window.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/DoctorAvailabilityResponse" },
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
                    tags: ["Doctor Availability"],
                    summary: "Delete an availability window (ADMIN or owning DOCTOR)",
                    responses: {
                        "200": {
                            description: "Deleted.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/doctor-services": {
                get: {
                    tags: ["Doctor Services"],
                    summary: "List doctor services",
                    description: "Public listing. Use `doctorId` to filter by doctor.",
                    security: [],
                    parameters: [
                        { name: "doctorId", in: "query", schema: { type: "string" } },
                        { name: "clinicServiceId", in: "query", schema: { type: "string" } },
                        { name: "isActive", in: "query", schema: { type: "string", enum: ["true", "false"] } },
                        { $ref: "#/components/parameters/Page" },
                        { $ref: "#/components/parameters/Limit" },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: ["createdAt", "updatedAt", "price", "durationMinutes"],
                                default: "createdAt",
                            },
                        },
                        { $ref: "#/components/parameters/SortOrder" },
                    ],
                    responses: {
                        "200": {
                            description: "Paginated doctor services.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/PaginatedDoctorServicesResponse" },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                    },
                },
                post: {
                    tags: ["Doctor Services"],
                    summary: "Add a service to a doctor (ADMIN or DOCTOR)",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/CreateDoctorServiceRequest" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Created doctor service.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/DoctorServiceResponse" } },
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
            "/api/doctor-services/{id}": {
                parameters: [{ $ref: "#/components/parameters/IdPath" }],
                get: {
                    tags: ["Doctor Services"],
                    summary: "Get a doctor service",
                    security: [],
                    responses: {
                        "200": {
                            description: "Doctor service.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/DoctorServiceResponse" } },
                            },
                        },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                patch: {
                    tags: ["Doctor Services"],
                    summary: "Update a doctor service (ADMIN or owning DOCTOR)",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UpdateDoctorServiceRequest" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Updated doctor service.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/DoctorServiceResponse" } },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                delete: {
                    tags: ["Doctor Services"],
                    summary: "Delete a doctor service (ADMIN or owning DOCTOR)",
                    responses: {
                        "200": {
                            description: "Deleted.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/appointments/availability": {
                get: {
                    tags: ["Appointments"],
                    summary: "Get available appointment slots",
                    description: "Calculates slots from active availability windows, the doctor service duration, and existing active appointments. " +
                        "Past slots are removed. The returned `timezone` describes how the date parameter was interpreted.",
                    security: [],
                    parameters: [
                        {
                            name: "doctorServiceId",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                        },
                        {
                            name: "date",
                            in: "query",
                            required: true,
                            schema: { type: "string", example: "2026-11-02" },
                            description: "Date in YYYY-MM-DD format.",
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Available slots.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/AvailabilityResponse" } },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "404": {
                            description: "Doctor service not found or inactive.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                                    example: {
                                        success: false,
                                        message: "Doctor service not found or inactive",
                                        code: "DOCTOR_SERVICE_NOT_FOUND",
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/appointments": {
                get: {
                    tags: ["Appointments"],
                    summary: "List appointments",
                    description: "Results are scoped by role: PATIENT sees own appointments, DOCTOR sees own appointments, ADMIN sees all. " +
                        "Patients and doctors cannot filter by another doctor/patient id.",
                    parameters: [
                        {
                            name: "status",
                            in: "query",
                            schema: { type: "string", enum: ["PENDING", "BOOKED", "COMPLETED", "CANCELED"] },
                        },
                        { name: "doctorId", in: "query", schema: { type: "string" } },
                        { name: "patientId", in: "query", schema: { type: "string" } },
                        { name: "doctorServiceId", in: "query", schema: { type: "string" } },
                        { name: "from", in: "query", schema: { type: "string", format: "date-time" } },
                        { name: "to", in: "query", schema: { type: "string", format: "date-time" } },
                        { $ref: "#/components/parameters/Page" },
                        { $ref: "#/components/parameters/Limit" },
                        {
                            name: "sortBy",
                            in: "query",
                            schema: {
                                type: "string",
                                enum: ["startsAt", "endsAt", "createdAt", "updatedAt", "status"],
                                default: "startsAt",
                            },
                        },
                        { $ref: "#/components/parameters/SortOrder" },
                    ],
                    responses: {
                        "200": {
                            description: "Paginated appointments.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/PaginatedAppointmentsResponse" },
                                },
                            },
                        },
                        "400": { $ref: "#/components/responses/ValidationError" },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                    },
                },
                post: {
                    tags: ["Appointments"],
                    summary: "Request an appointment",
                    description: "Creates a PENDING appointment request; the slot is held against double booking. " +
                        "The server derives end time, duration, and price from the doctor service. " +
                        "The time must be in the future and fully inside an active availability window. " +
                        "Admins must pass the target `patientId`; PATIENT/DOCTOR users can only book for themselves. " +
                        "An ADMIN must confirm the request via `PATCH /api/appointments/{id}/confirm` before a confirmation email is sent.",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/CreateAppointmentRequest" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Appointment request submitted with PENDING status.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/AppointmentResponse" } },
                            },
                        },
                        "400": {
                            description: "Validation failed, appointment is in the past, the time is not covered by availability, " +
                                "or `patientId` is missing/invalid for an admin booking.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                        "409": {
                            description: "The doctor already has an active appointment at this time.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                                    example: {
                                        success: false,
                                        message: "The doctor is not available at the selected time",
                                        code: "APPOINTMENT_CONFLICT",
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/appointments/{id}": {
                parameters: [{ $ref: "#/components/parameters/IdPath" }],
                get: {
                    tags: ["Appointments"],
                    summary: "Get an appointment",
                    description: "Accessible to the owning PATIENT, the doctor, or an ADMIN.",
                    responses: {
                        "200": {
                            description: "Appointment details.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/AppointmentDetailResponse" },
                                },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
                delete: {
                    tags: ["Appointments"],
                    summary: "Delete an appointment (ADMIN)",
                    description: "Permanently deletes the appointment row. Only ADMIN can delete. Prefer cancel for normal user flows because deletion cannot be undone.",
                    responses: {
                        "200": {
                            description: "Deleted.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } },
                            },
                        },
                        "401": { $ref: "#/components/responses/Unauthorized" },
                        "403": { $ref: "#/components/responses/Forbidden" },
                        "404": { $ref: "#/components/responses/NotFound" },
                    },
                },
            },
            "/api/appointments/{id}/confirm": {
                parameters: [{ $ref: "#/components/parameters/IdPath" }],
                patch: {
                    tags: ["Appointments"],
                    summary: "Confirm a pending appointment (ADMIN)",
                    description: "Only ADMIN can confirm. Moves the appointment from PENDING to BOOKED and sends the confirmation email " +
                        "to `appointment.patient.email` (never to an admin account).",
                    responses: {
                        "200": {
                            description: "Confirmed appointment.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/AppointmentResponse" } },
                            },
                        },
                        "400": {
                            description: "The appointment is already confirmed or cannot be confirmed in its current status.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                                    examples: {
                                        alreadyConfirmed: {
                                            value: {
                                                success: false,
                                                message: "Appointment is already confirmed",
                                                code: "APPOINTMENT_ALREADY_CONFIRMED",
                                            },
                                        },
                                        cannotConfirm: {
                                            value: {
                                                success: false,
                                                message: "Only pending appointments can be confirmed",
                                                code: "APPOINTMENT_CANNOT_BE_CONFIRMED",
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
            "/api/appointments/{id}/cancel": {
                parameters: [{ $ref: "#/components/parameters/IdPath" }],
                patch: {
                    tags: ["Appointments"],
                    summary: "Cancel an appointment",
                    description: "Only the owning PATIENT or an ADMIN can cancel. Cancellation is soft: the status becomes CANCELED and the row is retained.",
                    responses: {
                        "200": {
                            description: "Canceled appointment.",
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/AppointmentResponse" } },
                            },
                        },
                        "400": {
                            description: "The appointment is already canceled.",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                                    example: {
                                        success: false,
                                        message: "Appointment is already canceled",
                                        code: "APPOINTMENT_ALREADY_CANCELED",
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
        },
    },
    apis: [],
};
export const swaggerSpec = swaggerJsdoc(options);
//# sourceMappingURL=swagger.js.map