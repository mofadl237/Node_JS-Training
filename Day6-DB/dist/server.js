import express from "express";
import dotenv from "dotenv";
import { Client } from "pg";
dotenv.config();
const app = express();
// 1- MiddleWares
app.use(express.json());
// 2-Connect DB
const client = new Client({
    host: process.env.HOST,
    port: parseInt(process.env.PORT || "5432"),
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});
async function ConnectDB() {
    await client.connect();
    console.log("Connected to PostgreSQL");
    const results = await client.query("SELECT * FROM users");
    console.log(results.rows);
    await client.end();
}
ConnectDB();
//# sourceMappingURL=server.js.map