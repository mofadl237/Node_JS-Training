import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/DBConnection.js";

import {router as routerCategory }  from "./routing/category.js";


dotenv.config();

const app = express();

// ==========================
// Middleware
// ==========================

app.use(morgan("dev"));

app.use(express.json());

// ==========================
// Database
// ==========================

connectDB();

// ==========================
// Routes
// ==========================

app.use("/category", routerCategory);

// ==========================
// Home
// ==========================

app.get("/", (req: any, res: any) => {
  res.send("Get Api Data...");
});

// ==========================
// Server
// ==========================

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listen ... ${PORT}`);
});