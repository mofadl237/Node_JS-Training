import "dotenv/config";
import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

const app: Application = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",").map((o) => o.trim()) || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "clinica-api",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Clinica API - Ready",
    version: "1.0.0",
  });
});

import authRoutes from "./modules/auth/routes.js";
import doctorsRoutes from "./modules/doctors/router.js";
import specializationRoutes from "./modules/specialization/router.js";
import clinicServiceRoutes from "./modules/clinicService/router.js";
import doctorAvailabilityRoutes from "./modules/doctorAvailability/router.js";
import doctorServiceRoutes from "./modules/doctorService/router.js";
import appointmentRoutes from "./modules/appointment/router.js";
import userRoutes from "./modules/users/router.js";

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/specializations", specializationRoutes);
app.use("/api/clinic-services", clinicServiceRoutes);
app.use("/api/doctor-availabilities", doctorAvailabilityRoutes);
app.use("/api/doctor-services", doctorServiceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
