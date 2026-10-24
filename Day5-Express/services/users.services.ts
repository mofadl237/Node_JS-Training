import { pool } from "../config/db.js";

export const getUsersServices = async()=>{
    const result = await pool.query(
  "SELECT * FROM users ORDER BY id"
);
 return result;
} 

// وباقي ال Cruds operation بقا
