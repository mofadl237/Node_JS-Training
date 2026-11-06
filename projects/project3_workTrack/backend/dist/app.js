import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { swaggerSpec } from "./config/swagger.js";
import { auditLogger } from "./middlewares/audit.middleware.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import attendanceRoutes from "./modules/Attendance/routes.js";
import authRoutes from "./modules/Auth/routes.js";
import auditLogRoutes from "./modules/AuditLogs/routes.js";
import dashboardRoutes from "./modules/Dashboard/routes.js";
import departmentRoutes from "./modules/Departments/routes.js";
import employeeRoutes from "./modules/Employees/routes.js";
import leaveRoutes from "./modules/Leaves/routes.js";
import shiftRoutes from "./modules/Shifts/routes.js";
import uploadRoutes from "./modules/Uploads/routes.js";
const app = express();
const allowedOrigins = env.CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
const corsOrigin = allowedOrigins.includes("*") ? true : allowedOrigins;
app.disable("x-powered-by");
app.get("/api-docs.json", (_req, res) => {
    res.status(200).json(swaggerSpec);
});
app.use("/api-docs", helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }), swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: `${env.APP_NAME} API Docs`,
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        tagsSorter: "alpha",
        operationsSorter: "alpha",
    },
}));
app.use(helmet());
app.use(cors({
    origin: corsOrigin,
    credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(auditLogger);
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        status: "ok",
        service: "worktrack-api",
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: `${env.APP_NAME} API - Ready`,
        version: "1.0.0",
    });
});
app.use("/api/auth", authRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/uploads", uploadRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map