import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/DBConnection.js";
import { router } from "./routing/category.js";
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
app.use("/category", router);
// ==========================
// Home
// ==========================
app.get("/", (req, res) => {
    res.send("Get Api Data...");
});
// ==========================
// Server
// ==========================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Listen ... ${PORT}`);
});
//# sourceMappingURL=index.js.map